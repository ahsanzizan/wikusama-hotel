import { withAuth } from "next-auth/middleware";

// middleware is applied to all routes, use conditionals to select
export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;
      if (
        (pathname.startsWith("/rooms") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/receptionist")) &&
        !token
      ) {
        return false;
      }

      return true;
    },
  },
});
