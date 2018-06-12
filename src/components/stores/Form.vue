<template>
  <v-container>
  <v-card>
    <v-card-text>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
            <v-form v-model="valid" ref="form" lazy-validation>

              <v-text-field
                label="Title"
                v-model="title"
                :rules="titleRules"
                :counter="100"
                v-bind:loading="loading"
                required
              ></v-text-field>

              <v-text-field
                label="Description"
                v-model="description"
                :rules="descriptionRules"
                :counter="200"
                v-bind:loading="loading"
                required
                multi-line
                dir="rtl"
              ></v-text-field>

              <v-text-field
                label="Phone Number"
                v-model="phoneNumber"
                :rules="phoneNumberRules"
                :counter="11"
                v-bind:loading="loading"
              ></v-text-field>

              <v-text-field
                label="Latitude"
                v-model="latitude"
                :rules="latitudeRules"
                :counter="15"
                v-bind:loading="loading"
              ></v-text-field>

              <v-text-field
                label="longitude"
                v-model="longitude"
                :rules="longitudeRules"
                :counter="15"
                v-bind:loading="loading"
              ></v-text-field>

              <v-btn v-show="latitude != '' && longitude != ''" v-on:click="showPosition">Show Position</v-btn>

              <v-text-field
                label="Address"
                v-model="address"
                :rules="addressRules"
                :counter="200"
                v-bind:loading="loading"
              ></v-text-field>

              <v-select
                label="Related Category"
                v-model="relatedCategory"
                :items="relatedCategoryItems"
                :rules="[v => !!v || 'Category is required']"
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
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      </v-card>
      <v-card-title>
        <div class="buttons">
          <h2>Images</h2>
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
        v-bind:loading="imagesLoading"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td><img :src="'http://teamche.daneshboom.ir' + props.item.file_link" width="50"/></td>
          <td>
            <v-btn v-if="props.item.active_flag == true" flat small color="success" v-on:click="deactivate(props.item.id)">Active</v-btn>
            <v-btn v-else flat small color="error" v-on:click="activate(props.item.id)">Deactive</v-btn>
          </td>
          <td>
            <v-btn flat color="primary" v-on:click="showImage(props.item.file_link)">
              Show Image
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
</template>

<script>
  export default {
    data: () => ({
      id: null,
      title: 'Store',
      valid: true,
      loading: true,
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => v && v.length <= 100 || 'Title must be less than 100 characters'
      ],
      description: '',
      descriptionRules: [
        (v) => !!v || 'Description is required',
        (v) => v && v.length <= 200 || 'Description must be less than 100 characters'
      ],
      phoneNumber: '',
      phoneNumberRules: [
        (v) => !v || v.length <= 11 || 'Phone number must be less than 11 characters'
      ],
      latitude: '',
      latitudeRules: [
        (v) => !v || v.length <= 15 || 'Latitude must be less than 15 characters'
      ],
      longitude: '',
      longitudeRules: [
        (v) => !v || v.length <= 15 || 'Longitude must be less than 15 characters'
      ],
      address: '',
      addressRules: [
        (v) => !v || v.length <= 200 || 'Address must be less than 200 characters'
      ],
      relatedCategory: null,
      relatedCategoryItems: [],
      categories: [],
      items: [],
      search: '',
      pagination: {
        rowsPerPage: 10
      },
      selected: [],
      headers: [
        { text: 'ID', value: 'id', align: 'left' },
        { text: 'Link', value: 'file_link', align: 'left' },
        { text: 'Status' },
        { text: '' }
      ],
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      imagesLoading: true
    }),
    computed: {
      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.items.length / this.pagination.rowsPerPage)
      }
    },
    methods: {
      showImage(link) {
        window.open('http://teamche.daneshboom.ir' + link, '_blank');
      },
      activate: function(id) {
        var data = {
          active_flag: true
        }
        var body = {
          url: 'http://teamche.daneshboom.ir/base/files/' + id + '/',
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
          url: 'http://teamche.daneshboom.ir/base/files/' + id + '/',
          token: this.$cookie.get('teamche_token'),
          method: 'patch',
          result: 'deactivateResult',
          data: data
        }
        this.$socket.emit('rest request', body)
      },
      showPosition () {
        window.open('https://www.google.com/maps/place/' + this.latitude + ',' + this.longitude, '_blank');
      },
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          var category_value = 0
          for(var i = 0; i < this.categories.length; i++){
            if(this.categories[i].title == this.relatedCategory){
              category_value = this.categories[i].id
              break
            }
          }

          var data = {
            title: this.title,
            description: this.description,
            phone_number: this.phoneNumber,
            latitude: this.latitude,
            longitude: this.longitude,
            address: this.address,
            store_related_category: category_value
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/stores/' + this.id + '/',
              method: 'patch',
              result: 'newStoreProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/stores/',
              method: 'post',
              result: 'newStoreProcess',
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
              url: "http://teamche.daneshboom.ir/base/files/" + id + "/",
              method: 'del',
              token: this.$cookie.get('teamche_token'),
              result: 'imageDeleteResult',
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
    },
    sockets: {
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
      },
      newStoreResult: function(value) {
        this.categories = value
        for(var i = 0; i < this.categories.length; i++){
          this.relatedCategoryItems.push(this.categories[i].title)
        }
        console.log(this.relatedCategoryItems)

        if (this.getParameterByName('id') != null) {
          this.id = this.getParameterByName('id');
          var updateBody = {
            url: 'http://teamche.daneshboom.ir/stores/' + this.id + '/?format=json',
            token: this.$cookie.get('teamche_token'),
            method: 'get',
            result: 'getStoreResult'
          }
          this.$socket.emit('rest request', updateBody)

          var imagesBody = {
            url: 'http://teamche.daneshboom.ir/base/files/?file_related_parent=' + this.id,
            token: this.$cookie.get('teamche_token'),
            method: 'get',
            result: 'getProductImages'
          }
          console.log(imagesBody);
          this.$socket.emit('rest request', imagesBody);

        } else {
          this.loading = false;
        }
        console.log(this.getParameterByName('id'));        
      },
      newStoreProcess: function(value) {
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
            this.$router.push('/stores');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getProductImages: function(value) {
        console.log(value);
        this.items = value;
        this.imagesLoading = false;
      },
      getStoreResult: function(value) {
        console.log(value);
        this.title = value.title
        this.description = value.description
        this.phoneNumber = value.phone_number
        this.latitude = value.latitude
        this.longitude = value.longitude
        this.address = value.address

        for (var i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id == value.store_related_category.id)
            this.relatedCategory = this.categories[i].title
        }

        this.loading = false;
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/stores/categories/?format=json',
        token: this.$cookie.get('teamche_token'),
        method: 'get',
        result: 'newStoreResult'
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
