<template>
  <v-app v-if="token">
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <div style="text-align: center">
        <img src="@/assets/logo.jpg" class="logo" />
      </div>
      <v-list>
        <v-list-group
          v-for="item in items"
          v-model="item.active"
          :key="item.title"
          :prepend-icon="item.icon"
          no-action
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title @click="navigate(item.path)">{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" :key="subItem.title" @click="">
            <v-list-tile-content>
              <v-list-tile-title @click="navigate(subItem.path)">{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
      dark
      color="primary"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawer"
      fixed
      app
    >
      <v-list>
        <v-list-tile v-on:click="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
  <v-app v-else>
    <Login/>
  </v-app>
</template>

<script>
import Login from './components/Login';

export default {
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      items: [{
        icon: 'dashboard',
        title: 'Dashboard',
        path: '/'
      },
      {
        icon: 'person',
        title: 'Users',
        path: '/users',
        items: [
          {
            title: 'Upgrade Requests',
            path: '/upgrade-requests'
          }
        ]
      },
      {
        icon: 'business',
        title: 'Stores',
        path: '/stores',
        items: [
          {
            title: 'Owner Confirmation',
            path: '/owner-request-confirmation'
          },
          {
            title: 'Offer Confirmation',
            path: '/offer-request-confirmation'
          },
          {
            title: 'Update Confirmation',
            path: '/stores/update-request-confirmation'
          }
        ]
      },
      {
        icon: 'devices',
        title: 'Products',
        path: '/products',
        items: [
          {
            title: 'Create Confirmation',
            path: '/products/create-request-confirmation'
          },
          {
            title: 'Update Confirmation',
            path: '/products/update-request-confirmation'
          },
          {
            title: 'Categories List',
            path: '/products/categories'
          },
          {
            title: 'Offers List',
            path: '/products/offers/'
          },
          {
            title: 'Offers Create Confirmation',
            path: '/products/offers/create_confirmation'
          },
          {
            title: 'Offers Update Confirmation',
            path: '/products/offers/update_confirmation'
          }
        ]
      },
      {
        icon: 'list',
        title: 'Posts',
        path: '/posts',
        items: [
          {
            title: 'Create Confirmation',
            path: '/posts/create-request-confirmation'
          },
          {
            title: 'Update Confirmation',
            path: '/posts/update-request-confirmation'
          }
        ]
      },
      {
        icon: 'list',
        title: 'Comments',
        path: '/comments',
        items: [
          {
            title: 'Create Confirmation',
            path: '/comments/create-request-confirmation'
          },
          {
            title: 'Update Confirmation',
            path: '/comments/update-request-confirmation'
          }
        ]
      },
      {
        icon: 'list',
        title: 'Slides',
        path: '/slides'
      }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false
    }
  },
  name: 'App',
  methods: {
    navigate: function(path) {
      this.$router.push(path)
    },
    logout: function() {
      this.$swal({
        title: 'آیا از سیستم خارج می شوید؟',
        text: "پس از خروج برای استفاده از سیستم بایست دوباره نام کاربری و رمز عبور وارد شود.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'بله از سیستم خارج شو',
        cancelButtonText: 'لغو',
      }).then((result) => {
        if (result.value) {
          this.$cookie.delete('teamche_token');
          location.reload();
        }
      });
    }
  },
  components: {
    Login
  },
  computed: {
    title: function () {
      return this.$store.getters.title
    },
    token: function () {
      return this.$store.getters.token
    }
  },
  sockets: {
    tokenVerifyResult: function(value) {
      console.log(value);
      if ('non_field_errors' in value) {
        this.$store.dispatch('setToken', '')
      } else {
        this.$store.dispatch('setToken', this.$cookie.get('teamche_token'));
      }
    }
  },
  created: function() {
    var body = {
      url: 'http://teamche.daneshboom.ir/api-token-verify/',
      method: 'post',
      result: 'tokenVerifyResult',
      data: {
        token: this.$cookie.get('teamche_token')
      }
    }
    this.$socket.emit('rest request', body);
    this.$store.dispatch('setToken', this.$cookie.get('teamche_token'));
  }
}
</script>

<style>
  .list__tile__content {
    cursor: pointer;
  }
  .logo {
    width: 60%;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  .list {
    border-top: 1px solid rgba(0, 0, 0, .12);
  }
</style>
