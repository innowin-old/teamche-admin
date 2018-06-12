<template>
  <v-container>
  <v-card>
  <v-card-text>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs6>
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
      :counter="300"
      v-bind:loading="loading"
      required
      multi-line
      dir="rtl"
    ></v-text-field>

    <v-text-field
      label="Brand"
      v-model="brand"
      :rules="brandRules"
      :counter="20"
      v-bind:loading="loading"
      required
    ></v-text-field>

    <v-text-field
      label="Price"
      v-model="price"
      :rules="priceRules"
      :counter="20"
      v-bind:loading="loading"
      required
    ></v-text-field>

    <v-text-field
      label="Discount"
      v-model="discount"
      :rules="discountRules"
      :counter="10"
      v-bind:loading="loading"
    ></v-text-field>

    <v-select
      label="Related Store"
      v-model="relatedStore"
      :items="relatedStoreItems"
      :rules="[v => !!v || 'Store is required']"
      v-bind:loading="loading"
      required
      autocomplete
    ></v-select>

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
        <v-flex xs6>
          <v-form ref="form">
            
            <v-text-field
              label="Previous Title"
              v-model="previousTitle"
              v-bind:loading="loading"
              v-show="title != previousTitle"
            ></v-text-field>

            <v-text-field
              label="Previous Description"
              v-model="previousDescription"
              v-bind:loading="loading"
              multi-line
              v-show="description != previousDescription"
              dir="rtl"
            ></v-text-field>

            <v-text-field
              label="Previous Brand"
              v-model="previousBrand"
              v-bind:loading="loading"
              v-show="brand != previousBrand"
            ></v-text-field>

            <v-text-field
              label="Previous Price"
              v-model="previousPrice"
              v-bind:loading="loading"
              v-show="price != previousPrice"
            ></v-text-field>

            <v-text-field
              label="Previous Discount"
              v-model="previousDiscount"
              v-bind:loading="loading"
              v-show="discount != previousDiscount"
            ></v-text-field>

            <v-text-field
              label="Previous Related Store"
              v-model="previousRelatedStore"
              v-bind:loading="loading"
              v-show="relatedStore != previousRelatedStore"
            ></v-text-field>

            <v-text-field
              label="Previous Related Category"
              v-model="previousRelatedCategory"
              v-bind:loading="loading"
              v-show="relatedCategory != previousRelatedCategory"
            ></v-text-field>

          </v-form>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card-text>
  </v-card>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      id: null,
      title: 'Products',
      valid: true,
      loading: true,
      title: '',
      titleRules: [
        (v) => !!v || 'Title is required',
        (v) => v && v.length <= 100 || 'Title must be less than 100 characters'
      ],
      previousTitle: '',
      description: '',
      descriptionRules: [
        (v) => v && v.length <= 300 || 'Description must be less than 100 characters'
      ],
      previousDescription: '',
      brand: '',
      brandRules: [
        (v) => !!v || 'Brand is required',
        (v) => v && v.length <= 20 || 'Brand must be less than 20 characters'
      ],
      previousBrand: '',
      price: '',
      priceRules: [
        (v) => !!v || 'Price is required',
      ],
      previousPrice: null,
      discount: '',
      discountRules: [
        (v) => !v || v.length <= 20 || 'Discount must be less than 10 characters'
      ],
      previousDiscount: '',
      relatedStore: null,
      relatedStoreItems: [],
      stores: [],
      previousRelatedStore: null,
      relatedCategory: null,
      relatedCategoryItems: [],
      categories: [],
      previousRelatedCategory: null
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {

          var store_value = 0
          for(var i = 0; i < this.stores.length; i++){
            if(this.stores[i].title == this.relatedStore){
              store_value = this.stores[i].id
              break
            }
          }

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
            brand: this.brand,
            price: this.price,
            discount: this.discount,
            product_related_store: store_value,
            product_related_category: category_value
          }

          if (this.id != null) {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/products/' + this.id + '/',
              method: 'patch',
              result: 'newProductProcess',
              data: data
            }
          } else {
            var body = {
              token: this.$cookie.get('teamche_token'),
              url: 'http://teamche.daneshboom.ir/products/',
              method: 'post',
              result: 'newProductProcess',
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
      newProductResult: function(value) {
        this.stores = value
        for(var i = 0; i < this.stores.length; i++){
          this.relatedStoreItems.push(this.stores[i].title)
        }
        console.log(this.relatedStoreItems)

        var body = {
          url: 'http://teamche.daneshboom.ir/products/categories/?format=json',
          token: this.$cookie.get('teamche_token'),
          method: 'get',
          result: 'getCategoriesResult'
        }
        this.$socket.emit('rest request', body);

      },
      getCategoriesResult: function(value) {
        this.categories = value;
        for(var i = 0; i < this.categories.length; i++){
          this.relatedCategoryItems.push(this.categories[i].title)
        }
        console.log(this.relatedCategoryItems);

        if (this.getParameterByName('id') != null) {
          this.id = this.getParameterByName('id');
          var updateBody = {
            url: 'http://teamche.daneshboom.ir/products/' + this.id + '/?format=json',
            token: this.$cookie.get('teamche_token'),
            method: 'get',
            result: 'getProductResult'
          }
          this.$socket.emit('rest request', updateBody)
        } else {
          this.loading = false;
        }
        console.log(this.getParameterByName('id'));
      },
      newProductProcess: function(value) {
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
            this.$router.push('/products');
          });
        } else {
          this.$swal({
            type: 'error',
            title: 'Oops...',
            text: value[Object.keys(value)[0]]
          });
        }
      },
      getProductResult: function(value) {
        if (value.related_parent != null) {
          this.previousTitle = value.related_parent.title;
          this.previousDescription = value.related_parent.description;
          this.previousBrand = value.related_parent.brand;
          this.previousPrice = value.related_parent.price;
          if (value.related_parent.discount != null && 'value' in value.related_parent.discount)
            this.previousDiscount = value.related_parent.discount;

          for (var i = 0; i < this.stores.length; i++) {
            if (this.stores[i].id == value.related_parent.product_related_store.id)
              this.previousRelatedStore = this.stores[i].title
          }

          for (var j = 0; j < this.categories.length; j++) {
            if (this.categories[j].id == value.related_parent.product_related_category.id)
              this.previousRelatedCategory = this.categories[j].title
          }
        }
        this.title = value.title
        this.description = value.description
        this.brand = value.brand
        this.price = value.price
        if (value.discount != null && 'value' in value.discount)
          this.discount = value.discount.value

        for (var i = 0; i < this.stores.length; i++) {
          if (this.stores[i].id == value.product_related_store.id)
            this.relatedStore = this.stores[i].title
        }

        for (var j = 0; j < this.categories.length; j++) {
          if (this.categories[j].id == value.product_related_category.id)
            this.relatedCategory = this.categories[j].title
        }

        this.loading = false;
      }
    },
    created: function() {
      this.$store.dispatch('setTitle', this.title)
      var body = {
        url: 'http://teamche.daneshboom.ir/stores/?format=json',
        token: this.$cookie.get('teamche_token'),
        method: 'get',
        result: 'newProductResult'
      }
      this.$socket.emit('rest request', body);
    }
  }
</script>
