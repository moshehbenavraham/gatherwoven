import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from '@/components/SEOHead';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SEOHead
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Return to discover events and community calendars."
        noindex
      />
      <main id="main-content" className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <Link
          to="/"
          className="text-blue-500 underline hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          Return to Home
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
