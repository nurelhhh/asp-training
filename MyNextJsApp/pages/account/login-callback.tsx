import { useRouter } from "next/router";
import { UserManager, WebStorageStateStore } from "oidc-client";
import { useEffect, useState } from "react";
import { UserManagerFactory } from "../../services/UserManagerFactory";
import Layout from "../../shared/layout";



const LoginCallback: React.FunctionComponent<{}> = () => {

    const [userFullName, setUserFullName] = useState('');
    
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
            const user = await userManager.signinRedirectCallback(location.href);
            // const data = await userManager.getUser();
            console.log(user);
    
        } catch (err) {
            location.href = '/account/login';
        }

        location.href = '/';
    }


    if (userFullName) {
        return (
            <div>
                <h1>Hello {userFullName}</h1>
            </div>
        );
    }
    return (
        <div>
            Loading...
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