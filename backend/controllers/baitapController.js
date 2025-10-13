//1️⃣ Lấy tất cả bài tập (GET /)
const baitaps = await Baitap.find().populate('khachhangID ptID congtyID');


//2️⃣ Lấy bài tập theo khách hàng (GET /khachhang/:khachhangID)
const baitaps = await Baitap.find({
  $or: [
    { khachhangID: req.params.khachhangID },
    { loai: 'company', ptID: { $ne: null } }
  ]
});


//3️⃣ Lấy bài tập theo công ty (GET /congty/:congtyID)
const baitaps = await Baitap.find({ congtyID: req.params.congtyID });


//4️⃣ Lấy bài tập cá nhân (GET /personal/:userID)
const baitaps = await Baitap.find({
  $or: [
    { loai: 'default' },
    { loai: 'personal', khachhangID: req.params.userID }
  ]
});


//5️⃣ Thêm bài tập (POST /)
const newBaitap = await Baitap.create(req.body);


//6️⃣ Sửa / Xóa bài tập (PUT /:id, DELETE /:id)
//PUT: cập nhật nội dung bài tập (VD: mô tả, thời gian)
//DELETE: xóa bài tập theo ID


//7️⃣ Reset trạng thái (PUT /trangthai/baitap/:baitapID/khachhang/:khachhangID)
await Baitap.updateOne(
  { _id: req.params.baitapID, khachhangID: req.params.khachhangID },
  { $set: { trangthai: 'chuahoanthanh' } }
);