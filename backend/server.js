const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const userRoutes = require('./routes/users');
const chinhanhRoutes = require('./routes/chinhanh');
const authRoutes = require('./routes/auth');
const nhanvienRoutes = require('./routes/nhanvien');
const khachhangRoutes = require('./routes/khachhang');
const baitapRoutes = require('./routes/baitap');
const muctieuRoutes = require('./routes/muctieu');
const dinhduongRoutes = require('./routes/dinhduong');
const sodocotheRoutes = require('./routes/sodocothe');
const lichhenRoutes = require('./routes/lichhen');

const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, user-id');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Workout Tracker API Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/auth/login',
      '/auth/register', 
      '/users',
      '/chinhanh',
      '/nhanvien',
      '/khachhang',
      '/baitap',
      '/muctieu',
      '/dinhduong',
      '/sodocothe',
      '/lichhen'
    ]
  });
});

// Mount routes (không có prefix /api)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/chinhanh', chinhanhRoutes);
app.use('/nhanvien', nhanvienRoutes);
app.use('/khachhang', khachhangRoutes);
app.use('/baitap', baitapRoutes);
app.use('/muctieu', muctieuRoutes);
app.use('/dinhduong', dinhduongRoutes);
app.use('/sodocothe', sodocotheRoutes);
app.use('/lichhen', lichhenRoutes);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Workout Tracker Server running on http://${HOST}:${PORT}`);
  console.log(`📱 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://192.168.1.124:${PORT}`);
  console.log(`✅ Available endpoints:`);
  console.log(`  - http://192.168.1.124:${PORT}/users`);
  console.log(`  - http://192.168.1.124:${PORT}/auth/login`);
  console.log(`  - http://192.168.1.124:${PORT}/chinhanh`);
  console.log(`  - http://192.168.1.124:${PORT}/khachhang`);
  console.log(`  - http://192.168.1.124:${PORT}/nhanvien`);
  console.log(`\n🔥 Ready for production use!`);
});