import { useEffect } from "react";
import NewHeader from "../../components/header";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import ShipperDashboardBody from "../../components/ShipperDashboard/ShipperDashboardBody";

function ShipperDashboard() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <ShipperDashboardBody></ShipperDashboardBody>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default ShipperDashboard;