<template>
  <v-container>
  <v-card>
  <v-card-text>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field
      label="Username"
      v-model="username"
      :rules="usernameRules"
      :counter="100"
      v-bind:loading="loading"
      required
    ></v-text-field>

    <v-text-field
      label="First Name"
      v-model="firstName"
      :rules="firstNameRules"
      :counter="100"
      v-bind:loading="loading"
      required
    ></v-text-field>

    <v-text-field
      label="Last Name"
      v-model="lastName"
      :rules="lastNameRules"
      :counter="100"
      v-bind:loading="loading"
      required
    ></v-text-field>

    <v-text-field
      label="Email"
      v-model="email"
      :rules="emailRules"
      :counter="100"
      v-bind:loading="loading"
      required
    ></v-text-field>

    <v-select
      label="Gender"
      v-model="gender"
      :items="genderItems"
      :rules="[v => !!v || 'Gender is required']"
      v-bind:loading="loading"
      required
      autocomplete
    ></v-select>

    <v-btn
      @click="submit"
      :disabled="!valid"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
  </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      id: null,
      title: 'User',
      valid: true,
      loading: false,
      username: '',
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => v && v.length <= 100 || 'Username must be less than 100 characters'
      ],
      firstName: '',
      firstNameRules: [
        (v) => !!v || 'First Name is required',
        (v) => v && v.length <= 100 || 'First Name must be less than 100 characters'
      ],
      lastName: '',
      lastNameRules: [
        (v) => !!v || 'Last Name is required',
        (v) => v && v.length <= 100 || 'Last Name must be less than 100 characters'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => v && v.length <= 100 || 'Email must be less than 100 characters' 
      ],
      gender: null,
      genderItems: [
        'female',
        'male'
      ],
      users: []
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          /*var gender_value = 0
          for(var i = 0; i < this.users.length; i++){
            if(this.users[i].username == this.relatedUser){
              user_value = this.users[i].id
              break
            }
          }*/

          var data = {
            username: this.username,
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            gender: gender
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/users/' + this.id + '/',
              method: 'patch',
              result: 'newUserProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/users/',
              method: 'post',
              result: 'newUserProcess',
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
      newUserResult: function(value) {

      },
      newUserProcess: function(value) {
        console.log(value)
        if ('id' in value){
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
            this.$router.push('/users');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getUserResult: function(value) {
        console.log(value);
        this.username = value.username
        this.firstName = value.first_name
        this.lastName = value.last_name
        this.email = value.email
        this.gender = value.gender
        this.loading = false
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)

      if (this.getParameterByName('id') != null) {
        this.loading = true;
        this.id = this.getParameterByName('id');
        var updateBody = {
          url: 'http://teamche.daneshboom.ir/users/' + this.id + '/?format=json',
          token: this.$cookie.get('teamche_token'),
          method: 'get',
          result: 'getUserResult'
        }
        this.$socket.emit('rest request', updateBody)
      }

    }
  }
</script>
