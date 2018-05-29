<template>
  <div>
    <v-container>
      <v-card-title>
        <div class="buttons">
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
        v-bind:loading="loading"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.title }}</td>
          <td>{{ props.item.store_related_category.title }}</td>
          <td>{{ props.item.store_related_user.first_name }} {{ props.item.store_related_user.last_name }}</td>
          <td v-if="props.item.store_related_owner">{{ props.item.store_related_owner.first_name }} {{ props.item.store_related_owner.last_name }}</td>
          <td v-else>-</td>
          <td>
            <v-btn flat icon color="orange" class="tools-button" v-on:click="navigate('/stores/update?id=' + props.item.id)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn flat icon color="green" class="tools-button" v-on:click="acceptUpdate(props.item.id, props.index)">
              <v-icon>done</v-icon>
            </v-btn>
            <v-btn flat icon color="red" dark class="tools-button" v-on:click="denyUpdate(props.item.id, props.index)">
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
        title: 'Stores',
        search: '',
        pagination: {
          rowsPerPage: 10
        },
        selected: [],
        headers: [
          { text: 'ID', value: 'id', align: 'left' },
          { text: 'Title', value: 'title', align: 'left' },
          { text: 'Category', value: 'store_related_category', align: 'left' },
          { text: 'Created User', value: 'store_related_user', align: 'left' },
          { text: 'Owner', value: 'store_related_owner', align: 'left' },
          { text: '' }
        ],
        dialog: false,
        notifications: false,
        sound: true,
        widgets: false,
        loading: true
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
      storesResult: function(val) {
        this.items = val;
        this.loading = false;
      },
      activateResult: function(val) {
        console.log(val)
        if ('id' in val){
          for(var i = 0; i < this.items.length; i++){
            if (this.items[i].id == val.id){
              this.items[i].active_flag  = true;
            }
          }
        }
      },
      deactivateResult: function(val) {
        console.log(val)
        if ('id' in val){
          for(var i = 0; i < this.items.length; i++){
            if (this.items[i].id == val.id){
              this.items[i].active_flag = false;
            }
          }
        }
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/stores/update_confirmation/',
        token: this.$cookie.get('teamche_token'),
        method: 'get',
        result: 'storesResult'
      }
      this.$socket.emit('rest request', body)
    },
    methods: {
      navigate: function(path) {
        this.$router.push(path)
      },
      acceptUpdate: function(id, index) {
        var body = {
          url: 'http://teamche.daneshboom.ir/stores/' + id + '/accept_update/',
          token: this.$cookie.get('teamche_token'),
          method: 'post',
          result: 'acceptResult'
        }
        this.$socket.emit('rest request', body)
        this.items.splice(index, 1);
      },
      denyUpdate: function(id, index) {
        var body = {
          url: 'http://teamche.daneshboom.ir/stores/' + id + '/deny_update/',
          token: this.$cookie.get('teamche_token'),
          method: 'post',
          result: 'denyResult'
        }
        this.$socket.emit('rest request', body)
        this.items.splice(index, 1);
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
              url: "http://teamche.daneshboom.ir/stores/" + id + "/",
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
