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
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import { inject } from 'vue';

export default {
  setup() {
    const headers = inject("headers");
    const {items} = inject("items");
    return {
      headers,
      items,
    }
  },
  data() {
    return {
      toast: false,
      selected: [],
      formats: ['CSV', 'Excel'],
      selectedFormat: null,
      headersTable: this.headers.map(header => ({ title: header, key: header.toLowerCase(),})),
    };
  },
  methods: {
    handleExport() {
      // console.log(this.selected);
      if (this.selectedFormat === 'CSV') {
        this.exportToCSV();
      } else if (this.selectedFormat === 'Excel') {
        this.exportToExcel();
      // } else if (this.selectedFormat === 'PDF') {
      //   this.exportToPDF();
      } else {
        this.toast = true;
      }
    },

    exportToCSV() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const csvContent = this.convertToCSV(selectedItems);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.setAttribute('href', URL.createObjectURL(blob));
      link.setAttribute('download', 'fruits_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    convertToCSV(data) {
      const header = 'ID,Name,Location,Height,Base,Volume\n';
      const rows = data.map(item => {
        return `${item.id},${item.name || 'N/A'},${item.location || 'N/A'},${item.height || 'N/A'},${item.base || 'N/A'},${item.volume || 'N/A'}`;
      });
      return header + rows.join('\n');
    },

    async exportToExcel() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fruits');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 15 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Height', key: 'height', width: 15 },
        { header: 'Base', key: 'base', width: 15 },
        { header: 'Volume', key: 'volume', width: 15 },
      ];

      selectedItems.forEach(item => {
        worksheet.addRow({
          id: item.id,
          name: item.name || 'N/A',
          location: item.location || 'N/A',
          height: item.height || 'N/A',
          base: item.base || 'N/A',
          volume: item.volume || 'N/A',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'fruits_data.xlsx';
      link.click();
    },

    // exportToPDF() {
    //   const selectedItems = this.selected.length > 0 ? this.selected : this.items;
    //   const doc = new jsPDF();
    //   doc.text('Fruit List', 10, 10);

    //   const tableData = selectedItems.map(item => [
    //     item.id,
    //     item.name || 'N/A',
    //     item.location || 'N/A',
    //     item.height || 'N/A',
    //     item.base || 'N/A',
    //     item.volume || 'N/A',
    //   ]);

    //   doc.autoTable({
    //     head: [['ID', 'Name', 'Location', 'Height', 'Base', 'Volume']],
    //     body: tableData,
    //     startY: 20,
    //   });

    //   doc.save('fruits_data.pdf');
    // },
  },
};
</script>
