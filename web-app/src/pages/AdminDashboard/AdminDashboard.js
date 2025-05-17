import { useEffect } from "react";
import NewHeader from "../../components/header";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import UserPageBody from "../../components/UserPage/UserPageBody";
import AdminDashboardBody from "../../components/AdminDashboard/AdminDashboardBody";

function AdminDashboard() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <AdminDashboardBody></AdminDashboardBody>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default AdminDashboard;