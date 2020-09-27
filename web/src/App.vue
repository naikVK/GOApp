<template>
  <div id="app">
    <div
      id="app-loader"
      v-if="isMainLoaderLoading()"
    >
      <img
        src="../public/assets/tail-spin.svg"
        alt="loader"
      >
    </div>

    <!-- <div id="nav">
      <router-link to="/">
        Home {{ $store.getters.isPageBlocked }}
      </router-link> |
      <router-link to="/about">
        About
      </router-link> |
      <router-link
        name="loginlink"
        to="/login"
      >
        Login
      </router-link> |
      <router-link to="/registration">
        Register
      </router-link> |
      <router-link to="/i18Demo">
        Languages
      </router-link> |
      <router-link to="/mqlRequestDemo">
        MQL Request
      </router-link> |
      <router-link to="/validator">
        Validator
      </router-link> |
      <router-link to="/browserCompatibility">
        Compatiblity
      </router-link> |
      <router-link to="/encryption">
        Encryption
      </router-link> |
      <router-link to="/cdnUpload">
        Cdn Upload
      </router-link>
    </div>-->
    <div class="container-fluid">
      <!-- <TopMenu /> -->
      <router-view />
      <!-- <BottomMenu /> -->
    </div>
  </div>
</template>

<script>
import TopMenu from '@/components/common/TopMenu'
import BottomMenu from '@/components/common/BottomMenu'
export default {
  components: { TopMenu, BottomMenu },
  data () {
    return {}
  }
}
</script>
<style lang="scss">
* {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

input,
textarea {
  -webkit-user-select: auto !important;
  -khtml-user-select: auto !important;
  -moz-user-select: auto !important;
  -ms-user-select: auto !important;
  user-select: auto !important;
}

.disable-dbl-tap-zoom {
  touch-action: manipulation;
}

#app-loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
