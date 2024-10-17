<template>
  <v-card class="mt-5 mx-5">
    <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    item-value="id"
    show-select
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CRUD</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">

            <template v-slot:activator="{ props }">
              <v-btn class="mb-2" color="primary" dark v-bind="props">
                New Item
              </v-btn>
            </template>

              <v-card>
                <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.name"
                      label="Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.location"
                      label="Location"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.height"
                      label="Height"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.base"
                      label="Base"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.volume"
                      label="Volume"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save">
                  Save
                </v-btn>
              </v-card-actions>

            </v-card>
          </v-dialog>

          
        </v-toolbar>
      </template>

      <template v-slot:item.edit="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>
  
<script>
  export default 
  {
    data: () => ({
      dialog: false,
      selected: [],
      headers:
      [
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
      ],

      items: [],

      editedIndex: -1,
      editedItem: {
        name: '',
        location: '',
        height: 0,
        base: 0,
        volume: 0,
      },
      defaultItem: {
        name: '',
        location: '',
        height: 0,
        base: 0,
        volume: 0,
      },
    }),

    computed: 
    {
      formTitle() 
      {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: 
    {
      dialog(val) 
      {
        val || this.close()
      },
    },

    created() 
    {
      this.initialize()
    },

    methods: 
    {
      initialize()
      {
        this.items = 
        [
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
        ]
      },

      editItem(item) 
      {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      close() 
      {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() 
      {
        if (this.editedIndex > -1) 
        {
          Object.assign(this.items[this.editedIndex], this.editedItem)
        } else 
        {
          const maxId = this.items.length > 0 
            ? Math.max(...this.items.map(item => item.id)) 
            : 1;

          this.editedItem.id = maxId + 1; 
          this.items.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>