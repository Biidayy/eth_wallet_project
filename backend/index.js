// Load biến môi trường từ file .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

// Kết nối tới MongoDB sử dụng connection string từ .env
mongoose.connect(process.env.MONGO_URL, {

})
.then(() => console.log('✅ Đã kết nối MongoDB'))
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// Routing cho API
app.use('/api', userRoutes);

// Khởi chạy server tại PORT chỉ định (mặc định: 3000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
