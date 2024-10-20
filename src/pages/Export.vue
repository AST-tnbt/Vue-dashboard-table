<template>
  <section class="export-section">
    <v-card class="card-container ml-5">
      <h2 class="header text-primary">Export Data</h2>
      <div class="table-container">
        <v-data-table
          v-model="selected"
          :items="items"
          item-value="name"
          show-select
        ></v-data-table>
      </div>
    </v-card>

    <v-card class="ml-5">
      <v-select
        v-model="selectedFormat"
        :items="formats"
        label="Select format"
        outlined
      ></v-select>
      <v-btn color="primary" @click="handleExport">Export</v-btn>
    </v-card>
  </section>
</template>

<script>
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  data() {
    return {
      selected: [],
      items: [
        { name: '🍎 Apple', location: 'Washington', height: '0.1', base: '0.07', volume: '0.0001' },
        { name: '🍌 Banana', location: 'Ecuador', height: '0.2', base: '0.05', volume: '0.0002' },
        { name: '🍇 Grapes', location: 'Italy', height: '0.02', base: '0.02', volume: '0.00001' },
        { name: '🍉 Watermelon', location: 'China', height: '0.4', base: '0.3', volume: '0.03' },
        { name: '🍍 Pineapple', location: 'Thailand', height: '0.3', base: '0.2', volume: '0.005' },
        { name: '🍒 Cherries', location: 'Turkey', height: '0.02', base: '0.02', volume: '0.00001' },
        { name: '🥭 Mango', location: 'India', height: '0.15', base: '0.1', volume: '0.0005' },
        { name: '🍓 Strawberry', location: 'USA', height: '0.03', base: '0.03', volume: '0.00002' },
      ],
      formats: ['CSV', 'Excel', 'PDF'],
      selectedFormat: null,
    };
  },
  methods: {
    handleExport() {
      if (this.selectedFormat === 'CSV') {
        this.exportToCSV();
      } else if (this.selectedFormat === 'Excel') {
        this.exportToExcel();
      } else if (this.selectedFormat === 'PDF') {
        this.exportToPDF();
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
      const header = 'Name,Location,Height,Base,Volume\n';
      const rows = data.map(item => {
        return `${item.name || 'N/A'},${item.location || 'N/A'},${item.height || 'N/A'},${item.base || 'N/A'},${item.volume || 'N/A'}`;
      });
      return header + rows.join('\n');
    },

    async exportToExcel() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fruits');

      worksheet.columns = [
        { header: 'Name', key: 'name', width: 15 },
        { header: 'Location', key: 'location', width: 20 },
        { header: 'Height', key: 'height', width: 15 },
        { header: 'Base', key: 'base', width: 15 },
        { header: 'Volume', key: 'volume', width: 15 },
      ];

      selectedItems.forEach(item => {
        worksheet.addRow({
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

    exportToPDF() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const doc = new jsPDF();
      doc.text("Fruit List", 10, 10);

      const tableData = selectedItems.map(item => [
        item.name || 'N/A',
        item.location || 'N/A',
        item.height || 'N/A',
        item.base || 'N/A',
        item.volume || 'N/A'
      ]);

      doc.autoTable({
        head: [['Name', 'Location', 'Height', 'Base', 'Volume']],
        body: tableData,
        startY: 20
      });

      doc.save('fruits_data.pdf');
    }
  }
};
</script>
