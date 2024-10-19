<template>
  <section class="export-section">
    <v-card class="card-container">
      <h2 class="header">Export Data</h2>
      <div class="table-container">
        <v-data-table
          v-model="selected"
          :items="items"
          item-value="name"
          show-select
          class="data-table"
        ></v-data-table>
      </div>
    </v-card>

    <div class="export-dropdown">
      <button class="export-button" @click="toggleDropdown">Export</button>
      
      <ul v-if="dropdownOpen" class="dropdown-menu" @click.stop>
        <li @click="exportToExcel">Export Excel</li>
        <li @click="exportToCSV">Export CSV</li>
        <li @click="exportToPDF">Export PDF</li>
      </ul>
    </div>
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
      ],
      dropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
      if (this.dropdownOpen) {
        document.addEventListener('click', this.closeDropdown);
      }
    },
    
    closeDropdown(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownOpen = false;
        document.removeEventListener('click', this.closeDropdown);
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
      this.dropdownOpen = false;
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
      this.dropdownOpen = false;
    },

    exportToPDF() {
      const selectedItems = this.selected.length > 0 ? this.selected : this.items;
      const doc = new jsPDF();
      doc.text("Fruit List", 10, 10);

      let y = 20;
      selectedItems.forEach((item) => {
        doc.text(`Name: ${item.name || 'N/A'}, Location: ${item.location || 'N/A'}, Height: ${item.height || 'N/A'}, Base: ${item.base || 'N/A'}, Volume: ${item.volume || 'N/A'}`, 10, y);
        y += 10;
      });

      doc.save('fruits_data.pdf');
      this.dropdownOpen = false;
    }
  }
};
</script>

<style scoped>
.export-section {
  padding: 20px;
  background-color: #f5f5f5;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #1976D2;
}

.export-dropdown {
  margin-top: 20px;
  text-align: left;
  position: relative;
}

.export-button {
  background-color: #1976D2;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-button:hover {
  background-color: #1565C0;
}

.dropdown-menu {
  position: absolute;
  top: 40px;
  left: 0;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px 0;
  width: 150px;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-menu li:hover {
  background-color: #f1f1f1;
}

.dropdown-menu li:active {
  background-color: #ddd;
}
</style>
