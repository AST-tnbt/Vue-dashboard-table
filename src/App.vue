<template>
  <v-app>
    <Navigation/>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import Navigation from "./components/Navigation.vue";
  import { provide, ref } from "vue";
  export default {
    setup() {
      const headers = ref([
      "User ID","First Name","Last Name","Email","Date of Birth","Country",
      ]);
      const headerKeys = ref([
        "id",
        "f_name",
        "l_name",
        "email",
        "dob",
        "country",
        "edit",
      ]);
      const items = ref<Array<{
        id: number;
        f_name: string;
        l_name: string;
        email: string;
        dob: string;
        country: string;
      }>>([]);
      
      const deleteItems = (delId: Array<Number>) => {
        items.value = items.value.filter(item => 
          !delId.some(id => id === item.id)
        );
      };
      const removeItems = (delItems: Array<{
        id: number;
        f_name: string;
        l_name: string;
        email: string;
        dob: string;
        country: string;
      }>) => {
        items.value = items.value.filter(item => 
          !delItems.some(delItem => delItem.id === item.id)
        );
      };
      const updateItem = (index: number, itemUpdation: Object) => {
        Object.assign(items.value[index], itemUpdation);
      } 
      const addItem = (newItem: { 
        id: number;
        f_name: string;
        l_name: string;
        email: string;
        dob: string;
        country: string; }) => {
          items.value.push(newItem);
      }

      provide("headers", headers);
      provide("headerKeys", headerKeys);
      provide("items", {items, deleteItems, updateItem, addItem, removeItems});

      return {
        headers,
        items
      }
    },
    components: {
      Navigation,
    },
  };
</script>
