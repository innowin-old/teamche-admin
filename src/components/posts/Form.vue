<template>
  <v-container>
  <v-card>
  <v-card-text>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field
      label="Title"
      v-model="title"
      :rules="titleRules"
      :counter="100"
      required
    ></v-text-field>
    
    <v-text-field
      label="Text"
      v-model="text"
      :rules="textRules"
      :counter="400"
      required
    ></v-text-field>

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
      title: 'Posts',
      valid: true,
      loading: false,
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => v && v.length <= 100 || 'Title must be less than 100 characters'
      ],
      text: '',
      textRules: [
        (v) => !!v || 'Text is required',
        (v) => v && v.length <= 400 || 'Text must be less than 400 characters'
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

          var data = {
            title: this.title,
            text: this.text
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/posts/' + this.id + '/',
              method: 'patch',
              result: 'newPostProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/posts/',
              method: 'post',
              result: 'newPostProcess',
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
      newPostResult: function(value) {

      },
      newPostProcessResult: function(value) {
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
            this.$router.push('/posts');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      newPostProcess: function(value) {
        console.log(value)
        if ('id' in value){
          if (this.imageData != "") {
            var data = {
              file_related_parent: value.id,
              file_path: this.imageData
            }

            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/base/files/upload_base64/',
              method: 'post',
              result: 'newPostProcessResult',
              data: data
            }

            this.$socket.emit('rest request', body);
          } else {
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
              this.$router.push('/posts');
            });
          }
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getPostResult: function(value) {
        console.log(value);
        this.title = value.title
        this.text = value.text
        if (value.image != null) {
          console.log(value.image)
          // this.file_path = 'http://localhost:8000' + value.image
          document.getElementById("previous").src = 'http://teamche.daneshboom.ir' + value.image
        }
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)

      if (this.getParameterByName('id') != null) {
        this.id = this.getParameterByName('id');
        var updateBody = {
          url: 'http://teamche.daneshboom.ir/posts/' + this.id + '/?format=json',
          token: this.$cookie.get('teamche_token'),
          method: 'get',
          result: 'getPostResult'
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
