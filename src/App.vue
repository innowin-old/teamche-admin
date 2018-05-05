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
        <img src="@/assets/logo.svg" class="logo" />
      </div>
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content @click="navigate(item.path)">
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
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
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
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
        <v-list-tile @click="right = !right">
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
      },
      {
        icon: 'business',
        title: 'Stores',
        path: '/stores',
      },
      {
        icon: 'devices',
        title: 'Products',
        path: '/products'
      },
      {
        icon: 'list',
        title: 'Posts',
        path: '/posts'
      },
      {
        icon: 'copyright',
        title: 'Upgrade Requests',
        path: 'upgrade-requests'
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
  created: function() {
    this.$store.dispatch('setToken', this.$cookie.get('teamche_token'))
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
