<template>
  <transition name="modal">
    <div class="modal-mask modal-primary">
      <div class="modal-wrapper">
        <div class="modal-holder">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                default body
              </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <!--  <button class="modal-default-button" >
                  OK
                </button> -->
                <button
                  class="btn btn-defaultblue-rounded"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Modal'
}
</script>
<style lang="scss">
// --------------------------------------------------------
// MODAL
// --------------------------------------------------------
.modal.fade.show {
  display: block;
}

/* .custome-modal {
  .modal .modal-body {
    position: relative;
    overflow: hidden;
    text-align: center;
    min-height: 150px;
    padding: 40px 30px 50px 30px;
    .icon-box {
      text-align: center;
      i {
        color: #ff7272;
        font-size: 70px;
        text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
      }
    }
    h5 {
      line-height: 30px;
    }
    h6 {
      line-height: 20px;
      margin-bottom: 20px;
    }
    .btn {
      min-width: 110px;
      padding: 5px 15px;
    }
    .modal-close-btn {
      position: absolute;
      top: 6px;
      right: 6px;
      position: absolute;
      top: 6px;
      right: 6px;
      font-size: 18px;
      box-shadow: none;
      padding: 6px 5px;
      border-radius: 50%;
      line-height: 15px;
      margin: 0px 0px 0 15px;

      &:hover {
        background: #dddddd;
        opacity: 1;
      }
    }
  }
  .modal-content {
    border-radius: 8px;
    border: none;
    box-shadow: 3px 3px 20px 0 rgba(0, 0, 0, 0.3);
  }
  .modal-dialog {
    margin-top: 10%;
  }
  .modal-backdrop {
    background-color: #fff;
  }
} */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  // width: 60%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  /*max-height:95%;
  overflow-y:auto */
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 0px 0;
}

/*.modal-default-button {
  float: right;
}*/

.modal-mask.modal-primary {
  display: block;
  overflow-y: auto;
  .modal-wrapper {
    margin: 0;
    width: 100%;
    height: 100%;
    display: table;
    .modal-holder {
      display: table-cell;
      vertical-align: middle;
    }
  }
  .modal-container {
    padding: 15px 40px;
    background: lighten(#efefef, 2%);
  }
  .modal-header {
    padding: 25px 0;
    // justify-content: center;
    border: none;
    h5 {
      margin: 0;
      font-size: 22px;
      line-height: 28px;
      font-weight: 700;
    }
  }
  .modal-body {
    padding: 10px 0 15px;
    /*.form-control {box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.08);}*/
  }
  .modal-footer {
    padding: 10px 0;
    justify-content: center;
    border: none; /* background: $pricolor;*/
  }
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}
.modal-enter {
  transform: scale3d(0.5, 0.5, 0.5);
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
