<template>
  <div>
    <div class="TopMenu">
      <div class="row justify-content-between align-items-center">
        <div class="col mr-auto page-title">
          <i
            @click="$router.goBack()"
            class="mdi mdi-chevron-left cursor-pointer"
          />

          <!-- <i class="mdi mdi-translate" /> -->
          {{ $t('Language.language') }}

          <div class="sub-title">
            {{ $t('Language.choose_any_language_below') }}
          </div>
        </div>
      </div>
    </div>
    <div class="Settings wrap-alt bg-main">
      <div class="row space-lang">
        <div class="col-12">
          <ul class="menu-settings">
            <li
              v-for="(lang,index) in langList"
              :key="'lang'+index"
              @click="changeLanguage(lang.value)"
            >
              <div class="d-flex w-100 justify-content-between align-items-center">
                <div>
                  {{ lang.title }}
                  <div
                    v-if="lang.subtitle"
                    class="eng-text"
                  >
                    {{ lang.subtitle }}
                  </div>
                </div>
                <div>
                  <i
                    v-if="selectedLang==lang.value"
                    class="mdi mdi-check-circle text-teal mdi-24px"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="row footer">
        <div class="col-12 footer-text">
          <span>{{ $t('Settings.version') }} {{ appVersion }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSavedLocale, setLocale } from '@/setup/i18n-setup.js'
export default {
  name: 'Settings',
  data () {
    return {
      appVersion: '1.0.0',
      selectedLang: getSavedLocale(),
      langList: [
        {
          title: 'English',
          subtitle: '',
          value: 'en'
        },
        {
          title: 'हिंदी',
          subtitle: 'Hindi',
          value: 'hi'
        },
        {
          title: 'मराठी',
          subtitle: 'Marathi',
          value: 'mr'
        }
      ]
    }
  },
  mounted () {
    // required for Cordova
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  methods: {
    changeLanguage (locale) {
      setLocale(locale)
      this.selectedLang = locale
    },
    onDeviceReady () {
      this.appVersion = BuildInfo.version + ' (' + BuildInfo.versionCode + ')'
    }
  }
}
</script>
<style lang="scss">
.Settings {

  // background-position: center center;
  background-attachment: fixed;
  // min-height:100vh;
  // padding:15px;
  // margin-top: -100px;
  // padding-top:100px;
  .col {
    padding: 5px;
  }

  .menu-settings {
    list-style-type: none;
    margin: 0;
    padding: 0;
    .text-teal {
      color: var(--teal);
    }
    li {

      position: relative;
      padding: 15px 28px;
      background: var(--bg-color-alt);
      margin-bottom: 20px;
      border-radius: 2px;
      height: 72px;
      display: flex;
      align-items: center;
    }
    li:last-child {
      border-bottom: none;
    }
    .eng-text {
      color: var(--sub-text);
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
    // width: 100%;
    // background-color: #e8e9f2;
    height: 30px;
    font-size: 14px;
    left: 0;
    right: 0;
    .footer-text {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
}
.space-lang{
.col-12{
    margin-top: 30px;
}
}
.cursor-pointer{
margin-right: 5px;
}
.sub-title {
      color: var(--text-light);
      padding-left: 22px;
    }
</style>
