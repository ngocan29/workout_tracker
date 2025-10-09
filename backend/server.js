const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const userRoutes = require('./routes/users');
const chinhanhRoutes = require('./routes/chinhanh');
const nhanvienRoutes = require('./routes/nhanvien');
const khachhangRoutes = require('./routes/khachhang');
const baitapRoutes = require('./routes/baitap');
const muctieuRoutes = require('./routes/muctieu');
const dinhduongRoutes = require('./routes/dinhduong');
const sodocotheRoutes = require('./routes/sodocothe');
const lichhenRoutes = require('./routes/lichhen');

const app = express();

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Mount routes
app.use('/users', userRoutes);
app.use('/chinhanh', chinhanhRoutes);
app.use('/nhanvien', nhanvienRoutes);
app.use('/khachhang', khachhangRoutes);
app.use('/baitap', baitapRoutes);
app.use('/muctieu', muctieuRoutes);
app.use('/dinhduong', dinhduongRoutes);
app.use('/sodocothe', sodocotheRoutes);
app.use('/lichhen', lichhenRoutes);

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));