import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserManagerFactory } from "../../services/UserManagerFactory";
import Layout from "../../shared/layout";


const Logout: React.FunctionComponent<{}> = () => {

    const router = useRouter();

    useEffect(() => {
        handleLogout();
    }, []);
    
    /**
     * https://sso.accelist.com/auth/realms/Dev/protocol/openid-connect/logout?id_token_hint=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyTER0WDgzb3ExcEFyREFHZzVpMlIxbHRsUXdzcEJFWU9oTTNsa0J6SGt3In0.eyJleHAiOjE2MTcxNjQ0MDYsImlhdCI6MTYxNzE2NDEwNiwiYXV0aF90aW1lIjoxNjE3MTYyNDc5LCJqdGkiOiJiNjU5YThjNC0xNDZkLTRiN2QtOGJkYi02MjAxYTY4ZWQ1YzIiLCJpc3MiOiJodHRwczovL3Nzby5hY2NlbGlzdC5jb20vYXV0aC9yZWFsbXMvRGV2IiwiYXVkIjoiYXNwbmV0LXRyYWluaW5nIiwic3ViIjoiNDZjNzA3ZWItOTcwZC00NmQ1LTlmZTQtZTM1Mjk3OGU5YTdkIiwidHlwIjoiSUQiLCJhenAiOiJhc3BuZXQtdHJhaW5pbmciLCJzZXNzaW9uX3N0YXRlIjoiNGNlMGEzMjgtNjg4MC00M2U3LTlkZTMtYTlmNDBkNTc5N2UxIiwiYXRfaGFzaCI6InFIdV9tN2pFTWdncTlBeXdldGxtcUEiLCJhY3IiOiIwIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJuYW1lIjoiTnVyZWwgSGFyc3lhIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibnVyZWxfaGFyc3lhQG91dGxvb2suY29tIiwiZ2l2ZW5fbmFtZSI6Ik51cmVsIiwiZmFtaWx5X25hbWUiOiJIYXJzeWEiLCJlbWFpbCI6Im51cmVsX2hhcnN5YUBvdXRsb29rLmNvbSJ9.NCPz4NaMGIJ54xEgyPcshvHAnuMDo6GegYyPhbO0mHfkClmweSu-sX4OY3lB4OaVrgpJeYYJQJQEEL9KSsPA6c5s28faYtL131G6181Man0sO91PTAQZm6hKa7CyYRvrP5JcfrZYTC402C_8DoZ8K5DEFLr8MZ6bJSgkORKO82nFJUQWUk_DHvxU-w9hORrHRoKoPBQSHJ_knXb79bwzFg-K3waS6P5I_qpkVPla8wn4eQ-x21xfy-HwEsQkGQGJk0qCreTUuoMFy1qz6qnpck30ubc_NmAMsD5ok9R5FcPX8hnzQyk-DExqM_QYhSYEhByBZmw6ddkM-WASAJa88g
     */
    const handleLogout = async () => {
        const userManager = UserManagerFactory();

        const user = await userManager.getUser();
        if (user) {
            await userManager.signoutRedirect();
        }
    }

    return (
        <div>
            Logging out...
        </div>
    );
}

export default function LogoutPage() {
    return (
        <Layout title="Logout">
            <Logout />
        </Layout>
    );
}