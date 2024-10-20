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
            v-if="items.length > 0 && !loading"
            :items="items"
        >
            <template v-slot:top>
                <v-toolbar color="blue-darken-4">
                    <v-toolbar-title>Preview Data</v-toolbar-title>
                </v-toolbar>
            </template>
        </v-data-table>
        <v-btn prepend-icon="mdi-upload" v-if="items.length > 0 && !loading" class="mt-2 bg-blue-darken-4">Upload</v-btn>
        <v-btn prepend-icon="mdi-broom" v-if="items.length > 0 && !loading" class="mt-2 ml-2 bg-gray-darken-4" @click="dialog = true">Clear</v-btn>
    </v-container>
    <v-dialog v-model="dialog" width="auto">
        <v-card
        max-width="400"
        prepend-icon="mdi-ticket-confirmation-outline"
        text="Are you sure to clear the data?"
        title="Confirm clear data"
        >
            <template v-slot:actions>
            <v-btn
                text="Ok"
                @click="clearData"
            ></v-btn>
            <v-btn
                text="Cancel"
                @click="dialog = false"
            ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>
<script>
    import Papa from 'papaparse'; 
    import * as XLSX from 'xlsx';

    export default {
        data() {
            return {
                file: null,
                items: [],
                dialog: false,
                loading: false
            };
        },
        watch: {
            file(newValue) {
                if (!newValue) {
                    this.items = [];
                }
            }
        },
        methods: {
            handleUploadFile() {
                if (!this.file) {
                    return;
                }

                this.loading = true;
                const startTime = Date.now();

                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;
                    if (this.file.name.endsWith(".csv")) {
                        this.parseCSV(data);
                    } else if (this.file.name.endsWith(".xlsx")) {
                        this.parseXLSX(data);
                    }
                    const timeRemaining = Date.now() - startTime; 
                    if (timeRemaining < 2000) {
                        setTimeout(() => {
                            this.loading = false;
                        }, 2000 - timeRemaining);
                    }
                    this.loading = false;
                } 


                reader.readAsArrayBuffer(this.file);
            },
            parseCSV(data) {
                Papa.parse(new Blob([data]), {
                complete: (result) => {
                    // console.log(result.data);
                    this.items = result.data;
                    },
                    header: true,
                });
            },
            parseXLSX(data) {
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                // console.log(jsonData);
                this.items = jsonData;
            },
            clearData() {
                this.items = [];
                this.dialog = false;
                this.file = null;
            }
        }
    }
</script>