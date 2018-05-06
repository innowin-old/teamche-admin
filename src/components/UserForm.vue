<template>
  <v-container>
  <v-card>
  <v-card-text>
  <v-flex xs8>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field
      label="Username"
      v-model="username"
      :rules="usernameRules"
      :counter="100"
      required
    ></v-text-field>
    
    <v-text-field
      label="First Name"
      v-model="firstName"
      :rules="firstNameRules"
      :counter="50"
    ></v-text-field>

    <v-text-field
      label="Last Name"
      v-model="lastName"
      :rules="lastNameRules"
      :counter="50"
    ></v-text-field>

    <v-text-field
      label="Email"
      v-model="email"
      :rules="emailRules"
      :counter="50"
    ></v-text-field>

    <v-btn
      @click="submit"
      :disabled="!valid"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
  </v-flex>
  </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      title: 'New User',
      valid: true,
      username: '',
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => v && v.length <= 100 || 'Username must be less than 100 characters'
      ],
      firstName: '',
      firstNameRules: [
        (v) => !!v || 'First Name is required',
        (v) => v && v.length <= 50 || 'First Name must be less than 50 characters'
      ],
      lastName: '',
      lastNameRules: [
        (v) => !!v || 'Last Name is required',
        (v) => v && v.length <= 50 || 'National Code must be less than 50 characters'
      ],
      email: '',
      emailRules: [
        (v) => v.length == 0 || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      users: [],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      producer: false,
      investor: false,
      service_provider: false,
      checkbox: false
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {

          var user_data = {
            username: this.username,
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
          }

          var body = {
            token: this.$cookie.get('teamche_token'),
            url: 'http://teamche.daneshboom.ir/users/',
            method: 'post',
            result: 'newUserProcess',
            data: user_data
          }
          console.log(body)
          this.$socket.emit('rest request', body)
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    },
    sockets: {
      newOrganizationResult: function(value) {
        this.users = value
      },
      newUserProcess: function(value) {
        console.log(value)
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/users/?format=json',
        token: this.$cookie.get('teamche_token'),
        method: 'get',
        result: 'newOrganizationResult'
      }
      this.$socket.emit('rest request', body)
    }
  }
</script>
