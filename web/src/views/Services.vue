<template>
  <div>
    <div class="row top-menu-login">
      <div class="col-12">
        <div class="cta-holder">
          <span>
            <i @click="$router.goBack()" class="mdi mdi-chevron-left" />
          </span>
          <span class="page-title"> Services</span>
        </div>
      </div>
    </div>
    <div class="page-holder">
      <div class="card card-present">
          <div class="icon-holder" 
          style="background-image: url(&quot;https://superschoolstg.mkcl.org/cdn/subjects/default.jpg&quot;);">
          </div>
          <div class="details-holder">
              <div class="file-title">
              Basic electronics
            </div><div class="file-date">
              First year A
            </div></div></div>

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
          <i class="mdi mdi-plus" />
          Service
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
  .card-present {
    padding: 0;
    cursor: pointer;
    height: 100%;
}
  .card, .card-design-3 {
    border: none;
    padding: 40px 30px 30px 30px;
    margin-bottom: 30px;
    -webkit-transition: all .2s ease;
    transition: all .2s ease;
    position: relative;
    z-index: 1;
    background: var(--default-color);
    border-radius: var(--radius);
    cursor: pointer;
}
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
}

  .btn-action {
    margin-top: 15%;
  }

}
</style>
