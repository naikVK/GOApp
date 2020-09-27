<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i @click="$router.goBack()" class="mdi mdi-chevron-left" />
          </span>
          <span class="page-title"> Create</span>
        </div>
      </div>
    </div>
    <div class="page-holder">
      <div class="category">
        Category
      </div>
      <div class="btn-radio">
        <div class="radio">
          <input id="radio-1" name="radio" type="radio" checked />
          <label for="radio-1" class="radio-label">
            <span class="name">Volunteer</span>
          </label>
        </div>
        <div class="radio">
          <input id="radio-1" name="radio" type="radio" checked />
          <label for="radio-1" class="radio-label">Ngo SPOC</label>
        </div>
      </div>
      <float-label
        label="Full name"
        class="mb-1 { 'vfl-label-active': Full name }"
      >
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <div class="password-note">
        <span>
          <strong>Note</strong>
        </span>
        <span>
          : Full name will be used as username later.
        </span>
      </div>
      <float-label label="Email id" class="{ 'vfl-label-active': Email id }">
        <input type="text" class="form-control custom-input" required />
      </float-label>
      <float-label label="Mobile no" class="{ 'vfl-label-active': Mobile no }">
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
    margin-left: 14px;
    // margin-top: 30px;
  }
  .btn-radio {
    display: flex;
    margin-left: 7px;
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
  .radio {
    margin: 0.5rem;
    input[type="radio"] {
      position: absolute;
      opacity: 0;
      + .radio-label {
        .name {
          margin-bottom: 0px;
        }
        &:before {
          content: "";
          background: #f4f4f4;
          border-radius: 100%;
          border: 1px solid darken(#f4f4f4, 25%);
          display: inline-block;
          width: 1.4em;
          height: 1.4em;
          position: relative;
          top: -0.2em;
          margin-right: 1em;
          vertical-align: top;
          cursor: pointer;
          text-align: center;
          transition: all 250ms ease;
        }
      }
      &:checked {
        + .radio-label {
          &:before {
            background-color: #3197ee;
            box-shadow: inset 0 0 0 4px #f4f4f4;
          }
        }
      }
      &:focus {
        + .radio-label {
          &:before {
            outline: none;
            border-color: #3197ee;
          }
        }
      }
      &:disabled {
        + .radio-label {
          &:before {
            box-shadow: inset 0 0 0 4px #f4f4f4;
            border-color: darken(#f4f4f4, 25%);
            background: darken(#f4f4f4, 25%);
          }
        }
      }
      + .radio-label {
        &:empty {
          &:before {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
