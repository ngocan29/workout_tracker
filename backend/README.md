# Backend
API Endpoints
Authentication

POST /register: Đăng ký user mới (tự hash mật khẩu, yêu cầu gioitinh: male/female)
POST /login: Đăng nhập (kiểm tra email, mật khẩu, trạng thái tài khoản)
POST /logout: Đăng xuất (hiện tại đơn giản, chưa có blacklist token)
GET /profile: Lấy thông tin profile hiện tại (yêu cầu user-id trong header)
PUT /profile: Cập nhật profile (tự hash mật khẩu nếu cung cấp, kiểm tra gioitinh)

Users

GET /users: Lấy tất cả users (không trả về mật khẩu)
POST /users: Tạo user mới (tự hash mật khẩu, yêu cầu gioitinh: male/female)
GET /users/:id: Lấy user theo ID (không trả về mật khẩu)
PUT /users/:id: Cập nhật user (tự hash mật khẩu nếu cung cấp, kiểm tra gioitinh)
DELETE /users/:id: Xóa user
GET /users/khachhang/:chinhanhID: Lấy danh sách khách hàng theo chi nhánh (không trả về mật khẩu)
GET /users/nhanvien/:chinhanhID: Lấy danh sách nhân viên theo chi nhánh (không trả về mật khẩu)

Chinhanh

GET /chinhanh: Lấy tất cả chi nhánh
POST /chinhanh: Tạo chi nhánh mới (ngaytao mặc định là hiện tại)
GET /chinhanh/:id: Lấy chi nhánh theo ID
PUT /chinhanh/:id: Cập nhật chi nhánh
DELETE /chinhanh/:id: Xóa chi nhánh

Baitap

GET /baitap: Lấy tất cả bài tập
POST /baitap: Tạo bài tập mới (ngaytao mặc định, thongke mặc định 0)
GET /baitap/:id: Lấy bài tập theo ID
PUT /baitap/:id: Cập nhật bài tập (tăng thongke, diemthuong nếu hoàn thành, cập nhật ngaycapnhat)
DELETE /baitap/:id: Xóa bài tập

Muctieu

GET /muctieu: Lấy tất cả mục tiêu
POST /muctieu: Tạo mục tiêu mới (ngaytao mặc định, tongthoigiantap/thongke mặc định 0)
GET /muctieu/:id: Lấy mục tiêu theo ID
PUT /muctieu/:id: Cập nhật mục tiêu (cập nhật tongthoigiantap, thongke, chuoi user)
DELETE /muctieu/:id: Xóa mục tiêu

Dinhduong

GET /dinhduong: Lấy tất cả dinh dưỡng
POST /dinhduong: Tạo dinh dưỡng mới (tự tính bmi, lbm dựa trên gioitinh)
GET /dinhduong/:id: Lấy dinh dưỡng theo ID
PUT /dinhduong/:id: Cập nhật dinh dưỡng (tự tính bmi, lbm)
DELETE /dinhduong/:id: Xóa dinh dưỡng

Sodocothe

GET /sodocothe: Lấy tất cả số đo cơ thể
POST /sodocothe: Tạo số đo mới (ngaytao mặc định)
GET /sodocothe/:id: Lấy số đo theo ID
PUT /sodocothe/:id: Cập nhật số đo
DELETE /sodocothe/:id: Xóa số đo

Lichhen

GET /lichhen: Lấy tất cả lịch hẹn
POST /lichhen: Tạo lịch hẹn mới (ngaytao mặc định, trangthai mặc định chualichhen)
GET /lichhen/:id: Lấy lịch hẹn theo ID
PUT /lichhen/:id: Cập nhật lịch hẹn
DELETE /lichhen/:id: Xóa lịch hẹn

Danhmuc

GET /danhmuc: Lấy tất cả danh mục
POST /danhmuc: Tạo danh mục mới
GET /danhmuc/:id: Lấy danh mục theo ID
PUT /danhmuc/:id: Cập nhật danh mục
DELETE /danhmuc/:id: Xóa danh mục
