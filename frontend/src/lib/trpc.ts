import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
// Import the router type from your backend
import type { AppRouter } from '../../../backend/src/trpc';

// Create the tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/trpc',
        }),
    ],
});
