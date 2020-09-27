<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i @click="$router.goBack()" class="mdi mdi-chevron-left" />
          </span>
          <span class="page-title"> Add service</span>
        </div>
      </div>
    </div>
    <div class="page-holder">
      <b-form-file
        v-model="uploadedLogoFile"
        :state="Boolean(uploadedLogoFile)"
        placeholder="Upload service photo"
        :drop-placeholder="$t('UploadLogo.drop_file_here')"
        accept="image/*"
        ref="file-input"
        required
        class="lg-input"
        @input="setInstituteLogo(uploadedLogoFile)"
      />
      <p id="btnDropzone" />

      <float-label
        label="Service name"
        class="mb-1 { 'vfl-label-active': Service name }"
      >
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <float-label label="Service description">
        <textarea class="form-control" v-model="serviceDescp" maxlength="100" />
      </float-label>
      <div class="btn-action">
        <button id="btn_con" class="btn btn-blue">
          <i class="mdi mdi-content-save" />
          Save
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.page-title {
  font-size: 24px;
  font-weight: 600;
  margin-left: 5px;
}
.page-holder {
  padding: 0 30px;
  .category {
    margin-bottom: 10px;
    margin-left: 14px;
    // margin-top: 30px;
  }
  textarea.form-control {
    height: 100px;
  }

  .btn-action {
    margin-top: 15%;
  }
  .custom-file {
    .custom-file-input {
      height: 50px;
      border-radius: 15px;
      border: 1px solid #ced4da;
      :focus {
        outline: none;
      }
    }
  }
}
</style>
