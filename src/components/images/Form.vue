<template>
  <v-container>
  <v-card>
  <v-card-text>
  <v-form v-model="valid" ref="form" lazy-validation>

    <v-btn color="primary" v-on:click="trigger" :disabled="loading">
      Choose File
      <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
    <input ref="avatar" type="file" name="avatar" id="avatar" v-on:change="upload">

    <v-btn
      @click="submit"
      :disabled="!valid"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>

    <br/>
    <img id="previous" v-show="imageData == ''" class="preview" />
    <img v-show="imageData != ''" class="preview" :src="imageData"/>

  </v-form>
  </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      id: null,
      title: 'Slides',
      valid: true,
      loading: false,
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => v && v.length <= 100 || 'Title must be less than 100 characters'
      ],
      link: '',
      linkRules: [
        (v) => !!v || 'Link is required',
        (v) => v && v.length <= 400 || 'Link must be less than 400 characters'
      ],
      file_path: '',
      imageData: ''
    }),
    methods: {
      upload (event) {
        // Reference to the DOM input element
        var input = event.target;
        // Ensure that you have a file before attempting to read it
        if (input.files && input.files[0]) {
          // create a new FileReader to read this image and convert to base64 format
          var reader = new FileReader();
          // Define a callback function to run, when FileReader finishes its job
          reader.onload = (e) => {
            // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
            // Read image as base64 and set to imageData
            this.imageData = e.target.result;
          }
          // Start the reader job - read file as a data url (base64 format)
          reader.readAsDataURL(input.files[0]);
        }
      },
      trigger: function() {
        this.$refs.avatar.click()
      },
      submit () {
        if (this.$refs.form.validate()) {

          if (this.imageData != ''){
            var data = {
              title: this.title,
              link: this.link,
              file_string: this.imageData
            }
          } else {
            var data = {
              title: this.title,
              link: this.link
            }
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/base/files/' + this.id + '/',
              method: 'patch',
              result: 'newImageProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/base/files/',
              method: 'post',
              result: 'newImageProcess',
              data: data
            }
          }
          console.log(body)
          this.$socket.emit('rest request', body)
        }
      },
      clear () {
        this.$refs.form.reset()
      },
      getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
    },
    sockets: {
      newImageResult: function(value) {

      },
      newImageProcessResult: function(value) {
        if ('status' in value && value.status == 'SUCCESS') {
          if (this.id != null) {
            var text_value = 'Record Updated.';
          } else {
            var text_value = 'Record Added.';
          }
          this.$swal({
            type: 'success',
            title: 'Successfully',
            text: text_value
          }).then((result) => {
            this.$router.push('/images');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      newSlideProcess: function(value) {
        console.log(value)
        if ('id' in value){
          /*if (this.imageData != "") {
            var data = {
              file_related_parent: value.id,
              file_path: this.imageData
            }

            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/base/files/upload_base64/',
              method: 'post',
              result: 'newSlideProcessResult',
              data: data
            }

            this.$socket.emit('rest request', body);
          } else {*/
            if ('id' in value) {
              if (this.id != null) {
                var text_value = 'Record Updated.';
              } else {
                var text_value = 'Record Added.';
              }
              this.$swal({
                type: 'success',
                title: 'Successfully',
                text: text_value
              }).then((result) => {
                this.$router.push('/images');
              });
            } else {
              this.$swal({
                type: 'error',
                title: 'Oops...',
                text: value[Object.keys(value)[0]]
              });
            }
          // }
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getImageResult: function(value) {
        console.log(value);
        if (value.file_link != null) {
          console.log(value.file_link)
          // this.file_path = 'http://localhost:8000' + value.image
          document.getElementById("previous").src = 'http://teamche.daneshboom.ir' + value.file_link
        }
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)

      if (this.getParameterByName('id') != null) {
        this.id = this.getParameterByName('id');
        var updateBody = {
          url: 'http://teamche.daneshboom.ir/base/files/' + this.id + '/?format=json',
          token: this.$cookie.get('teamche_token'),
          method: 'get',
          result: 'getImageResult'
        }
        this.$socket.emit('rest request', updateBody)
      }
      console.log(this.getParameterByName('id'));
    }
  }
</script>

<style>
  #avatar {
    display: none
  }
  .btn.primary {
    margin-left: 0;
  }
  img.preview {
    width: 50%;
    background-color: white;
    border: 1px solid #DDD;
    padding: 5px;
    margin-top: 25px;
  }
  div.card__text {
    min-height: 300px;
  }
</style>
