<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i @click="$router.goBack()" class="mdi mdi-chevron-left" />
          </span>
          <span class="page-title"> NGO registration</span>
        </div>
      </div>
    </div>
    <div class="page-holder">
      <float-label label="Name" class="{ 'vfl-label-active': Name }">
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <float-label label="Email id" class="{ 'vfl-label-active': Email id }">
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <float-label
        label="Contact no"
        class="{ 'vfl-label-active': Contact no }"
      >
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <float-label
        label="New password"
        class="{ 'vfl-label-active': New password }"
      >
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <float-label
        label="Confirm password"
        class="{ 'vfl-label-active': Confirm password }"
      >
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <div class="password-note">
        <span>
          <strong>Note</strong>
        </span>
        <span>
          : Enter a unique password with alphabets, numbers and symbols
        </span>
      </div>
      <div class="btn-holder">
        <span class="login">Create</span>
        <button id="btn_con" class="btn btn-blue btn-next ">
          <i class="mdi mdi-arrow-right" />
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
    margin-left: 22px;
  }
  .btn-radio {
    display: flex;
    // margin-left: 22px;
  }
  .password-note {
    color: #495057;
    font-size: 16px;
    margin-left: 5px;

  }
  .btn-holder {
    margin-top: 15%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .login {
      font-size: 22px;
      font-weight: 600;
      margin-right: 20px;
    }
    .btn-next {
      border-radius: 50%;
      width: 80px;
      height: 90px;
      min-width: 90px;
      font-size: 24px;
      // margin-top: 100px;
    }
  }
}
</style>
