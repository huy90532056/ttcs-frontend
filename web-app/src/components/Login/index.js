import FooterLink from "../Footer/FooterLink/FooterLink";
import FooterPolicyAndTerms from "../Footer/FooterPolicyAndTerms/FooterPolicyAndTerms";
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
