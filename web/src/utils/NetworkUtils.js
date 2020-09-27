import axios from "axios";

export default class NetworkUtils {
  constructor() { }
  static pingIp(url, timeout, options) {
    if (timeout == undefined || timeout == null) {
      timeout = 100;
    }
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: url,
        timeout: timeout
      }).then(res => {
        resolve(options)
      }).catch(err => {
        reject(err)
      });
    });
  }

  static scanServers(ipBase, node, port, isCancelled, onIpFound, onComplete) {
    let url = "http://" + ipBase + "." + node + ":" + port + "/";

    let onIpPingDone = found => {
      if (node > 225) {
        onComplete();
      } else {
        if (found) {
          onIpFound(ipBase + "." + node);
        }
        if (isCancelled()) {
          NetworkUtils.scanServers(
            ipBase,
            node + 1,
            port,
            isCancelled,
            onIpFound,
            onComplete
          );
        }
      }
    };

    NetworkUtils.pingIp(url, 100, {
      url: url
    })
      .then(options => {
        // console.log("done", url);
        onIpPingDone(true);
      })
      .catch(err => {
        if (err.response) {
          // console.log("found", node);
          onIpPingDone(true);
        } else {
          onIpPingDone(false);
        }
      });
  }
  static checkHostIsActive(url, onDone) {
    NetworkUtils.pingIp(url, 500, {
      url: url
    })
      .then(options => {
        // host is active
        onDone(true)
      })
      .catch(err => {
        if (err.response) {
          // host is active but 404 returned
          onDone(true);
        } else {
          onDone(false);
        }
      });
  }
  static isConnectedToWifi() {
    return navigator.connection.type == "wifi"
  }
  static RpiApis = {
    setTime : 'setTime',
    restartSCLocalServer : 'restartSCLocalServer',
    rebootDevice : 'rebootDevice',
    shutdownDevice : 'shutdownDevice'
  }
  static callRpiApi(serverIP, apiName, data) {
    return new Promise((resolve, _) => {
      axios.post('http://' + serverIP + ':9449/' + apiName, data ? data : null).then(() => {
        resolve(true)
      }).catch(() => {
        resolve(false)
      })
    })
  }
}