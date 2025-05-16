import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductDetail } from "../../../apis";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductDetail(productId);
      setProduct(data);
    };
    fetchData();
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const category = product.categories?.[0];
  const detailRows = [
    {
      label: "Danh Mục",
      value: (
        <>
          <Link to="/" className="product-detail-link">Shopee</Link>
          {" > "}
          {category && (
            <Link
              to={`/category/${category.categoryId}`}
              className="product-detail-link"
            >
              {category.categoryName}
            </Link>
          )}
        </>
      ),
    },
    { label: "Số lượng hàng khuyến mãi", value: "9999" },
    { label: "Số sản phẩm còn lại", value: "9999" },
    { label: "Xuất xứ", value: "Việt Nam" },
    { label: "Bảo hành", value: "Có" },
    { label: "Cho trả hàng", value: "Có" },
    {
      label: "Địa chỉ tổ chức chịu trách nhiệm sản xuất",
      value: "Hà Nội",
    },
  ];

  return (
    <div className="product-detail-container">
      <h2 className="product-detail-title">CHI TIẾT SẢN PHẨM</h2>
      <table className="product-detail-table">
        <tbody>
          {detailRows.map((row, idx) => (
            <tr key={idx}>
              <td className="product-detail-label">{row.label}</td>
              <td className="product-detail-value">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductDetail;