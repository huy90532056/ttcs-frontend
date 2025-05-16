import { useEffect } from "react";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import NewHeader from "../../components/header";
import CartPageBody from "../../components/CartPage/CartPageBody/CartPageBody";
import CartPageSimilarProduct from "../../components/CartPage/CartPageSimilarProduct/CartPageSimilarProduct";

function CartPage() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <CartPageBody></CartPageBody>
            <CartPageSimilarProduct></CartPageSimilarProduct>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default CartPage;