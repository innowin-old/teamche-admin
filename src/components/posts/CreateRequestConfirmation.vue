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
          <td>{{ props.item.text }}</td>
          <td>
            <v-btn flat icon color="orange" class="tools-button" v-on:click="editRecord(props.item.id)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn flat icon color="red" dark class="tools-button" v-on:click="deleteRecord(props.item.id, props.index)">
              <v-icon>delete</v-icon>
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
        title: 'Products',
        search: '',
        pagination: {
          rowsPerPage: 10
        },
        selected: [],
        headers: [
          { text: 'ID', value: 'id', align: 'left' },
          { text: 'Title', value: 'title', align: 'left' },
          { text: 'Text', value: 'text', align: 'left' },
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
      usersResult: function(val) {
        this.items = val;
        this.loading = false;
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/posts/create_confirmation/?format=json',
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
              url: "http://restful.daneshboom.ir/posts/" + id + "/",
              method: 'del',
              token: this.$cookie.get('teamche_token'),
              result: 'categoryDeleteResult',
            }
            this.$socket.emit('rest request', body);
            this.$delete(this.items, index);
            this.items.splice(index);
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
