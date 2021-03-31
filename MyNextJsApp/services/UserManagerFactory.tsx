import { UserManager, WebStorageStateStore } from "oidc-client";

export function UserManagerFactory() {
    return new UserManager({
        authority: 'https://sso.accelist.com/auth/realms/Dev',
        client_id: 'aspnet-training',
        redirect_uri: 'http://localhost:3000/account/login-callback',
        post_logout_redirect_uri: 'http://localhost:3000/account/login',
        revokeAccessTokenOnSignout: true,
        response_type: 'code', // login pake PKCE, bukan implicit flow (krn ga aman)
        scope: 'openid profile email customer-api',
        stateStore: new WebStorageStateStore({
            store: localStorage
        }),
        userStore: new WebStorageStateStore({ // hati2 kena XSS
            store: localStorage
        })
    });
}