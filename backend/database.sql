1.Users

db.createCollection("users", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["ten", "loai_tai_khoan", "email", "sodienthoai", "diachi", "ngayvao", "chuoi"],
properties: {
id: { bsonType: "objectId" },
ten: { bsonType: "string", description: "Tên người dùng" },
loai_tai_khoan: {
enum: ["business", "personal"],
description: "Loại tài khoản: business hoặc personal"
},
email: {
bsonType: "string",
pattern: "^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
description: "Email hợp lệ"
},
sodienthoai: {
bsonType: "string",
pattern: "^[0-9]{10,11}$",
description: "Số điện thoại 10-11 số"
},
diachi: { bsonType: "string", description: "Địa chỉ" },
ngayvao: { bsonType: "date", description: "Ngày tạo tài khoản" },
nguoidaidien: {
bsonType: "string",
description: "Người đại diện (chỉ cho business)"
},
hinhanh: {
bsonType: "string",
description: "URL ảnh đại diện"
},

chuoi: {
bsonType: "int",
minimum: 0,
description: "Chuỗi liên tiếp hoàn thành bài tập"
},
matkhau: { bsonType: "string", description: "Mật khẩu đã hash" },
trangthai: {
enum: ["active", "inactive", "blocked"]
}
}
}
}
})

db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "loai_tai_khoan": 1 })
db.users.createIndex({ "ngayvao": 1 })

2.Chinhanh

db.createCollection("chinhanh", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["ten", "diachi", "congtyID"],
properties: {
_id: { bsonType: "objectId" },
ten: { bsonType: "string", description: "Tên chi nhánh" },
diachi: { bsonType: "string", description: "Địa chỉ chi nhánh" },
congtyID: {
bsonType: "objectId",
description: "ID công ty (business) - users phải có loai_tai_khoan = business"
},
trangthai: {
enum: ["active", "inactive"]
},
ngaytao: { bsonType: "date", description: "Ngày tạo" }
}
}
}
})

db.chinhanh.createIndex({ "congtyID": 1 })
db.chinhanh.createIndex({ "ten": 1 })

3.nhanvien

db.createCollection("nhanvien", {
validator: {
$jsonSchema: {
bsonType: "object",
required: [ "mota", "ngaybatdau", "chinhanhID"],
properties: {
_id: { bsonType: "objectId" },
userID: {
bsonType: "objectId",
description: "ID user (personal) được phân quyền làm nhân viên"
},
hinhanh: { bsonType: "string", description: "URL ảnh nhân viên" },
mota: { bsonType: "string", description: "Mô tả về nhân viên/PT" },
ngaybatdau: { bsonType: "date", description: "Ngày bắt đầu làm việc" },
ngayketthuc: {
bsonType: "date",
description: "Ngày kết thúc (null nếu đang làm)"
},

    chinhanhID: {
      bsonType: "objectId",
      description: "ID chi nhánh"
    },
    trangthai: {
      enum: ["active", "inactive"]
    }
  }
}

}
})
db.nhanvien.createIndex({ "userID": 1 }, { unique: true })
db.nhanvien.createIndex({ "chinhanhID": 1 })

4.khachhang

db.createCollection("khachhang", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["chuoi", "diemthuong", "buocchan", "chinhanhID"],
properties: {
_id: { bsonType: "objectId" },
userID: {
bsonType: "objectId",
description: "ID user (personal) được thêm làm khách hàng"
},
hinhanh: { bsonType: "string", description: "URL ảnh khách hàng" },
chuoi: {
bsonType: "int",
minimum: 0,
description: "Chuỗi liên tiếp hoàn thành bài tập"
},
diemthuong: {
bsonType: "int",
minimum: 0,
description: "Điểm thưởng (+10 mỗi bài tập hoàn thành)"
},
buocchan: {
bsonType: "int",
minimum: 0,
description: "Bước chân (từ thiết bị)"
},
chinhanhID: {
bsonType: "objectId",
description: "ID chi nhánh quản lý"
},
nhanvienID: {
bsonType: "objectId",
description: "ID nhanvien/PT phụ trách (null nếu chưa có)"
},
trangthai: {
enum: ["active", "inactive", "tamngung"]
},
ngaydangky: { bsonType: "date", description: "Ngày đăng ký" }
}
}
}
})
db.khachhang.createIndex({ "userID": 1 }, { unique: true })
db.khachhang.createIndex({ "chinhanhID": 1 })
db.khachhang.createIndex({ "nhanvienID": 1 })

5.baitap

db.createCollection("baitap", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["ten", "mota", "thoigiangoc", "cacbuoc", "loiich", "trangthai"],
properties: {
_id: { bsonType: "objectId" },
ten: { bsonType: "string", description: "Tên bài tập" },
calo: {
bsonType: "double",
description: "Calo tiêu thụ dự kiến"
},
mota: { bsonType: "string", description: "Mô tả bài tập" },
thoigiangoc: {
bsonType: "int",
minimum: 1,
description: "Thời gian gốc (phút)"
},
hengio: {
bsonType: "date",
description: "Hệ số thời gian thông báo đến giờ tập"
},
cacbuoc: {
bsonType: "array",
description: "Mảng các bước thực hiện JSON"
},
loiich: {
bsonType: "array",
description: "Mảng lợi ích JSON"
},
trangthai: {
enum: ["hoanthanh", "chuahoanthanh"],
description: "Trạng thái bài tập"
},
thongke: {
bsonType: "int",
minimum: 0,
description: "Tổng số bài tập hoàn thành (không reset)"
},
khachhangID: {
bsonType: "objectId",
description: "ID khách hàng"
},
nhanvienID: {
bsonType: "objectId",
description: "ID nhanvien/PT tạo bài tập"
},

   userID: {

      bsonType: "objectId",
      description: "ID user (personal) sử dụng cho cá nhân"
    },
    ngaytao: { bsonType: "date", description: "Ngày tạo" },
    ngaycapnhat: { bsonType: "date", description: "Ngày cập nhật" }
  }
}

}
})
db.baitap.createIndex({ "khachhangID": 1 })
db.baitap.createIndex({ "nhanvienID": 1 })
db.baitap.createIndex({ "trangthai": 1 })
db.baitap.createIndex({ "ngaytao": 1 })

6.muctieu

db.createCollection("muctieu", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["baitapID", "thoigiantap", "tongthoigiantap", "muctieu"],
properties: {
_id: { bsonType: "objectId" },
baitapID: {
bsonType: "objectId",
description: "ID bài tập liên kết"
},
khachhangID: {
bsonType: "objectId",
description: "ID khách hàng"
},

userID: {
  bsonType: "objectId",
  description: "ID user (personal) sử dụng cho cá nhân"
},
    thoigiantap: {
      bsonType: "int",

      minimum: 0,
      description: "Thời gian tập thực tế (phút)"
    },
    tongthoigiantap: {
      bsonType: "int",

      minimum: 0,
      description: "Tổng thời gian tập (không reset)"
    },
    thongke: {
      bsonType: "int",
      description: "Thống kê tổng thời gian tập (không reset)"
    },
    muctieu: {
      bsonType: "string",
      description: "Mục tiêu cụ thể trong ngày (tổng “thoigiantap” trong ngày đủ từng này là đạt, tính cho chuỗi)"
    },
    trangthai: {
      enum: ["dangtap", "hoanthanh", "thatbai"]
    },
    ngaytao: { bsonType: "date", description: "Ngày tạo" }
  }
}

}
})
db.muctieu.createIndex({ "khachhangID": 1 })
db.muctieu.createIndex({ "baitapID": 1 })
db.muctieu.createIndex({ "ngaytao": 1 })

7.dinhduong

db.createCollection("dinhduong", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["chieucao", "cannang", "luongnuoc", "calo", "ngaytao"],
properties: {
_id: { bsonType: "objectId" },
khachhangID: {
bsonType: "objectId",
description: "ID khách hàng"
},

userID: {

      bsonType: "objectId",
      description: "ID user (personal) sử dụng cho cá nhân"
    },

    chieucao: {
      bsonType: "double",
      description: "Chiều cao (cm)"
    },
    cannang: {
      bsonType: "double",
      description: "Cân nặng (kg)"
    },
    luongnuoc: {
      bsonType: "double",
      description: "Lượng nước cần uống (lít)"
    },
    calo: {
      bsonType: "double",
      description: "Calo tiêu thụ"
    },
    protein: {
      bsonType: "double",
      description: "Protein (g)"
    },
    carbs: {
      bsonType: "double",
      description: "Carbs (g)"
    },
    fat: {
      bsonType: "double",
      description: "Fat (g)"
    },
    ngaytao: { bsonType: "date", description: "Ngày tạo" },
    chieucaothangtruoc: {
      bsonType: "double",
      description: "Chiều cao tháng trước"
    },
    cannangthangtruoc: {
      bsonType: "double",
      description: "Cân nặng tháng trước"
    },
    bmi: {
      bsonType: "double",
      description: "Chỉ số BMI"
    },
    lbm: {
      bsonType: "double",
      description: "Khối lượng cơ thể nạc (LBM)"
    }
  }
}

}
})

db.dinhduong.createIndex({ "khachhangID": 1 })
db.dinhduong.createIndex({ "ngaytao": 1 })

8.sodocothe

db.createCollection("sodocothe", {
validator: {
$jsonSchema: {
bsonType: "object",
required: [ "bophan"],
properties: {
_id: { bsonType: "objectId" },
khachhangID: {
bsonType: "objectId",
description: "ID khách hàng"
},

userID: {

      bsonType: "objectId",
      description: "ID user (personal) sử dụng cho cá nhân"
    },

    bophan: {
      bsonType: "array",
      items: {
        bsonType: "object",
        required: ["ten", "sodo"],
        properties: {
          ten: {
            bsonType: "string",
            description: "Tên bộ phận (Eo, Ngực, Đùi, Tay...)"
          },
          sodo: {
            bsonType: "double",
            description: "Số đo (cm)"
          },
          sodothangtruoc: {
            bsonType: "double",
            description: "Số đo tháng trước"
          }
        }
      },
      description: "Mảng các bộ phận đo"
    },
    ngaytao: { bsonType: "date", description: "Ngày tạo" }
  }
}

}
})
db.sodocothe.createIndex({ "khachhangID": 1 })
db.sodocothe.createIndex({ "ngaytao": 1 })

9.lichhen

db.createCollection("lichhen", {
validator: {
$jsonSchema: {
bsonType: "object",
required: ["khachhangID", "nhanvienID", "ngaytao", "ngayhen"],
properties: {
_id: { bsonType: "objectId" },
khachhangID: {
bsonType: "objectId",
description: "ID khách hàng"
},
nhanvienID: {
bsonType: "objectId",
description: "ID nhanvien/PT"
},
ngaytao: { bsonType: "date", description: "Ngày tạo lịch" },
ngayhen: { bsonType: "date", description: "Ngày hẹn" },
ghichu: { bsonType: "string", description: "Ghi chú lịch hẹn" },
trangthai: {
enum: ["chualichhen", "daxacnhan", "dahuy", "hoanthanh"]
},
diadiem: { bsonType: "string", description: "Địa điểm hẹn" }
}
}
}
})

db.lichhen.createIndex({ "khachhangID": 1 })
db.lichhen.createIndex({ "nhanvienID": 1 })
db.lichhen.createIndex({ "ngayhen": 1 })
db.lichhen.createIndex({ "trangthai": 1 })