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

    <v-text-field
      label="Description"
      v-model="description"
      :rules="descriptionRules"
      :counter="200"
      v-bind:loading="loading"
      required
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
  </v-card-text>
  </v-card>
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
        (v) => v.length <= 11 || 'Phone number must be less than 11 characters'
      ],
      latitude: '',
      latitudeRules: [
        (v) => v.length <= 15 || 'Latitude must be less than 15 characters'
      ],
      longitude: '',
      longitudeRules: [
        (v) => v.length <= 15 || 'Longitude must be less than 15 characters'
      ],
      address: '',
      addressRules: [
        (v) => v.length <= 200 || 'Address must be less than 200 characters'
      ],
      relatedCategory: null,
      relatedCategoryItems: [],
      categories: []
    }),
    methods: {
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
              url: 'http://teamche.daneshboom.ir/users/badges/',
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
      }
    },
    sockets: {
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
      getStoreResult: function(value) {
        console.log(value);
        this.title = value.title
        this.description = value.description
        this.phoneNumber = value.phone_number
        this.latitude = value.latitude
        this.longitude = value.longitude
        this.address = value.address
        for (var i = 0; i < this.categories.length; i++) {
          if (this.categories[i].id == value.store_related_category)
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
