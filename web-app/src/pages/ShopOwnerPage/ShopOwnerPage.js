import { useEffect } from "react";
import NewHeader from "../../components/header";
import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import ShopOwnerInfo from "../../components/ShopOwner/ShopOwnerInfo/ShopOwnerInfo";
import ShopOwnerVoucher from "../../components/ShopOwner/ShopOwnerVoucher/ShopOwnerVoucher";
import ShopOwnerImage from "../../components/ShopOwner/ShopOwnerImage/ShopOwnerImage";
import ShopOwnerProduct from "../../components/ShopOwner/ShopOwnerProduct/ShopOwnerProduct";

function ShopOwnerPage() {
    useEffect(() => {
      window.scrollTo(0, 0);
      }, []);
    
    return (
        <div id="container">
            <NewHeader></NewHeader>
            <ShopOwnerInfo></ShopOwnerInfo>
            <ShopOwnerVoucher></ShopOwnerVoucher>
            <ShopOwnerImage></ShopOwnerImage>
            <ShopOwnerProduct></ShopOwnerProduct>
            <FooterLink></FooterLink>
            <FooterPolicyAndTerms></FooterPolicyAndTerms>
        </div>
    );
}

export default ShopOwnerPage;