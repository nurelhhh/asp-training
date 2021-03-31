import { UserManager, WebStorageStateStore } from "oidc-client";
import { UserManagerFactory } from "../../services/UserManagerFactory";
import Layout from "../shared/layout";



export function Login() {

    // PKCE (Proof of Key Exchange)
    const tryLogin = async () => {
        const userManager = UserManagerFactory();
        await userManager.signinRedirect();
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={tryLogin} type="button">
                Login
            </button>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Layout title="Login">
            <Login />
        </Layout>
    );
}