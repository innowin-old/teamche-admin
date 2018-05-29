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
      v-bind:loading="loading"
      required
    ></v-text-field>
    
    <v-select
      label="Related Parent"
      v-model="relatedParent"
      :items="relatedParentItems"
      v-bind:loading="loading"
      required
      autocomplete
    ></v-select>

    <v-select
      label="Related Store"
      v-model="relatedStore"
      :items="relatedStoreItems"
      :rules="[v => !!v || 'Parent is required']"
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
      title: 'Product Categories',
      valid: true,
      loading: true,
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => v && v.length <= 100 || 'Title  must be less than 100 characters'
      ],
      relatedParent: null,
      relatedParentItems: [],
      parents: [],
      relatedStore: null,
      relatedStoreItems: [],
      stores: []
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          var parent_value = 0
          for(var i = 0; i < this.parents.length; i++){
            if(this.parents[i] && this.parents[i].title  == this.relatedParent){
              parent_value = this.parents[i].id
              break
            }
          }

          var store_value = 0
          for(var i = 0; i < this.stores.length; i++){
            if(this.stores[i].title == this.relatedStore){
              store_value = this.stores[i].id
              break
            }
          }

          var data = {
            title: this.title,
            product_category_related_parent: parent_value,
            product_category_related_store: store_value
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/products/categories/' + this.id + '/',
              method: 'patch',
              result: 'newProductCategoryProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/products/categories/',
              method: 'post',
              result: 'newProductCategoryProcess',
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
      newProductCategoryResult: function(value) {
        this.parents = value
        for(var i = 0; i < this.parents.length; i++){
          this.relatedParentItems.push(this.parents[i].title)
        }
        console.log(this.relatedParentItems)

        var body = {
          url: 'http://teamche.daneshboom.ir/stores/?format=json',
          token: this.$cookie.get('teamche_token'),
          method: 'get',
          result: 'getStoresResult'
        }
        this.$socket.emit('rest request', body)

      },
      getStoresResult: function(value) {
        this.stores = value
        for(var i = 0; i < this.stores.length; i++){
          this.relatedStoreItems.push(this.stores[i].title)
        }
        console.log(this.relatedStoreItems)

        if (this.getParameterByName('id') != null) {
          this.id = this.getParameterByName('id');
          var updateBody = {
            url: 'http://teamche.daneshboom.ir/products/categories/' + this.id + '/?format=json',
            token: this.$cookie.get('teamche_token'),
            method: 'get',
            result: 'getProductCategoryResult'
          }
          this.$socket.emit('rest request', updateBody)
        } else {
          this.loading = false;
        }
        console.log(this.getParameterByName('id'));
      },
      newProductCategoryProcess: function(value) {
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
            this.$router.push('/products/categories');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getProductCategoryResult: function(value) {
        console.log(value);
        this.title = value.title
        for (var i = 0; i < this.parents.length; i++) {
          if (this.parents[i].id == value.product_category_related_parent)
            this.relatedParent = this.parents[i].title
        }

        for (var j = 0; j < this.stores.length; j++) {
          if (this.stores[j].id == value.product_category_related_store)
            this.relatedStore = this.stores[j].title
        }

        this.loading = false;
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/products/categories/?format=json',
        token: this.$cookie.get('teamche_token'),
        method: 'get',
        result: 'newProductCategoryResult'
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
