package goappmysql

import (
	"database/sql"
	"database/sql/driver"
	"errors"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/configmdl"
	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/sjsonhelpermdl"

	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/constantmdl"
	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/errormdl"
	"corelab.mkcl.org/MKCLOS/coredevelopmentplatform/corepkgv2/loggermdl"
	"github.com/tidwall/gjson"
	"github.com/tidwall/sjson"

	"github.com/gocraft/dbr/v2"
	"github.com/kisielk/sqlstruct"
)

var connectionError error
var sqlOnce sync.Once
var connectionConfig MySQLConnectionConfig
var connectionInstance *dbr.Connection

// MySQLConnection - MySQLConnection
type MySQLConnectionConfig struct {
	HostName        string        `json:"hostName" bson:"hostName"`
	Server          string        `json:"server" bson:"server"`
	Port            int           `json:"port" bson:"port"`
	Username        string        `json:"username" bson:"username"`
	Password        string        `json:"password" bson:"password"`
	Protocol        string        `json:"protocol" bson:"protocol"`
	Database        string        `json:"database" bson:"database"`
	Parameters      []param       `json:"params" bson:"params"`
	MaxIdleConns    int           `json:"maxIdleConns" bson:"maxIdleConns"`
	MaxOpenConns    int           `json:"maxOpenConns" bson:"maxOpenConns"`
	ConnMaxLifetime time.Duration `json:"connMaxLifetime" bson:"connMaxLifetime"`
}

// InitUsingJSON - InitUsingJSON

// InitConnection - InitConnection
func Init(configFilePath string) error {

	sqlOnce.Do(func() {
		configmdl.InitConfig(configFilePath, &connectionConfig)
		paramsString := strings.Builder{}

		if len(connectionConfig.Parameters) > 0 {
			for paramIndex, param := range connectionConfig.Parameters {
				if paramsString.String() == "" {
					paramsString.WriteString("?")
				}
				paramsString.WriteString(param.ParamKey)
				paramsString.WriteString("=")
				paramsString.WriteString(param.ParamValue)

				hasNextParam := paramIndex+1 < len(connectionConfig.Parameters)
				if hasNextParam {
					paramsString.WriteString("&")
				}
			}
		}
		conStr := strings.Builder{}
		conStr.WriteString(connectionConfig.Username)
		conStr.WriteString(":")
		conStr.WriteString(connectionConfig.Password)
		conStr.WriteString("@")
		conStr.WriteString(connectionConfig.Protocol)
		conStr.WriteString("(")
		conStr.WriteString(connectionConfig.Server)
		if connectionConfig.Port <= 0 || strings.TrimSpace(strconv.Itoa(connectionConfig.Port)) == "" {
			conStr.WriteString(":3306") // mysql default port is 3306
		} else {
			conStr.WriteString(":")
			conStr.WriteString(strconv.Itoa(connectionConfig.Port))
		}
		conStr.WriteString(")/")
		conStr.WriteString(connectionConfig.Database)
		conStr.WriteString(paramsString.String())
		connectionInstance, connectionError := dbr.Open("mysql", conStr.String(), nil)
		if errormdl.CheckErr1(connectionError) != nil {
			loggermdl.LogError("Init dbr.Open Err : ", connectionError)
			return
		}
		if connectionConfig.MaxIdleConns == 0 {
			connectionConfig.MaxIdleConns = constantmdl.MAX_IDLE_CONNECTIONS // default is 2
		}
		if connectionConfig.MaxOpenConns == 0 {
			connectionConfig.MaxOpenConns = constantmdl.MAX_OPEN_CONNECTIONS // default there's no limit
		}
		if connectionConfig.ConnMaxLifetime == 0 {
			connectionConfig.ConnMaxLifetime = constantmdl.CONNECTION_MAX_LIFETIME
		}
		connectionInstance.SetMaxIdleConns(connectionConfig.MaxIdleConns)
		connectionInstance.SetMaxOpenConns(connectionConfig.MaxOpenConns)
		connectionInstance.SetConnMaxLifetime(connectionConfig.ConnMaxLifetime)
	})
	return connectionError
}

type param struct {
	ParamKey   string `json:"paramkey" bson:"paramkey"`
	ParamValue string `json:"paramvalue" bson:"paramvalue"`
}

//DBConnection Mysql DAO struct
type DBConnection struct {
	hostName   string
	connection *dbr.Connection
}

//GetMySQLConnection return Mysql connection instance
func GetMySQLConnection() *DBConnection {
	return &DBConnection{
		hostName:   "",
		connection: connectionInstance,
	}
}

// ExecQuery - ExecQuery
func (md *DBConnection) ExecQuery(query string, args ...interface{}) (string, error) {
	pingError := md.connection.Ping()
	if errormdl.CheckErr(pingError) != nil && pingError != driver.ErrBadConn {
		loggermdl.LogError(pingError)
		return "", errormdl.CheckErr(pingError)
	}
	result, execError := md.connection.Exec(query, args...)
	if errormdl.CheckErr(execError) != nil {
		loggermdl.LogError(execError)
		return "", errormdl.CheckErr(execError)
	}

	_, affectError := result.RowsAffected()
	if errormdl.CheckErr(affectError) != nil {
		loggermdl.LogError(affectError)
		return "", errormdl.CheckErr(affectError)
	}
	ID, err := result.LastInsertId()
	if errormdl.CheckErr(err) != nil {
		loggermdl.LogError(err)
		return "", errormdl.CheckErr(err)
	}
	return strconv.Itoa(int(ID)), nil
}

// SelectOne - SelectQuery
func (md *DBConnection) SelectOne(dest interface{}, query string, args ...interface{}) error {
	rv := reflect.ValueOf(dest)

	if rv.Kind() != reflect.Ptr || rv.Elem().Kind() != reflect.Struct {
		return errors.New("dest must be pointer to struct")
	}
	// loggermdl.LogSpot(connection)
	pingError := md.connection.Ping()
	if errormdl.CheckErr(pingError) != nil && pingError != driver.ErrBadConn {
		loggermdl.LogError(pingError)
		return errormdl.CheckErr(pingError)
	}
	rows, queryError := md.connection.Query(query, args...)
	if errormdl.CheckErr(queryError) != nil {
		loggermdl.LogError(queryError)
		return errormdl.CheckErr(queryError)
	}
	defer rows.Close()

	rows.Next()
	if rows.Err() != nil {
		return rows.Err()
	}
	err := sqlstruct.Scan(dest, rows)
	if err != nil {
		return err
	}

	return nil
}

// SelectAll -
func (md *DBConnection) SelectAll(result interface{}, query string, args ...interface{}) error {
	resultv := reflect.ValueOf(result)
	if resultv.Kind() != reflect.Ptr || resultv.Elem().Kind() != reflect.Slice {
		return errors.New("result argument must be slice address")
	}
	rows, err := md.connection.Query(query, args)
	defer rows.Close()
	if err != nil {
		return err
	}
	slicev := resultv.Elem()
	slicev = slicev.Slice(0, slicev.Cap())
	sliceElem := slicev.Type().Elem()
	i := 0
	for rows.Next() {
		if slicev.Len() == i {
			elem := reflect.New(sliceElem)
			err := sqlstruct.Scan(elem.Interface, rows)
			if err != nil {
				return err
			}
			slicev = reflect.Append(slicev, elem.Elem())
		} else {
			err = sqlstruct.Scan(slicev.Index(i).Addr().Interface(), rows)
			if err != nil {
				return err
			}
		}
		i++
	}
	if rows.Err() != nil {
		return rows.Err()
	}
	resultv.Elem().Set(slicev.Slice(0, i))
	return nil
}

// ExecTxQuery - ExecTxQuery
func ExecTxQuery(query string, tx *sql.Tx, args ...interface{}) (string, error) {

	result, execError := tx.Exec(query, args...)
	if errormdl.CheckErr(execError) != nil {
		loggermdl.LogError(execError)
		return "", errormdl.CheckErr(execError)
	}
	_, affectError := result.RowsAffected()
	if errormdl.CheckErr(affectError) != nil {
		loggermdl.LogError(affectError)
		return "", errormdl.CheckErr(affectError)
	}
	ID, err := result.LastInsertId()
	if errormdl.CheckErr(err) != nil {
		loggermdl.LogError(err)
		return "", errormdl.CheckErr(err)
	}
	return strconv.Itoa(int(ID)), nil
}

// SelectTxQuery - SelectTxQuery
func SelectTxQuery(query string, tx *sql.Tx, args ...interface{}) (*gjson.Result, error) {
	rows, queryError := tx.Query(query, args...)
	if errormdl.CheckErr(queryError) != nil {
		loggermdl.LogError(queryError)
		return nil, errormdl.CheckErr(queryError)
	}
	defer rows.Close()
	columns, err := rows.Columns()
	if errormdl.CheckErr2(err) != nil {
		loggermdl.LogError("GetAllData rows.Columns() Err : ", err)
		return nil, errormdl.CheckErr2(err)
	}
	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))
	tableData := "[]"
	for rows.Next() {
		for i := 0; i < len(columns); i++ {
			valuePtrs[i] = &values[i]
		}
		rows.Scan(valuePtrs...)
		data, err := sjsonhelpermdl.SetMultiple("", columns, values)
		if errormdl.CheckErr3(err) != nil {
			loggermdl.LogError("GetAllData sjson.Set Err : ", err)
			return nil, errormdl.CheckErr3(err)
		}
		tableData, err = sjson.Set(tableData, "-1", gjson.Parse(data).Value())
		if errormdl.CheckErr3(err) != nil {
			loggermdl.LogError("GetAllData sjson.Set Err : ", err)
			return nil, errormdl.CheckErr3(err)
		}
	}
	resultSet := gjson.Parse(tableData)
	return &resultSet, nil
}
