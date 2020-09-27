<template>
  <div class="BottomMenu">
    <div class="d-flex justify-content-between">
      <div class="active">
        <router-link to="/">
          <div class="menu-item">
            <i class="mdi mdi-home-variant-outline" />
          </div>
        </router-link>
      </div>
      <div>
        <router-link to="/Presentations">
          <div class="menu-item">
            <i class="mdi mdi-presentation" />
          </div>
        </router-link>
      </div>
      <div>
        <router-link to="/Reports">
          <div class="menu-item">
            <i class="mdi mdi-chart-line" />
          </div>
        </router-link>
      </div>
      <div>
        <router-link to="/Students">
          <div class="menu-item">
            <i class="mdi mdi-account-multiple-outline" />
          </div>
        </router-link>
      </div>
      <div>
        <router-link to="/TeachingPlan">
          <div class="menu-item">
            <i class="mdi mdi-format-list-checks" />
          </div>
        </router-link>
      </div>
      <div class="qr-scan">
        <div
          @click="scanQrAndLogin"
          class="menu-item"
        >
          <i class="mdi mdi-qrcode-scan" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MQL from '@/plugins/mql.js'

export default {
  name: 'BottomMenu',
  data () {
    return {
      // isActive: false
    }
  },
  methods: {
    login (sessionId) {
      let self = this
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('o.[LocalLogin]')
          .setData({
            employeeCode: 'E1006',
            mobileNumber: '9689416033',
            sessionId: sessionId
          })
          .fetch()
          .then(rs => {
            let res = rs.getActivity('LocalLogin', true)
            if (rs.isValid('LocalLogin') && res !== null) {
              resolve(res.result)
            } else {
              rs.showErrorToast('LocalLogin')
              reject()
            }
          })
      })
    },
    getTeacherDetails () {
      return new Promise((resolve, reject) => {
        new MQL()
          .setActivity('o.[GetTeacherDetailsByEmpCode]')
          .setData({
            employeeCode: 'E1006'
          })
          .fetch()
          .then(rs => {
            let res = rs.getActivity('GetTeacherDetailsByEmpCode', true)
            if (rs.isValid('GetTeacherDetailsByEmpCode') && res !== null) {
              console.debug(res.result[0])
              resolve(res.result[0])
            } else {
              rs.showErrorToast('GetTeacherDetailsByEmpCode')
              reject()
            }
          })
      })
    },
    toggleClass: function (event) {
      if (this.isActive) {
        this.isActive = false
      } else {
        this.isActive = true
      }
    },
    goForLogin (qrDetails) {
      this.login(qrDetails.guid).then(res => {
        localStorage.setItem('sessionId', qrDetails.guid)
        localStorage.setItem('user-token', res.token)
        this.getTeacherDetails().then(details => {
          this.$store.commit('teacherDetails', details)
          // this.$viewSync.startSyncing();
          this.$router.push('SelectClass')
        })
      })
    },
    scanQrAndLogin () {
      this.$router.push('QRScanner')
      // cordova.plugins.barcodeScanner.scan(
      //   res => {
      //     if (!res.cancelled && res.format == "QR_CODE") {
      //       try {
      //         let qrDetails = JSON.parse(res.text);
      //         this.goForLogin(qrDetails);
      //       } catch (err) {
      //         console.log(err);
      //       }
      //     }
      //   },
      //   err => {
      //     console.log(err);
      //   }
      // );
    }
  }
}
</script>
