import { CustomerClient } from "../api/shop_api";
import { User } from 'oidc-client';


const BaseUrl = 'https://localhost:44324';

export function FetchWithAuthFactory(bearerToken: string) {
    function fetchWithAuth(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
        
        if (!init) {
            init = {};
        }

        let initHeaders: HeadersInit = {};
        
        if (init && init.headers) {
            initHeaders = init.headers;
        }
        
        initHeaders['Authorization'] = 'Bearer ' + bearerToken;
        init.headers = initHeaders;

        return fetch(input, init);
    }

    return {
        fetch: fetchWithAuth
    };
}

export function CustomerClientWithAuth(user: User) {
    const fetch2 = FetchWithAuthFactory(user.access_token);
    return new CustomerClient(BaseUrl, fetch2);
}