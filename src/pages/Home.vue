<template>
  <v-card class="my-5 mx-5">
    <v-data-table
    v-model="selected"
    :headers="headersTable"
    :items="filteredItems"
    item-value="id"
    show-select
    >
      <template v-slot:top>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          class="mb-4 pr-4 ml-4 mt-4"
        ></v-text-field>

        <v-container>
          <v-select
          v-model="countryFilter"
          :items="countryOptions"
          label="Country"
          chips
          multiple
          class="w-25"
          ></v-select>
        </v-container>
       
        <v-toolbar flat>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn class="bg-blue-darken-4 mr-2" v-bind="props" >
                New User
              </v-btn>
              <v-btn color="red" dark @click="deleteItem" v-if="selected.length > 0">
                Delete
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
                      v-model="editedItem.f_name"
                      label="First name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.l_name"
                      label="Last name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.email"
                      label="Email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.dob"
                      label="Date of birth"
                      type="date"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field
                      v-model="editedItem.country"
                      label="Country"
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

          <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this users?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
            </v-card>
          </v-dialog>
          
        </v-toolbar>
      </template>

      <template v-slot:[`item.edit`]="{ item }">
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
  import { inject } from 'vue';
  export default 
  {
    setup() {
      const headers = inject("headers");
      const headerKeys = inject("headerKeys");
      const {items, deleteItems, updateItem, addItem} = inject("items");

      return {
        headers,
        headerKeys,
        items,
        deleteItems,
        updateItem,
        addItem
      }
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      selected: [],
      selectedItems: [],
      search: '',
      countryFilter: [],
      countryOptions: [],
      editedIndex: -1,
      editedItem: {
        f_name: "",
        l_name: "",
        email: "",
        dob: "",
        country: "",
      },
      defaultItem: {
        f_name: "",
        l_name: "",
        email: "",
        dob: "",
        country: "",
      },
      headersTable: [],
    }),

    computed: 
    {
      formTitle() 
      {
        return this.editedIndex === -1 ? 'New User' : 'Edit User'
      },

      filteredItems() 
      {
        let filtered = this.items;

        if (this.search)
        {
          const searchTerm = this.search.toLowerCase();
          filtered = filtered.filter(item => 
              item.f_name.toLowerCase().includes(searchTerm) ||
              item.l_name.toLowerCase().includes(searchTerm) ||
              item.country.toLowerCase().includes(searchTerm)
          );
        }

        filtered = filtered.filter(item => 
          this.countryFilter.length === 0 || this.countryFilter.includes(item.country)
        );

        return filtered;
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
        this.headersTable = this.headers.map((header, index) => ({ title: header, key: this.headerKeys[index]}))
        this.headersTable.push({ title: "Edit", key: this.headerKeys[this.headerKeys.length - 1] });
        this.countryOptions = [...new Set(this.items.map(item => item.country))];
      },

      editItem(item) 
      {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem() 
      {
        this.selectedItems = [...this.selected]; 
        this.dialogDelete = true
      },

      deleteItemConfirm() 
      {
        this.deleteItems(this.selectedItems);
        this.selected = [];
        this.closeDelete();
      },

      close() 
      {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() 
      {
        this.dialogDelete = false
        this.selectedItems = [];
      },

      save() 
      {
        if (this.editedIndex > -1) 
        {
          this.updateItem(this.editedIndex, this.editedItem);
        } else 
        {
          const maxId = this.items.length > 0 
            ? Math.max(...this.items.map(item => item.id)) 
            : 0;

          this.editedItem.id = maxId + 1; 
          this.addItem(this.editedItem);
        }
        this.close()
      },
    },
  }
</script>
