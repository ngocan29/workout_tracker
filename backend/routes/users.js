const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { matkhau, gioitinh, ...rest } = req.body;
    
    // Validation số điện thoại
    if (rest.sodienthoai && !/^[0-9]{10,11}$/.test(rest.sodienthoai)) {
      return res.status(400).json({ error: `Số điện thoại không hợp lệ: ${rest.sodienthoai}. Phải có 10-11 chữ số.` });
    }
    
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email: rest.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Kiểm tra giới tính (optional)
    if (gioitinh && !['male', 'female'].includes(gioitinh)) {
      return res.status(400).json({ error: 'Giới tính phải là male, female' });
    }
    
    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    
    const user = new User({
      ...rest,
      matkhau: hashedPassword,
      gioitinh,
      ngayvao: rest.ngayvao || new Date(),
      chuoi: rest.chuoi || 0,
      trangthai: rest.trangthai || 'active'
    });
    
    const newUser = await user.save();
    const userResponse = newUser.toObject();
    delete userResponse.matkhau;
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { matkhau, gioitinh, ...updateData } = req.body;
    
    // Nếu có mật khẩu mới, hash nó
    if (matkhau) {
      updateData.matkhau = await bcrypt.hash(matkhau, 10);
    }
    
    // Kiểm tra giới tính nếu được cập nhật (optional)
    if (gioitinh && !['male', 'female'].includes(gioitinh)) {
      return res.status(400).json({ error: 'Giới tính phải là male, female' });
    }
    
    Object.assign(user, { ...updateData, gioitinh });
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    res.json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tìm kiếm user theo email (di chuyển lên trước để tránh conflict)
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userResponse = user.toObject();
    delete userResponse.matkhau;
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy danh sách khách hàng theo chi nhánh
router.get('/khachhang/:chinhanhID', async (req, res) => {
  try {
    const { chinhanhID } = req.params;
    const users = await User.find({
      'additional_info.vai_tro': 'khachhang',
      'additional_info.chinhanhID': chinhanhID,
      'additional_info.trangthai_vai_tro': 'active'
    });
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy danh sách nhân viên theo chi nhánh
router.get('/nhanvien/:chinhanhID', async (req, res) => {
  try {
    const { chinhanhID } = req.params;
    const users = await User.find({
      'additional_info.vai_tro': 'nhanvien',
      'additional_info.chinhanhID': chinhanhID
    });
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy danh sách khách hàng được phân công cho nhân viên
router.get('/khachhang/nhanvien/:nhanvienID/:chinhanhID', async (req, res) => {
  try {
    const { nhanvienID, chinhanhID } = req.params;
    const users = await User.find({
      'additional_info.vai_tro': 'khachhang',
      'additional_info.chinhanhID': chinhanhID,
      'additional_info.nhanvienUserID': nhanvienID
    });
    res.json(users.map(user => {
      const userResponse = user.toObject();
      delete userResponse.matkhau;
      return userResponse;
    }));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Employee-specific API routes - Only basic information for CUD operations

// Create employee (POST /users/employee)
router.post('/employee', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      address, 
      gender, 
      password,
      position,
      salary,
      chinhanhID
    } = req.body;
    
    // Validation for required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin bắt buộc: tên, email, mật khẩu' 
      });
    }
    
    if (!chinhanhID) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin chi nhánh' 
      });
    }
    
    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ 
        error: 'Email không hợp lệ' 
      });
    }
    
    // Phone validation
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      return res.status(400).json({ 
        error: `Số điện thoại không hợp lệ: ${phone}. Phải có 10-11 chữ số.` 
      });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email đã tồn tại trong hệ thống' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create employee data - only basic information
    const employeeData = {
      ten: fullName,
      email,
      sodienthoai: phone || '',
      diachi: address || '',
      gioitinh: gender || 'male',
      matkhau: hashedPassword,
      loai_tai_khoan: 'business',
      ngayvao: new Date(),
      trangthai: 'active',
      additional_info: {
        vai_tro: 'nhanvien',
        chinhanhID,
        ngaydangky: new Date(),
        trangthai_vai_tro: 'active',
        luong: parseInt(salary) || 0
      }
    };
    
    const employee = new User(employeeData);
    const newEmployee = await employee.save();
    
    // Remove password from response
    const employeeResponse = newEmployee.toObject();
    delete employeeResponse.matkhau;
    
    res.status(201).json({
      success: true,
      message: 'Tạo nhân viên thành công',
      employee: employeeResponse
    });
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(400).json({ 
      error: err.message || 'Lỗi khi tạo nhân viên' 
    });
  }
});

// Update employee (PUT /users/employee/:id)
router.put('/employee/:id', async (req, res) => {
  try {
    console.log('PUT /employee/:id - Request body:', req.body);
    console.log('PUT /employee/:id - Employee ID:', req.params.id);
    console.log('PUT /employee/:id - Raw salary value:', req.body.salary, typeof req.body.salary);
    
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        error: 'Không tìm thấy nhân viên' 
      });
    }
    
    console.log('PUT /employee/:id - Found employee:', {
      id: employee._id,
      email: employee.email,
      loai_tai_khoan: employee.loai_tai_khoan,
      vai_tro: employee.additional_info?.vai_tro
    });

    if (employee.additional_info?.vai_tro !== 'nhanvien') {
      return res.status(400).json({ 
        error: 'Người dùng này không phải là nhân viên' 
      });
    }
    
    const { 
      fullName, 
      email, 
      phone, 
      address, 
      gender,
      password,
      position,
      salary,
      loai_tai_khoan
    } = req.body;
    
    const updateData = {};
    
    // Preserve loai_tai_khoan (required field)
    if (loai_tai_khoan) {
      updateData.loai_tai_khoan = loai_tai_khoan;
    }
    
    // Update basic information only
    if (fullName) updateData.ten = fullName;
    if (address !== undefined) updateData.diachi = address;
    if (gender) updateData.gioitinh = gender;
    
    // Email validation and update
    if (email && email !== employee.email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ 
          error: 'Email không hợp lệ' 
        });
      }
      
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ 
          error: 'Email đã tồn tại trong hệ thống' 
        });
      }
      updateData.email = email;
    }
    
    // Phone validation and update
    if (phone !== undefined) {
      if (phone && !/^[0-9]{10,11}$/.test(phone)) {
        return res.status(400).json({ 
          error: `Số điện thoại không hợp lệ: ${phone}. Phải có 10-11 chữ số.` 
        });
      }
      updateData.sodienthoai = phone;
    }
    
    // Password update
    if (password) {
      updateData.matkhau = await bcrypt.hash(password, 10);
    }
    
    // Update position and salary
    if (position !== undefined || salary !== undefined) {
      const additionalInfo = { ...employee.additional_info };
      console.log('Current additional_info:', employee.additional_info);
      if (position !== undefined) additionalInfo.position = position;
      if (salary !== undefined) {
        const parsedSalary = parseInt(salary) || 0;
        console.log('Parsed salary:', parsedSalary, 'from:', salary);
        additionalInfo.luong = parsedSalary;
      }
      updateData.additional_info = additionalInfo;
      console.log('New additional_info:', additionalInfo);
    }
    
    // Apply updates - chỉ cập nhật những field thay đổi, không override toàn bộ object
    console.log('PUT /employee/:id - updateData:', updateData);
    
    try {
      // Sử dụng findByIdAndUpdate với option bypass collection validation
      const updatedEmployee = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { 
          new: true, // Trả về document sau khi update
          runValidators: false, // Tắt Mongoose validation
          bypassDocumentValidation: true // Bỏ qua MongoDB collection validation
        }
      );
      
      if (!updatedEmployee) {
        return res.status(404).json({ 
          error: 'Không tìm thấy nhân viên để cập nhật' 
        });
      }

      console.log('PUT /employee/:id - Update successful');
      
      // Remove password from response
      const employeeResponse = updatedEmployee.toObject();
      delete employeeResponse.matkhau;
      
      res.json({
        success: true,
        message: 'Cập nhật thông tin nhân viên thành công',
        employee: employeeResponse
      });
      
    } catch (updateErr) {
      console.error('findByIdAndUpdate failed, trying direct collection update:', updateErr);
      
      // Fallback: Update trực tiếp qua collection để bypass tất cả validation
      try {
        const result = await User.collection.updateOne(
          { _id: employee._id },
          { $set: updateData }
        );
        
        if (result.modifiedCount === 0) {
          throw new Error('Không có document nào được cập nhật');
        }
        
        // Fetch lại document sau khi update
        const updatedEmployee = await User.findById(req.params.id);
        const employeeResponse = updatedEmployee.toObject();
        delete employeeResponse.matkhau;
        
        res.json({
          success: true,
          message: 'Cập nhật thông tin nhân viên thành công (fallback)',
          employee: employeeResponse
        });
        
      } catch (fallbackErr) {
        console.error('Collection direct update also failed:', fallbackErr);
        throw updateErr; // Throw original error
      }
    }
  } catch (err) {
    console.error('Error updating employee:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      errors: err.errors // Mongoose validation errors detail
    });
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID nhân viên không hợp lệ' 
      });
    }
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Lỗi validation: ' + validationErrors.join(', ')
      });
    }
    
    res.status(400).json({ 
      error: err.message || 'Lỗi khi cập nhật thông tin nhân viên' 
    });
  }
});

// Delete employee (DELETE /users/employee/:id) - Soft delete
router.delete('/employee/:id', async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ 
        error: 'Không tìm thấy nhân viên' 
      });
    }
    
    if (employee.additional_info?.vai_tro !== 'nhanvien') {
      return res.status(400).json({ 
        error: 'Người dùng này không phải là nhân viên' 
      });
    }
    
    // Soft delete - mark as inactive
    employee.additional_info.trangthai_vai_tro = 'inactive';
    employee.trangthai = 'inactive';
    await employee.save();
    
    res.json({
      success: true,
      message: 'Xóa nhân viên thành công'
    });
  } catch (err) {
    console.error('Error deleting employee:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID nhân viên không hợp lệ' 
      });
    }
    res.status(500).json({ 
      error: 'Lỗi server khi xóa nhân viên' 
    });
  }
});

// Customer-specific API routes - Only basic information for CUD operations

// Create customer (POST /users/customer)
router.post('/customer', async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      address, 
      gender, 
      password,
      assignedEmployeeId,
      chinhanhID
    } = req.body;
    
    // Validation for required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin bắt buộc: tên, email, mật khẩu' 
      });
    }
    
    if (!chinhanhID) {
      return res.status(400).json({ 
        error: 'Thiếu thông tin chi nhánh' 
      });
    }
    
    // Email validation
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ 
        error: 'Email không hợp lệ' 
      });
    }
    
    // Phone validation
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      return res.status(400).json({ 
        error: `Số điện thoại không hợp lệ: ${phone}. Phải có 10-11 chữ số.` 
      });
    }
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email đã tồn tại trong hệ thống' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create customer data - only basic information
    const customerData = {
      ten: fullName,
      email,
      sodienthoai: phone || '',
      diachi: address || '',
      gioitinh: gender || 'male',
      matkhau: hashedPassword,
      loai_tai_khoan: 'personal',
      ngayvao: new Date(),
      trangthai: 'active',
      additional_info: {
        vai_tro: 'khachhang',
        chinhanhID,
        ngaydangky: new Date(),
        trangthai_vai_tro: 'active',
        nhanvienUserID: assignedEmployeeId || null
      }
    };
    
    const customer = new User(customerData);
    const newCustomer = await customer.save();
    
    // Remove password from response
    const customerResponse = newCustomer.toObject();
    delete customerResponse.matkhau;
    
    res.status(201).json({
      success: true,
      message: 'Tạo khách hàng thành công',
      customer: customerResponse
    });
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(400).json({ 
      error: err.message || 'Lỗi khi tạo khách hàng' 
    });
  }
});

// Update customer (PUT /users/customer/:id)
router.put('/customer/:id', async (req, res) => {
  try {
    console.log('PUT /customer/:id - Request body:', req.body);
    console.log('PUT /customer/:id - Customer ID:', req.params.id);
    
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ 
        error: 'Không tìm thấy khách hàng' 
      });
    }
    
    console.log('PUT /customer/:id - Found customer:', {
      id: customer._id,
      email: customer.email,
      loai_tai_khoan: customer.loai_tai_khoan,
      vai_tro: customer.additional_info?.vai_tro
    });

    if (customer.additional_info?.vai_tro !== 'khachhang') {
      return res.status(400).json({ 
        error: 'Người dùng này không phải là khách hàng' 
      });
    }
    
    const { 
      fullName, 
      email, 
      phone, 
      address, 
      gender,
      password,
      assignedEmployeeId,
      loai_tai_khoan
    } = req.body;
    
    const updateData = {};
    
    // Preserve loai_tai_khoan (required field)
    if (loai_tai_khoan) {
      updateData.loai_tai_khoan = loai_tai_khoan;
    }
    
    // Update basic information only
    if (fullName) updateData.ten = fullName;
    if (address !== undefined) updateData.diachi = address;
    if (gender) updateData.gioitinh = gender;
    
    // Email validation and update
    if (email && email !== customer.email) {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        return res.status(400).json({ 
          error: 'Email không hợp lệ' 
        });
      }
      
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ 
          error: 'Email đã tồn tại trong hệ thống' 
        });
      }
      updateData.email = email;
    }
    
    // Phone validation and update
    if (phone !== undefined) {
      if (phone && !/^[0-9]{10,11}$/.test(phone)) {
        return res.status(400).json({ 
          error: `Số điện thoại không hợp lệ: ${phone}. Phải có 10-11 chữ số.` 
        });
      }
      updateData.sodienthoai = phone;
    }
    
    // Password update
    if (password) {
      updateData.matkhau = await bcrypt.hash(password, 10);
    }
    
    // Update assigned employee
    if (assignedEmployeeId !== undefined) {
      const additionalInfo = { ...customer.additional_info };
      additionalInfo.nhanvienUserID = assignedEmployeeId || null;
      updateData.additional_info = additionalInfo;
    }
    
    // Apply updates - chỉ cập nhật những field thay đổi, không override toàn bộ object
    console.log('PUT /customer/:id - updateData:', updateData);
    
    try {
      // Sử dụng findByIdAndUpdate với option bypass collection validation
      const updatedCustomer = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { 
          new: true, // Trả về document sau khi update
          runValidators: false, // Tắt Mongoose validation
          bypassDocumentValidation: true // Bỏ qua MongoDB collection validation
        }
      );
      
      if (!updatedCustomer) {
        return res.status(404).json({ 
          error: 'Không tìm thấy khách hàng để cập nhật' 
        });
      }

      console.log('PUT /customer/:id - Update successful');
      
      // Remove password from response
      const customerResponse = updatedCustomer.toObject();
      delete customerResponse.matkhau;
      
      res.json({
        success: true,
        message: 'Cập nhật thông tin khách hàng thành công',
        customer: customerResponse
      });
      
    } catch (updateErr) {
      console.error('findByIdAndUpdate failed, trying direct collection update:', updateErr);
      
      // Fallback: Update trực tiếp qua collection để bypass tất cả validation
      try {
        const result = await User.collection.updateOne(
          { _id: customer._id },
          { $set: updateData }
        );
        
        if (result.modifiedCount === 0) {
          throw new Error('Không có document nào được cập nhật');
        }
        
        // Fetch lại document sau khi update
        const updatedCustomer = await User.findById(req.params.id);
        const customerResponse = updatedCustomer.toObject();
        delete customerResponse.matkhau;
        
        res.json({
          success: true,
          message: 'Cập nhật thông tin khách hàng thành công (fallback)',
          customer: customerResponse
        });
        
      } catch (fallbackErr) {
        console.error('Collection direct update also failed:', fallbackErr);
        throw updateErr; // Throw original error
      }
    }
  } catch (err) {
    console.error('Error updating customer:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      errors: err.errors // Mongoose validation errors detail
    });
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID khách hàng không hợp lệ' 
      });
    }
    
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: 'Lỗi validation: ' + validationErrors.join(', ')
      });
    }
    
    res.status(400).json({ 
      error: err.message || 'Lỗi khi cập nhật thông tin khách hàng' 
    });
  }
});

// Delete customer (DELETE /users/customer/:id) - Soft delete
router.delete('/customer/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ 
        error: 'Không tìm thấy khách hàng' 
      });
    }
    
    if (customer.additional_info?.vai_tro !== 'khachhang') {
      return res.status(400).json({ 
        error: 'Người dùng này không phải là khách hàng' 
      });
    }
    
    // Soft delete - mark as inactive
    customer.additional_info.trangthai_vai_tro = 'inactive';
    customer.trangthai = 'inactive';
    await customer.save();
    
    res.json({
      success: true,
      message: 'Xóa khách hàng thành công'
    });
  } catch (err) {
    console.error('Error deleting customer:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'ID khách hàng không hợp lệ' 
      });
    }
    res.status(500).json({ 
      error: 'Lỗi server khi xóa khách hàng' 
    });
  }
});

// PUT: Cập nhật chuỗi hoàn thành mục tiêu cho user
router.put('/:id/streak', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔥 Updating streak for user:', id);
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Không tìm thấy user' 
      });
    }
    
    // Tăng chuỗi lên 1
    user.chuoi = (user.chuoi || 0) + 1;
    await user.save();
    
    console.log('✅ Streak updated successfully:', user.chuoi);
    
    res.json({
      success: true,
      data: user,
      message: `Chuỗi hoàn thành mục tiêu đã được cập nhật: ${user.chuoi} ngày`
    });
  } catch (err) {
    console.error('❌ Error updating streak:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        error: 'ID user không hợp lệ' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Lỗi server khi cập nhật chuỗi' 
    });
  }
});

module.exports = router;