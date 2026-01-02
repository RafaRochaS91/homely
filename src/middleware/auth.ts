import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/auth';

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    // Skip authentication for login and auth API routes
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Allow access to login and auth API routes
    if (pathname === '/login' || pathname.startsWith('/api/auth')) {
      return await next();
    }

    // Check for session
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw redirect({ to: '/login' });
    }

    return await next();
  }
);