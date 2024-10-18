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
<script setup>
    import Papa from 'papaparse'; 
    import * as XLSX from 'xlsx'; 
    import {ref, watch} from "vue";

    const file = ref(null);
    const items = ref([]);
    const dialog = ref(false);
    const loading = ref(false);

    watch(file, () => {
        if (!file.value) items.value = [];
    })

    const handleUploadFile = () => {
        if (!file.value) {
            return;
        }

        loading.value = true;
        const startTime = Date.now();

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            if (file.value.name.endsWith(".csv")) {
                parseCSV(data);
            } else if (file.value.name.endsWith(".xlsx")) {
                parseXLSX(data);
            }
            const timeRemaining = Date.now() - startTime; 
            if (timeRemaining < 2000) {
                setTimeout(() => {
                    loading.value = false;
                }, 2000 - timeRemaining);
            }
            loading.value = false;
        } 


        reader.readAsArrayBuffer(file.value);
    }

    const parseCSV = (data) => {
        Papa.parse(new Blob([data]), {
        complete: (result) => {
            // console.log(result.data);
            items.value = result.data;
            },
            header: true,
        });
    }

    const parseXLSX = (data) => {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        // console.log(jsonData);
        items.value = jsonData;
    };

    const clearData = () => {
        items.value = [];
        dialog.value = false;
        file.value = null;
    }
</script>