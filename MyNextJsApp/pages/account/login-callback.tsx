import { useRouter } from "next/router";
import { UserManager, WebStorageStateStore } from "oidc-client";
import { useEffect, useState } from "react";
import { UserManagerFactory } from "../../services/UserManagerFactory";
import Layout from "../shared/layout";



const LoginCallback: React.FunctionComponent<{}> = () => {

    const [userFullName, setUserFullName] = useState('');
    const router = useRouter();

    useEffect(() => {
        handleLogin();
    }, []);
    
    const handleLogin = async () => {
        const userManager = UserManagerFactory();

        if (await userManager.getUser()) {
            router.push('/');
        }

        let success = false;
        try {
            const user = await userManager.signinRedirectCallback(location.href);
            // const data = await userManager.getUser();
            console.log(user);
    
            setUserFullName(user.profile.name ?? '');
        } catch (err) {
            router.push('/account/login');
        }

        if (success) {
            router.push('/');
        }
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