import { useEffect } from "react";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import NewHeader from "../../components/header";
import PurchasePageBody from "../../components/PurchasePage/PurchasePageBody/PurchasePageBody";

function PurchasePage() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <PurchasePageBody></PurchasePageBody>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default PurchasePage;