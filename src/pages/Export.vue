<template>

<section>
        <v-card text="This is Export page">
        <div class="export">
        <h2>Xuất Dữ Liệu</h2>
        <button @click="exportToCSV">Xuất CSV</button>
        <button @click="exportToExcel">Xuất Excel</button>
        <button @click="exportToPDF">Xuất PDF</button>
        <div class="fruit-list">
            <ul>
            <li v-for="(item, index) in items" :key="index">
                <i :class="getIcon(item.name)"></i> {{ item.name }} ({{ item.location }})
            </li>
            </ul>
        </div>
        </div>

        </v-card>
    </section>
    
  </template>
  
  <script>
  import * as XLSX from 'xlsx';
  import jsPDF from 'jspdf';
  
  export default {
    name: 'Export',
    data() {
      return {
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
        const csvContent = this.convertToCSV(this.items);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', 'fruits_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
  
      exportToExcel() {
        const worksheet = XLSX.utils.json_to_sheet(this.items);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Fruits');
        XLSX.writeFile(workbook, 'fruits_data.xlsx');
      },
  
      exportToPDF() {
        const doc = new jsPDF();
        doc.text("Danh sách trái cây", 10, 10);
        
        let y = 20;
        this.items.forEach((item) => {
          doc.text(`Tên: ${item.name}, Vị trí: ${item.location}, Chiều cao: ${item.height}, Đáy: ${item.base}, Thể tích: ${item.volume}`, 10, y);
          y += 10;
        });
  
        doc.save('fruits_data.pdf');
      },
  
      convertToCSV(data) {
        const header = 'Tên,Vị trí,Chiều cao,Đáy,Thể tích\n';
        const rows = data.map(item => `${item.name},${item.location},${item.height},${item.base},${item.volume}`);
        return header + rows.join('\n');
      },
  
      getIcon(fruitName) {
        switch (fruitName) {
          case '🍎 Apple':
            return 'mdi-apple'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍌 Banana':
            return 'mdi-banana'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍇 Grapes':
            return 'mdi-grapes'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍉 Watermelon':
            return 'mdi-watermelon'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍍 Pineapple':
            return 'mdi-pineapple'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍒 Cherries':
            return 'mdi-cherries'; // Giả định bạn đã cài đặt biểu tượng này
          case '🥭 Mango':
            return 'mdi-mango'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍓 Strawberry':
            return 'mdi-strawberry'; // Giả định bạn đã cài đặt biểu tượng này
          case '🍑 Peach':
            return 'mdi-peach'; // Giả định bạn đã cài đặt biểu tượng này
          case '🥝 Kiwi':
            return 'mdi-kiwi'; // Giả định bạn đã cài đặt biểu tượng này
          default:
            return 'mdi-fruit'; // Biểu tượng mặc định
        }
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
  
  .fruit-list {
    margin-top: 20px;
  }
  
  .fruit-list ul {
    list-style: none;
    padding: 0;
  }
  
  .fruit-list li {
    display: flex;
    align-items: center;
  }
  
  .fruit-list i {
    margin-right: 8px;
  }
  </style>
  