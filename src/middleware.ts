import { withAuth } from "next-auth/middleware";

// middleware is applied to all routes, use conditionals to select
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default withAuth(function middleware(_) {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;
      if (
        (pathname.startsWith("/rooms/book") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/receptionist") ||
          pathname.startsWith("/bookings")) &&
        !token
      ) {
        return false;
      }

      if (pathname.startsWith("/auth") && token) {
        return false;
      }

      return true;
    },
  },
});
