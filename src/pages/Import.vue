<template>
    <v-container>
        <v-form>
            <v-file-input
            label="Choose file import"
            accept=".csv, .xlsx"
            prepend-icon="mdi-file-upload"
            show-size
            v-model="file"
            @change="handleUploadFile"
            >
            </v-file-input>
        </v-form>
        <v-skeleton-loader type="table" v-if="loading"/>   
        <v-data-table
            v-if="itemsUpload.length > 0 && !loading"
            :items="itemsUpload"
        >
            <template v-slot:top>
                <v-toolbar color="blue-darken-4">
                    <v-toolbar-title>Preview Data</v-toolbar-title>
                </v-toolbar>
            </template>
        </v-data-table>
        <v-btn prepend-icon="mdi-upload" v-if="itemsUpload.length > 0 && !loading" class="mt-2 bg-blue-darken-4" @click="showUploadDialog">Upload</v-btn>
        <v-btn prepend-icon="mdi-broom" v-if="itemsUpload.length > 0 && !loading" class="mt-2 ml-2 bg-gray-darken-4" @click="showClearDialog">Clear</v-btn>
    </v-container>
    <v-dialog v-model="dialog" width="auto">
        <v-card
        max-width="400"
        prepend-icon="mdi-ticket-confirmation-outline"
        :text="this.dialogText"
        :title="this.dialogTitle" 
        >
            <template v-slot:actions>
            <v-btn
                text="Ok"
                @click="handleClickOk"
            ></v-btn>
            <v-btn
                text="Cancel"
                @click="dialog = false"
            ></v-btn>
            </template>
        </v-card>
    </v-dialog>
    <v-snackbar
      v-model="toast"
      :timeout="2000"
      variant="tonal"
      color="success"
      location="right"
      opacity
    >
      Upload successfully.
      <template v-slot:actions>
        <v-btn
          density="compact"
          variant="tonal"
          icon="mdi-close"
          @click="toast = false"
        >
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="errorToast"
      :timeout="2000"
      variant="tonal"
      color="error"
      location="right"
      opacity
    >
      The fields do not match.
      <template v-slot:actions>
        <v-btn
          density="compact"
          variant="tonal"
          icon="mdi-close"
          @click="errorToast = false"
        >
        </v-btn>
      </template>
    </v-snackbar>
</template>
<script>
    import Papa from 'papaparse'; 
    import { inject } from 'vue';
    import * as XLSX from 'xlsx';

    export default {
        setup() {
            const headers = inject("headers");
            const {items, removeItems, addItem} = inject("items");
            return {
                headers,
                items,
                removeItems,
                addItem,                
            }
        },
        data() {
            return {
                file: null,
                itemsUpload: [],
                headersUpload: [],
                dialog: false,
                loading: false,
                dialogTitle: "",
                dialogText: "",
                toast: false,
                errorToast: false,
            };
        },
        watch: {
            file(newValue) {
                if (!newValue) {
                    this.itemsUpload = [];
                }
            }
        },
        methods: {
            handleUploadFile() {
                if (!this.file) {
                    return;
                }
                this.loading = true;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;
                    if (this.file.name.endsWith(".csv")) {
                        this.parseCSV(data);
                    } else if (this.file.name.endsWith(".xlsx")) {
                        this.parseXLSX(data);
                    }
                } 
                reader.readAsArrayBuffer(this.file);
            },
            parseCSV(data) {
                Papa.parse(new Blob([data]), {
                complete: (result) => {
                    this.itemsUpload = result.data;
                    this.extractHeader();
                    this.checkHeaders();
                    },
                    header: true,
                    skipEmptyLines: true,
                });
            },
            parseXLSX(data) {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                this.itemsUpload = jsonData;
                this.extractHeader();
                this.checkHeaders();
            },
            extractHeader() {
                if (this.itemsUpload.length > 0) {
                    this.headersUpload = Object.keys(this.itemsUpload[0]);
                }
            },
            checkHeaders() {
                if (JSON.stringify(this.headers) !== JSON.stringify(this.headersUpload)) {
                    this.errorToast = true;
                    this.clearData();
                    this.loading = false;
                    return;
                }
                this.loading = false;
            },
            clearData() {
                this.itemsUpload = [];
                this.file = null;
                this.headersUpload = [];
            },
            uploadData() {
                this.itemsUpload = this.itemsUpload.map(item => ({
                    id: Number(item['User ID']),
                    f_name: item['First Name'],
                    l_name: item['Last Name'],
                    email: item['Email'],
                    dob: item['Date of Birth'],
                    country: item['Country']
                }));
                if (this.items.length > 0) {
                    this.removeItems(this.items);
                }
                for (const item of this.itemsUpload) {
                    this.addItem(item);
                }
                this.clearData();
                this.toast = true;
            },
            handleClickOk() {
                if (this.dialogTitle === "Clear Confirmation") {
                    this.clearData();
                } else if (this.dialogTitle === "Upload Confirmation") {
                    this.uploadData();
                }
                this.dialog = false;
            },
            showUploadDialog() {
                this.dialog = true;
                this.dialogTitle = "Upload Confirmation";
                this.dialogText = "All current data will be altered after uploading.";
            },
            showClearDialog() {
                this.dialog = true;
                this.dialogTitle = "Clear Confirmation";
                this.dialogText = "Are you sure to clear the data?";
            }
        }
    }
</script>