import { useEffect } from "react";
import Banner from "../../components/CategoryProduct/Banner/Banner";
import CategoryProductItems from "../../components/CategoryProduct/CategoryProductItems/CategoryProduct";
import ShopeeMallHeader from "../../components/CategoryProduct/ShopeeMallHeader/ShopeeMallHeader";
import TrendingMall from "../../components/CategoryProduct/TrendingMall/TrendingMall";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import NewHeader from "../../components/header";

function CategoryProductPage() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <Banner></Banner>
            <ShopeeMallHeader></ShopeeMallHeader>
            <TrendingMall></TrendingMall>
            <CategoryProductItems></CategoryProductItems>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default CategoryProductPage;