import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/discover/:path*",
    "/casting/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/availability/:path*",
    "/applications/:path*",
    "/payments/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
  ],
};
