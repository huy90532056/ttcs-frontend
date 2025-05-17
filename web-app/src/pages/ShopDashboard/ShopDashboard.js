import { useEffect } from "react";
import NewHeader from "../../components/header";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import AdminDashboardBody from "../../components/AdminDashboard/AdminDashboardBody";
import ShopDashboardBody from "../../components/ShopDashboard/ShopDashboardBody";

function ShopDashboard() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <ShopDashboardBody></ShopDashboardBody>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default ShopDashboard;