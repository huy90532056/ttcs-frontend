import FooterLink from "../../components/Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../../components/Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
import Login from "./Login";

function LoginPage() {
    return (
        <>
            <Login />
            <FooterLink />
            <FooterPolicyAndTerms />
        </>
    );
}

export default LoginPage;
