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
        {
          title: 'ID',
          key: 'id',
          sortable: false,
        },
        {
          title: 'Name',
          key: 'name',
        },
        {
          title: 'Location',
          key: 'location',
        },
        {
          title: 'Height',
          key: 'height',
        },
        {
          title: 'Base',
          key: 'base',
        },
        {
          title: 'Volume',
          key: 'volume',
        },
        {
          key: 'edit',
          sortable: false,
        },
      ]);
      const items = ref([
      {
        id: 1,
        name: '🍎 Apple',
        location: 'Washington',
        height: '0.1',
        base: '0.07',
        volume: '0.0001',
      },
      {
        id: 2,
        name: '🍌 Banana',
        location: 'Ecuador',
        height: '0.2',
        base: '0.05',
        volume: '0.0002',
      },
      {
        id: 3,
        name: '🍇 Grapes',
        location: 'Italy',
        height: '0.02',
        base: '0.02',
        volume: '0.00001',
      },
      {
        id: 4,
        name: '🍉 Watermelon',
        location: 'China',
        height: '0.4',
        base: '0.3',
        volume: '0.03',
      },
      {
        id: 5,
        name: '🍍 Pineapple',
        location: 'Thailand',
        height: '0.3',
        base: '0.2',
        volume: '0.005',
      },
      {
        id: 6,
        name: '🍒 Cherries',
        location: 'Turkey',
        height: '0.02',
        base: '0.02',
        volume: '0.00001',
      },
      {
        id: 7,
        name: '🥭 Mango',
        location: 'India',
        height: '0.15',
        base: '0.1',
        volume: '0.0005',
      },
      {
        id: 8,
        name: '🍓 Strawberry',
        location: 'USA',
        height: '0.03',
        base: '0.03',
        volume: '0.00002',
      },
      {
        id: 9,
        name: '🍑 Peach',
        location: 'China',
        height: '0.09',
        base: '0.08',
        volume: '0.0004',
      },
      {
        id: 10,
        name: '🥝 Kiwi',
        location: 'New Zealand',
        height: '0.05',
        base: '0.05',
        volume: '0.0001',
      },
      ]);
      
      const deleteItems = (delItems: Object[]) => {
        items.value = items.value.filter(item => !delItems.includes(item.id));
      };
      const updateItem = (index: number, itemUpdation: Object) => {
        Object.assign(items.value[index], itemUpdation);
      } 
      const addItem = (newItem: { 
        id: number; 
        name: string; 
        location: string; 
        height: string; 
        base: string; 
        volume: string; }) => {
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
