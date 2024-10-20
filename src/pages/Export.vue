<template>
  <section class="export-section">
    <v-card class="card-container ml-5">
      <h2 class="header text-primary">Export Data</h2>
      <div class="table-container">
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="items"
          item-value="id"
          show-select
        >
        </v-data-table>
      </div>
    </v-card>

    <v-card class="ml-5">
      <v-row align="center">
        <v-col cols="auto">
          <v-btn color="primary" @click="handleExport">Export</v-btn>
        </v-col>
        <v-col cols="3" class="pl-2">
          <v-select
            v-model="selectedFormat"
            :items="formats"
            label="Select format"
            outlined
          ></v-select>
        </v-col>
      </v-row>
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
      items: [
      { id: 1, name: '🍎 Apple', location: 'Washington', height: '0.1', base: '0.07', volume: '0.0001' },
      { id: 2, name: '🍌 Banana', location: 'Ecuador', height: '0.2', base: '0.05', volume: '0.0002' },
      { id: 3, name: '🍇 Grapes', location: 'Italy', height: '0.02', base: '0.02', volume: '0.00001' },
      { id: 4, name: '🍉 Watermelon', location: 'China', height: '0.4', base: '0.3', volume: '0.03' },
      { id: 5, name: '🍍 Pineapple', location: 'Thailand', height: '0.3', base: '0.2', volume: '0.005' },
      { id: 6, name: '🍒 Cherries', location: 'Turkey', height: '0.02', base: '0.02', volume: '0.00001' },
      { id: 7, name: '🥭 Mango', location: 'India', height: '0.15', base: '0.1', volume: '0.0005' },
      { id: 8, name: '🍓 Strawberry', location: 'USA', height: '0.03', base: '0.03', volume: '0.00002' },
      { id: 9, name: '🍋 Lemon', location: 'Mexico', height: '0.1', base: '0.06', volume: '0.0003' },
      { id: 10, name: '🍑 Peach', location: 'Georgia', height: '0.12', base: '0.07', volume: '0.0002' },
      { id: 11, name: '🍈 Melon', location: 'Spain', height: '0.25', base: '0.2', volume: '0.005' },
      { id: 12, name: '🍏 Green Apple', location: 'France', height: '0.1', base: '0.08', volume: '0.00015' },
      { id: 13, name: '🍒 Black Cherries', location: 'Canada', height: '0.02', base: '0.02', volume: '0.00001' },
      { id: 14, name: '🍍 Small Pineapple', location: 'Brazil', height: '0.28', base: '0.18', volume: '0.0045' },
      { id: 15, name: '🥥 Coconut', location: 'Philippines', height: '0.35', base: '0.25', volume: '0.01' },
      { id: 16, name: '🍇 Red Grapes', location: 'Australia', height: '0.03', base: '0.02', volume: '0.00002' },
      { id: 17, name: '🍍 Tropical Pineapple', location: 'Costa Rica', height: '0.32', base: '0.22', volume: '0.006' },
      { id: 18, name: '🍓 Blueberry', location: 'Canada', height: '0.01', base: '0.01', volume: '0.000003' },
      { id: 19, name: '🍉 Big Watermelon', location: 'Brazil', height: '0.5', base: '0.4', volume: '0.04' },
      { id: 20, name: '🍑 White Peach', location: 'China', height: '0.12', base: '0.07', volume: '0.0002' },
    ],
      formats: ['CSV', 'Excel', 'PDF'],
      selectedFormat: null,
    };
  },
  methods: {
    handleExport() {
      console.log(this.selected);
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

    exportToPDF() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const doc = new jsPDF();
      doc.text('Fruit List', 10, 10);

      const tableData = selectedItems.map(item => [
        item.id,
        item.name || 'N/A',
        item.location || 'N/A',
        item.height || 'N/A',
        item.base || 'N/A',
        item.volume || 'N/A',
      ]);

      doc.autoTable({
        head: [['ID', 'Name', 'Location', 'Height', 'Base', 'Volume']],
        body: tableData,
        startY: 20,
      });

      doc.save('fruits_data.pdf');
    },
  },
};
</script>
