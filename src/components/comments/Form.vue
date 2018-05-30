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
    
    <v-select
      label="Related User"
      v-model="relatedUser"
      :items="relatedUserItems"
      :rules="[v => !!v || 'User is required']"
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
      title: 'User Badge',
      valid: true,
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => v && v.length <= 100 || 'Title  must be less than 100 characters'
      ],
      relatedUser: null,
      relatedUserItems: [],
      users: []
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          var user_value = 0
          for(var i = 0; i < this.users.length; i++){
            if(this.users[i].username == this.relatedUser){
              user_value = this.users[i].id
              break
            }
          }

          var data = {
            title: this.title,
            badge_user: user_value
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('daneshboom_token'),
              url: 'http://restful.daneshboom.ir/users/badges/' + this.id + '/',
              method: 'patch',
              result: 'newUserBadgeProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('daneshboom_token'),
              url: 'http://restful.daneshboom.ir/users/badges/',
              method: 'post',
              result: 'newUserBadgeProcess',
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
      newUserBadgeResult: function(value) {
        this.users = value
        for(var i = 0; i < this.users.length; i++){
          this.relatedUserItems.push(this.users[i].username)
        }
        console.log(this.relatedUserItems)

        if (this.getParameterByName('id') != null) {
          this.id = this.getParameterByName('id');
          var updateBody = {
            url: 'http://restful.daneshboom.ir/users/badges/' + this.id + '/?format=json',
            token: this.$cookie.get('daneshboom_token'),
            method: 'get',
            result: 'getUserBadgeResult'
          }
          this.$socket.emit('rest request', updateBody)
        }
        console.log(this.getParameterByName('id'));        
      },
      newUserBadgeProcess: function(value) {
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
            this.$router.push('/user-badges');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getUserBadgeResult: function(value) {
        console.log(value);
        this.title = value.title
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id == value.badge_user)
            this.relatedUser = this.users[i].username
        }
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://restful.daneshboom.ir/users/?format=json',
        token: this.$cookie.get('daneshboom_token'),
        method: 'get',
        result: 'newUserBadgeResult'
      }
      this.$socket.emit('rest request', body)

      /*if (this.getParameterByName('id') != null) {
        this.id = this.getParameterByName('id');
        var updateBody = {
          url: 'http://restful.daneshboom.ir/organizations/abilities/' + this.id + '/?format=json',
          token: this.$cookie.get('daneshboom_token'),
          method: 'get',
          result: 'getOrganizationAbilityResult'
        }
        this.$socket.emit('rest request', updateBody)
      }
      console.log(this.getParameterByName('id'));*/
    }
  }
</script>
