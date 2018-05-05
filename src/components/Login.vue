<template>
  <v-card flat>
    <v-toolbar dark color="primary" flat extended>
    </v-toolbar>
    <v-layout row pb-2>
      <v-flex xs4 offset-xs4>
        <v-card class="card--flex-toolbar">
          <v-toolbar card color="white" prominent>
            <v-toolbar-title class="body-2 grey--text">Login</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <img src="@/assets/gmail.svg" width="30"/>
            </v-btn>
            <v-btn icon>
              <img src="@/assets/linkedin.svg" width="30" />
            </v-btn>
            <v-btn icon>
              <img src="@/assets/yahoo.svg" width="30" />
            </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text style="min-height: 200px;">
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                label="Username"
                v-model="username"
                hint="Please enter username or email for login"
                :rules="usernameRules"
                :counter="20"
                required
              ></v-text-field>
              <v-text-field
                label="Password"
                v-model="password"
                :rules="passwordRules"
                hint="At least 8 characters"
                min="8"
                :append-icon="e3 ? 'visibility_off' : 'visibility'"
                :append-icon-cb="() => (e3 = !e3)"
                type="password"
                class="input-group--focused"
                :type="e3 ? 'password' : 'text'"
                required
              ></v-text-field>
              <v-checkbox
                label="Remember me"
                v-model="checkbox"
              ></v-checkbox>

              <v-btn
                @click="submit"
                :disabled="!valid"
                color="cyan"
                dark
              >
                Login
              </v-btn>
              <!--v-btn @click="clear" color="green" dark>clear</v-btn-->
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
  export default {
    name: 'Login',
    data: () => ({
      e3: true,
      valid: false,
      username: '',
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => v && v.length <= 20 || 'Username must be less than 20 characters'
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
      ],
      checkbox: true
    }),
    sockets: {
      loginResult: function(val) {
        this.$store.dispatch('setToken', val.token)
        this.$cookie.set('teamche_token', val.token, 30)
        this.$cookie.set('teamche_user', val.user.id, 30)
        this.$router.push('/')
        console.log(this.$store.getters.token)
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          var body = {
            url: 'http://teamche.daneshboom.ir/api-token-auth/',
            method: 'post',
            result: 'loginResult',
            data: {
              username: this.username,
              password: this.password
            }
          }
          console.log(body)
          this.$socket.emit('rest request', body)
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>

<style>
  .card--flex-toolbar {
    margin-top: -64px;
  }
  .layout.row.pb-2 {
    background-color: #fafafa;
  }
</style>
