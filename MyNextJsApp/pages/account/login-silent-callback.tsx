import { useRouter } from "next/router";
import { useEffect } from "react";
import { UserManagerFactory } from "../../services/UserManagerFactory";
import Layout from "../../shared/layout";



const LoginCallback: React.FunctionComponent<{}> = () => {

    useEffect(() => {
        handleLogin();
    }, []);
    
    const handleLogin = async () => {
        const userManager = UserManagerFactory();

        if (await userManager.getUser()) {
            location.href = '/';
        }

        let success = false;
        try {
            await userManager.signinSilentCallback(location.href);
            success = true;
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            Loggin in...
        </div>
    );
}

export default function LoginCallbackPage() {
    return (
        <Layout title="Login">
            <LoginCallback />
        </Layout>
    );
}