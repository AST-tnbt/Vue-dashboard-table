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
        "ID", "Name", "Location", "Height", "Base", "Volume"
      ]);
      const items = ref<Array<{
        id: number;
        name: string;
        location: string;
        height: number;
        base: number;
        volume: number;
      }>>([]);
      
      const deleteItems = (delItems: Array<{
        id: number;
        name: string;
        location: string;
        height: number;
        base: number;
        volume: number;
      }>) => {
        // console.log("called")
        items.value = items.value.filter(item => 
          !delItems.some(delItem => delItem.id === item.id)
        );
      };
      const updateItem = (index: number, itemUpdation: Object) => {
        Object.assign(items.value[index], itemUpdation);
      } 
      const addItem = (newItem: { 
        id: number; 
        name: string; 
        location: string; 
        height: number; 
        base: number; 
        volume: number; }) => {
          items.value.push(newItem);
      }

      provide("headers", headers);
      provide("items", {items, deleteItems, updateItem, addItem});

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
