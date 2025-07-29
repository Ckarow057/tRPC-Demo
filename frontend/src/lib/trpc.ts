import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/trpc';
import { AuthHttp } from './auth';

// Create the tRPC client with authentication
export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/trpc',
            headers: () => {
                return AuthHttp.createHeaders();
            },
        }),
    ],
});
