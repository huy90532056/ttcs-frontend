import { useEffect } from "react";
import Banner from "../../components/CategoryProduct/Banner/Banner";
import ShopeeMallHeader from "../../components/CategoryProduct/ShopeeMallHeader/ShopeeMallHeader";
import TrendingMall from "../../components/CategoryProduct/TrendingMall/TrendingMall";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import NewHeader from "../../components/header";
import SearchProductItems from "../../components/SearchProduct/SearchProductItems/SearchProductItems";

function SearchProductPage() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <Banner></Banner>
            <ShopeeMallHeader></ShopeeMallHeader>
            <TrendingMall></TrendingMall>
            <SearchProductItems></SearchProductItems>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default SearchProductPage;