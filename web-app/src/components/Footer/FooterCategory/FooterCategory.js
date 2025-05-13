import React from "react";
import "./FooterCategory.css";

const categories = [
  {
    title: "THỜI TRANG NAM",
    items: [
      "Áo Khoác", "Áo Vest và Blazer", "Áo Hoodie, Áo Len & Áo Nỉ", "Quần Jeans",
      "Quần Dài/Quần Âu", "Quần Short", "Áo", "Áo Ba Lỗ", "Đồ Lót", "Đồ Ngủ", "Đồ Bộ",
      "Vớ/Tất", "Trang Phục Truyền Thống", "Đồ Hóa Trang", "Trang Phục Ngành Nghề",
      "Khác", "Trang Sức Nam", "Kính Mắt Nam", "Thắt Lưng Nam", "Cà vạt & Nơ cổ", "Phụ Kiện Nam"
    ]
  },
  {
    title: "NHÀ CỬA & ĐỜI SỐNG",
    items: [
      "Chăn, Ga, Gối & Nệm", "Đồ nội thất", "Dụng cụ cầm tay", "Trang trí nhà cửa",
      "Dụng cụ & Thiết bị tiện ích", "Đồ dùng nhà bếp & Phòng ăn", "Đèn", "Ngoài trời & Sân vườn",
      "Tủ đựng & Hộp lưu trữ", "Khác", "Đồ dùng phòng tắm"
    ]
  },
  {
    title: "ĐỒNG HỒ",
    items: [
      "Đồng Hồ Nam", "Đồng Hồ Nữ", "Bộ Đồng Hồ & Đồng Hồ Cặp", "Đồng Hồ Trẻ Em",
      "Phụ Kiện Đồng Hồ", "Khác"
    ]
  },
  {
    title: "PHỤ KIỆN & TRANG SỨC NỮ",
    items: [
      "Nhẫn", "Bông tai", "Khăn choàng", "Găng tay", "Kẹp tóc", "Vòng tay & Lắc tay",
      "Vòng cổ", "Phụ kiện tóc", "Khác"
    ]
  },
  {
    title: "THỜI TRANG NỮ",
    items: [
      "Quần", "Quần đùi", "Chân váy", "Quần jeans", "Đầm", "Váy cưới", "Đồ liền thân",
      "Áo khoác, Áo choàng & Vest", "Áo & Cardigan", "Hoodie và Áo nỉ", "Bộ", "Đồ lót",
      "Đồ ngủ", "Áo lót", "Đồ tập", "Đồ bầu", "Đồ truyền thống", "Đồ hóa trang", "Vải", "Khác"
    ]
  },
  {
    title: "MÁY TÍNH & LAPTOP",
    items: [
      "Máy Tính Bàn", "Màn Hình", "Linh Kiện Máy Tính", "Thiết Bị Lưu Trữ", "Thiết Bị Mạng",
      "Gaming", "Máy In, Máy Scan & Máy Chiếu", "Phụ Kiện Máy Tính", "Laptop", "Khác"
    ]
  },
  {
    title: "GIÀY DÉP NỮ",
    items: [
      "Bốt", "Giày Thể Thao/ Sneaker", "Giày Tây Lười", "Giày Búp Bê", "Giày Cao Gót",
      "Giày Đế Xuồng", "Xăng-đan và Dép", "Giày Khác"
    ]
  },
  {
    title: "VALI & DU LỊCH",
    items: [
      "Vali du lịch", "Phụ kiện du lịch", "Túi du lịch", "Ba lô du lịch", "Túi trống",
      "Túi đựng giày", "Khác"
    ]
  },
  {
    title: "ĐIỆN THOẠI & PHỤ KIỆN",
    items: [
      "Điện thoại", "Máy tính bảng", "Pin Dự Phòng", "Pin Gắn Trong, Cáp và Bộ Sạc",
      "Ốp lưng, bao da, Miếng dán điện thoại", "Bảo vệ màn hình", "Đế giữ điện thoại & Gậy Chụp hình",
      "Thẻ nhớ", "Sim", "Khác", "Điện Thoại Bàn"
    ]
  },
  {
    title: "SẮC ĐẸP",
    items: [
      "Tắm & chăm sóc cơ thể", "Chăm sóc tay, chân & móng", "Chăm sóc tóc", "Chăm sóc nam giới",
      "Nước hoa", "Trang điểm", "Dụng cụ làm đẹp", "Chăm sóc da mặt", "Bộ sản phẩm làm đẹp", "Khác"
    ]
  },
  {
    title: "GIÀY DÉP NAM",
    items: [
      "Bốt", "Giày Thể Thao/ Sneakers", "Giày Suối", "Giày Tây Lười", "Giày Oxfords & Giày Buộc Dây",
      "Giày Đế Xuồng", "Xăng-đan và Dép", "Phụ kiện giày dép", "Giày Khác"
    ]
  },
  {
    title: "BÁCH HÓA ONLINE",
    items: [
      "Gạo & ngũ cốc", "Đồ chế biến sẵn", "Nhu yếu phẩm", "Nguyên liệu nấu ăn", "Đồ làm bánh",
      "Sữa, bơ, phô mai", "Ngũ cốc & mứt", "Đồ uống", "Đồ ăn vặt", "Đồ hộp & đóng gói", "Khác"
    ]
  },
  {
    title: "MẸ & BÉ",
    items: [
      "Đồ dùng du lịch cho bé", "Đồ dùng ăn dặm cho bé", "Phụ kiện cho mẹ", "Chăm sóc sức khỏe mẹ",
      "Đồ dùng phòng tắm & Chăm sóc cơ thể", "Đồ dùng phòng ngủ cho bé", "An toàn cho bé",
      "Thực phẩm cho bé", "Chăm sóc sức khỏe bé", "Tã & bô em bé", "Đồ chơi", "Bộ & Gói quà tặng",
      "Khác", "Sữa công thức trên 24 tháng", "Sữa công thức 0-24 tháng tuổi"
    ]
  },
  {
    title: "MÁY ẢNH & MÁY QUAY PHIM",
    items: [
      "Máy ảnh - Máy quay phim", "Camera giám sát & Camera hệ thống", "Thẻ nhớ", "Ống kính",
      "Phụ kiện máy ảnh", "Máy bay camera & Phụ kiện"
    ]
  },
  {
    title: "TÚI VÍ NỮ",
    items: [
      "Ba Lô Nữ", "Cặp Laptop", "Ví Dự Tiệc & Ví Cầm Tay", "Túi Đeo Hông & Túi Đeo Ngực",
      "Túi Tote", "Túi Quai Xách", "Túi Đeo Chéo & Túi Đeo Vai", "Ví/Bóp Nữ", "Phụ Kiện Túi", "Khác"
    ]
  },
  {
    title: "Ô TÔ & XE MÁY & XE ĐẠP",
    items: [
      "Xe đạp, xe điện", "Mô tô, xe máy", "Xe Ô tô", "Phụ kiện xe", "Chăm sóc xe", "Khác"
    ]
  },
  {
    title: "THIẾT BỊ ĐIỆN TỬ",
    items: [
      "Thiết bị đeo thông minh", "Phụ kiện tivi", "Máy Game Console", "Phụ kiện Console",
      "Game Console", "Thiết Bị Điện Tử", "Loa", "Tai Nghe", "Tivi", "Tivi Box"
    ]
  },
  {
    title: "SỨC KHỎE",
    items: [
      "Thực phẩm chức năng", "Vật tư y tế", "Chăm sóc cá nhân", "Hỗ trợ tình dục", "Khác"
    ]
  },
  {
    title: "THIẾT BỊ ĐIỆN GIA DỤNG",
    items: [
      "Đồ gia dụng nhà bếp", "Đồ gia dụng lớn", "Máy hút bụi & Thiết bị làm sạch",
      "Quạt & Máy nóng lạnh", "Thiết bị chăm sóc quần áo", "Khác"
    ]
  },
  {
    title: "NHÀ SÁCH ONLINE",
    items: [
      "Đĩa Than", "Album Ảnh", "Dụng Cụ May Vá", "Khác", "Tạp Chí & Báo Giấy", "Sách",
      "Văn Phòng Phẩm", "Quà Lưu Niệm", "Băng - Đĩa", "Nhạc Cụ & Phụ Kiện"
    ]
  },
  {
    title: "CHĂM SÓC THÚ CƯNG",
    items: [
      "Thức ăn cho thú cưng", "Phụ kiện cho thú cưng", "Mỹ phẩm cho thú cưng",
      "Quần áo & phụ kiện", "Chăm sóc sức khỏe", "Khác"
    ]
  }
];

const FooterCategory = () => {
  return (
    <div className="footer-category-container">
      <h3 className="footer-category-title">Danh Mục</h3>
      <div className="footer-category-columns">
        {categories.map((cat, idx) => (
          <div className="footer-category-column" key={idx}>
            <div className="footer-category-column-title">{cat.title}</div>
            <div className="footer-category-items">
              {cat.items.map((item, i) => (
                <span key={i} className="footer-category-item">
                  {item}
                  {i !== cat.items.length - 1 && <span className="footer-category-separator"> | </span>}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FooterCategory;