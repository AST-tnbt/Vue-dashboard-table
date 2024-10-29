<template>
  <v-container>
    <v-card>
      <v-data-table
      v-model="selected"
      :headers="headersTable"
      :items="items"
      item-value="id"
      show-select
      >
      <template v-slot:top>
        <v-toolbar color="blue-darken-4">
          <v-toolbar-title>Data Table</v-toolbar-title>
        </v-toolbar>
      </template>
      </v-data-table>
    </v-card>
    <v-row class="mt-2">
      <v-col cols="3">
        <v-select
        v-model="selectedFormat"
        :items="formats"
        density="compact"
        label="Select format"
        ></v-select>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="handleExport">Export</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar
    v-model="toast"
    :timeout="1500"
    variant="tonal"
    color="error"
    location="right"
    opacity
  >
    Please choose file type.
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
</template>

<script>
import ExcelJS from 'exceljs';
import { inject } from 'vue';

export default {
  setup() {
    const headers = inject("headers");
    const headerKeys = inject("headerKeys");
    const {items} = inject("items");
    return {
      headers,
      headerKeys,
      items
    }
  },
  data() {
    return {
      toast: false,
      selected: [],
      formats: ['CSV', 'Excel'],
      selectedFormat: null,
      headersTable: this.headers.map((header, index) => ({ title: header, key: this.headerKeys[index]}))
    };
  },
  methods: {
    handleExport() {
      if (this.selectedFormat === 'CSV') {
        this.exportToCSV();
      } else if (this.selectedFormat === 'Excel') {
        this.exportToExcel();
      } else {
        this.toast = true;
      }
    },

    exportToCSV() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const csvContent = this.convertToCSV(selectedItems);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'users_data.csv';
      link.click();
    },

    convertToCSV(data) {
      const header = 'User ID,First Name,Last Name,Email,Date of Birth,Country\n';
      const rows = data.map(item => {
        return `${item.id},${item.f_name || 'N/A'},${item.l_name || 'N/A'},${item.email || 'N/A'},${item.dob || 'N/A'},${item.country || 'N/A'}`;
      });
      return header + rows.join('\n');
    },

    async exportToExcel() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');
      worksheet.columns = [
        { header: 'User ID', key: 'id', width: 10 },
        { header: 'First Name', key: 'f_name', width: 15 },
        { header: 'Last Name', key: 'l_name', width:15 },
        { header: 'Email', key: 'email', width: 15 },
        { header: 'Date of Birth', key: 'dob', width: 15 },
        { header: 'Country', key: 'country', width: 15 },
      ];

      selectedItems.forEach(item => {
        worksheet.addRow({
          id: item.id,
          f_name: item.f_name || 'N/A',
          l_name: item.l_name || 'N/A',
          email: item.email || 'N/A',
          dob: item.dob || 'N/A',
          country: item.country || 'N/A',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'users_data.xlsx';
      link.click();
    },
  },
};
</script>
