<template>
  <div class="TopMenu">
    <div class="row justify-content-between align-items-center">
      <div class="col mr-auto page-title">
        <i
          @click="$router.goBack()"
          class="mdi mdi-chevron-left pr-3 cursor-pointer"
        />
        <!-- {{ $t('TopMenu.xsuper_campus') }} -->
        {{ title }}
      </div>
      <div class="col-auto">
        <div class="d-flex">
          <!-- <div class="filter">
            <i class="mdi mdi-filter" />
          </div>-->
          <!-- <b-dropdown
            id="profile-button"
            right
            variant="link"
            size="lg"
            no-caret
            @click="$router.push('Settings')"
          > -->
          <span
            v-if="
              $store.getters.studentResponseSyncStatus === 'readyToSync' &&
                $store.getters.studentResponseSyncStatus !== 'notToSync'
            "
            id="syncing"
          >
            <i class="mdi mdi-sync spin-icon timeout" />
            <b-tooltip
              target="syncing"
              placement="bottom"
            >
              {{ $t('TopMenu.syncing_data') }}
            </b-tooltip>
          </span>
          <span
            id="synced"
            v-if="
              $store.getters.studentResponseSyncStatus === 'synced' &&
                $store.getters.studentResponseSyncStatus !== 'notToSync'
            "
          ><i class="mdi mdi-check-circle check-icon timeout" />
            <b-tooltip
              target="synced"
              placement="bottom"
            >
              {{ $t('TopMenu.data_up_to_date') }}
            </b-tooltip>
          </span>
          <div
            class="p-0"
            slot="button-content"
            no-caret
            @click="$router.push('Settings')"
          >
            <div class="user-img-alt">
              {{
                $store.getters.teacherDetails.basicInfo.fullName
                  .substr(0, 1)
                  .toUpperCase()
              }}
            </div>
          </div>
          <!-- <template>
              <div>
                <b-dropdown-item @click="$router.push('Settings')">
                  <i class="mdi mdi-settings" />
                  {{ $t('TopMenu.settings') }}
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="$route.path!='/'"
                  @click="$store.dispatch('logout')"
                >
                  <i class="mdi mdi-close" />
                  {{ $t('TopMenu.close_session') }}
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="$route.path!='/'"
                  @click="$store.dispatch('logout', true)"
                >
                  <i class="mdi mdi-power" />
                  {{ $t('TopMenu.logout') }}
                </b-dropdown-item>
              </div>
            </template> -->
          <!-- </b-dropdown> -->
        </div>
      </div>
    </div>
    <!-- <div class="d-flex flex-row-reverse  ">
      <div>
        <b-dropdown
          id="profile-button"
          right
          variant="link"
          size="lg"
          no-caret
        >
          <template
            class="p-0"
            slot="button-content"
            no-caret
          >
            <img
              src="../../../public/assets/images/user.jpg"
              class="user-img"
            >
          </template>
          <b-dropdown-item><i class="mdi mdi-power" /> Logout</b-dropdown-item>
        </b-dropdown>
    </div>-->

    <!-- <div class="col-md-1 menu-right pointer">
          <b-dropdown
            id="notifications"
            right
            variant="link"
            size="lg"
            no-caret
          >
            <template
              class="p-0"
              slot="button-content"
              no-caret
            >
              <div class="text-right mt-0 border-top-0 p-0 ">
                <a>
                  <i class="mdi mdi-bell" />
                </a>
              </div>
            </template>
            <b-dropdown-item><i class="mdi mdi-power" /> Logout</b-dropdown-item>
          </b-dropdown>
          <span
            :class="[isActive ? '' : ' closeSidebar']"
            @click="toggleClass()"
          >
            <span class="sidebar-icon">
              <i
                class="mdi mdi-settings-outline"
              />
            </span>
            <div
              class="sidebar"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  Menu
                </div>
                <div
                  class="close"
                >
                  <i class="mdi mdi-close" />
                </div>
              </div>
              <div class="menu-list">
                <div class="menu-item"> What's new</div>
                <div class="menu-item">Products </div>
                <div class="menu-item"> Help</div>
                <div class="menu-item"> About MKCL</div>
              </div>
            </div>
          </span>
    </div>-->
    <!-- </div> -->
  </div>
</template>

<script>
import MQL from '@/plugins/mql.js'

export default {
  name: 'TopMenu',
  data () {
    return {
      // isActive: false
    }
  },
  props: ['title'],
  methods: {
    logout () {
      let sessionId = localStorage.getItem('sessionId')
      new MQL()
        .setActivity('r.[TeacherLogout]')
        // .setData({ sessionId: sessionId })
        .fetch()
        .then((rs) => {
          alert('logout success')
          // console.log('rs =>' + JSON.stringify(rs))
          if (rs.isValid('TeacherLogout')) {
            let res = rs.getActivity('TeacherLogout', true)
            // console.log('res =>' + JSON.stringify(res))
            localStorage.removeItem('user-token')
            // start scanning for connected teacher
            this.$viewSync.stopSyncing()
          } else {
            rs.showErrorToast('TeacherLogout')
          }
        })
    },
    toggleClass: function (event) {
      if (this.isActive) {
        this.isActive = false
      } else {
        this.isActive = true
      }
    }
  }
}
</script>
