import { useEffect } from "react";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import NewHeader from "../../components/header";
import ProductPageBody from "../../components/ProductPage/ProductPageBody/ProductPageBody";
import ProductPageShop from "../../components/ProductPage/ProductPageShop/ProductPageShop";
import ProductReview from "../../components/ProductPage/ProductReview/ProductReview";
import ProductDetailAndVoucher from "../../components/ProductPage/ProductDetailAndVoucher/ProductDetailAndVoucher";
import SimilarProduct from "../../components/ProductPage/SimilarProduct/SimilarProduct";

function ProductPage() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <ProductPageBody></ProductPageBody>
            <ProductPageShop></ProductPageShop>
            <ProductDetailAndVoucher></ProductDetailAndVoucher>
            <ProductReview></ProductReview>
            <SimilarProduct></SimilarProduct>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default ProductPage;