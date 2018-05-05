<template>
  <div>
    <v-container>
      <v-card-title>
        <div class="buttons">
          <v-btn color="success" dark v-on:click="navigate('Import-Upgrade-Requests')">Import</v-btn>
          <v-btn color="pink" dark>Export</v-btn>
          <v-btn color="cyan" dark v-on:click="navigate('New-Upgrade-Request')">New Upgrade Request</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          label="Search"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        v-bind:headers="headers"
        v-bind:items="items"
        v-bind:search="search"
        v-bind:pagination.sync="pagination"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.upgrade_request_related_user }}</td>
          <td>{{ props.item.first_name }}</td>
          <td>{{ props.item.last_name }}</td>
          <td>{{ props.item.gender }}</td>
          <td>{{ props.item.type }}</td>
          <td>
            <v-btn flat icon color="green" class="tools-button" v-on:click="activate(props.item.id)">
              <v-icon>done</v-icon>
            </v-btn>
            <v-btn flat icon color="red" dark class="tools-button" v-on:click="deleteRecord(props.item.id, props.index)">
              <v-icon>close</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        items: [],
        title: 'Upgrade Requests',
        search: '',
        pagination: {
          rowsPerPage: 10
        },
        selected: [],
        headers: [
          { text: 'ID', value: 'id', align: 'left' },
          { text: 'Related User', value: 'upgrade_request_related_user', align: 'left' },
          { text: 'First Name', value: 'first_name', align: 'left' },
          { text: 'Last Name', value: 'last_name', align: 'left' },
          { text: 'Gender', value: 'gender', align: 'left' },
          { text: 'Upgrade Type', value: 'type', align: 'left' },
          { text: '' }
        ],
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false
      }
    },
    computed: {
      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.items.length / this.pagination.rowsPerPage)
      }
    },
    sockets: {
      usersResult: function(val) {
        this.items = val
      },
      activateResult: function(val) {
        console.log(val)
        if ('id' in val){
          for (var i = 0; i < this.items.length; i++){
            if (this.items[i].id == val.id){
              this.items.splice(i, 1)
            }
          }
        }
      },
      deactivateResult: function(val) {
        console.log(val)
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/users/upgrade-requests/?format=json',
        token: this.$cookie.get('teamche_token'),
        method: 'get',
        result: 'usersResult'
      }
      this.$socket.emit('rest request', body)
    },
    methods: {
      navigate: function(path) {
        this.$router.push(path)
      },
      activate: function(id) {
        var data = {
          active_flag: true
        }
        var body = {
          url: 'http://teamche.daneshboom.ir/users/upgrade-requests/' + id + '/',
          token: this.$cookie.get('teamche_token'),
          method: 'patch',
          result: 'activateResult',
          data: data
        }
        this.$socket.emit('rest request', body)
      },
      deactivate: function(id) {
        var data = {
          active_flag: false
        }
        var body = {
          url: 'http://teamche.daneshboom.ir/users/upgrade-requests/' + id + '/',
          token: this.$cookie.get('teamche_token'),
          method: 'patch',
          result: 'deactivateResult',
          data: data
        }
        this.$socket.emit('rest request', body)
      },
      deleteRecord: function(id, index) {
        this.$swal({
          title: 'آیا مطمئنید که رکورد حذف شود ؟',
          text: "رکورد پس از حذف قابل بازگشت نخواهد بود",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'بله، آن را حذف کن',
          cancelButtonText: 'لغو',
        }).then((result) => {
          if (result.value) {
            var body = {
              url: "http://teamche.daneshboom.ir/users/upgrade-requests/" + id + "/",
              method: 'del',
              token: this.$cookie.get('teamche_token'),
              result: 'categoryDeleteResult',
            }
            this.$socket.emit('rest request', body);
            this.items.splice(index, 1);
            this.$swal(
              'خذف شد!',
              'رکورد مورد نظر شما با موفقیت حذف شد.',
              'success'
            )
          }
        });
      }
    }
  }
</script>

<style>
  .buttons {
    padding-top: 18px;
  }
  .buttons .btn:first-child {
    margin-left: 0;
  }
</style>
