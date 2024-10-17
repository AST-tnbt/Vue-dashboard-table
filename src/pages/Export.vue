<template>
    <section>
      <v-card>
        <h2>Export Data</h2>
        <v-data-table
          v-model="selected"
          :items="items"
          item-value="name"
          show-select
        ></v-data-table>
        <button @click="exportToCSV">Export CSV</button>
        <button @click="exportToExcel">Export Excel</button>
        <button @click="exportToPDF">Export PDF</button>
      </v-card>
    </section>
  </template>
  
  <script>
  import ExcelJS from 'exceljs';
  import jsPDF from 'jspdf';
  
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
          { name: '🍑 Peach', location: 'China', height: '0.09', base: '0.08', volume: '0.0004' },
          { name: '🥝 Kiwi', location: 'New Zealand', height: '0.05', base: '0.05', volume: '0.0001' },
        ],
      };
    },
    methods: {
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
  
      async exportToExcel() {
        const selectedItems = this.selected.length > 0 ? this.selected : this.items;
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Fruits');
  
        // Set column headers
        worksheet.columns = [
          { header: 'Name', key: 'name', width: 15 },
          { header: 'Location', key: 'location', width: 20 },
          { header: 'Height', key: 'height', width: 15 },
          { header: 'Base', key: 'base', width: 15 },
          { header: 'Volume', key: 'volume', width: 15 },
        ];
  
        // Add data to worksheet
        selectedItems.forEach(item => {
          worksheet.addRow(item);
        });
  
        // Export file
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
  
        let y = 20;
        selectedItems.forEach((item) => {
          doc.text(`Name: ${item.name}, Location: ${item.location}, Height: ${item.height}, Base: ${item.base}, Volume: ${item.volume}`, 10, y);
          y += 10;
        });
  
        doc.save('fruits_data.pdf');
      },
  
      convertToCSV(data) {
        const header = 'Name,Location,Height,Base,Volume\n';
        const rows = data.map(item => `${item.name},${item.location},${item.height},${item.base},${item.volume}`);
        return header + rows.join('\n');
      },
    },
  };
  </script>
  
  <style scoped>
  .export {
    margin: 20px;
  }
  
  button {
    margin: 5px;
  }
  </style>
  