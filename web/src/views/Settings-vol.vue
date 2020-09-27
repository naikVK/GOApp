<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i @click="$router.goBack()" class="mdi mdi-chevron-left" />
          </span>
          <span class="page-title"> Settings</span>
        </div>
      </div>
    </div>
    <div class="Settings wrap-alt bg-main">
      <div class="row">
        <div class="col-12">
          <!-- <div class="profile-settings">
            <div
              class="profile-info"
              @click="$router.push('Profile')"
            >
              <div>
                <div
                  v-if="$store.getters.profileImagePath!=''"
                >
                  <img
                    :src="$store.getters.profileImagePath"
                    alt="User Photo"
                    class="profile-img"
                  >
                </div>
                <div
                  class="profile-pic-letter-alt"
                  v-if="$store.getters.profileImagePath==''"
                >
                  <div class="first-letter-alt">
                    <div class="letter-alt">
                      {{ $store.getters.teacherDetails.basicInfo.fullName.substr(0,1).toUpperCase() }}
                    </div>
                  </div>
                </div>
              </div>
             
              <div class="profile-info-holder">
                <div class="user-name">
                  {{ $store.getters.teacherDetails.basicInfo.fullName }}
                </div>
               
              </div>
            </div>
          </div> -->

          <div class="logout">
            <div class="li-group">
              <div class="account-li">
                <div>
                  <i class="mdi mdi-power" />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss">
.Settings {
  background-attachment: fixed;
  .col {
    padding: 5px;
  }
  .footer {
    bottom: 0;
    height: 30px;
    font-size: 14px;
    left: 0;
    right: 0;
    overflow-x: hidden;
    .footer-text {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
  .profile-info {
    flex-direction: row;
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  .profile-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .profile-info-holder {
    .user-name {
      font-size: 24px;
      margin-left: 20px;
    }
    .view-profile-link {
      margin-left: 20px;
    }
  }
  .profile-pic-letter-alt {
    .first-letter-alt {
      width: 80px;
      height: 80px;
      .letter-alt {
        font-size: 24px;
        line-height: 0;
      }
    }
  }
}
.classroom-settings {
  cursor: pointer;
  margin-bottom: 15px;
  padding: 10px 10px 0px 10px;
  border-radius: 10px;
  background: var(--bg-color-alt);
}
.account-title {
  font-weight: 500;
  font-size: 18px;
  // padding-left: 20px;
  padding-bottom: 5px;
  margin-top: 30px;
  color: darken(rgb(126, 132, 170), 5%);
}
.settings-title {
  font-weight: 500;
  font-size: 18px;
  // padding-left: 20px;
  padding-bottom: 5px;
  margin-top: 30px;
  color: darken(rgb(126, 132, 170), 5%);
}
.logout {
  margin-bottom: 15px;
  padding: 10px 10px 0px 10px;
  border-radius: 10px;
  background: #fcf9f9;
  color: rgb(223, 91, 86);
}
// div{
//   padding-inline-start: 10px;
// }
.classroom-title {
  font-weight: 500;
  font-size: 18px;
  // padding-left: 20px;
  padding-bottom: 5px;
  color: darken(rgb(126, 132, 170), 5%);
  // padding-top: 10px;
}
.account-li {
  font-weight: 500;
  font-size: 18px;
  list-style-type: none;
  margin-bottom: 10px;
}
.li-group {
  // padding: 5px;
  padding: 5px 0;
}
.mdi-close,
.mdi-account,
.mdi-translate {
  margin-right: 8px;
  color: lighten(#46517e, 5%);
}
.mdi-power {
  margin-right: 8px;
  color: lighten(rgb(223, 91, 86), 5%);
}
</style>
