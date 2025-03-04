import { Outlet, useNavigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/chrome-extension";
import { NavBar } from "~components/nav-bar";

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY
const SYNC_HOST = process.env.PLASMO_PUBLIC_CLERK_SYNC_HOST

if (!PUBLISHABLE_KEY || !SYNC_HOST) {
  throw new Error('Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY and PLASMO_PUBLIC_CLERK_SYNC_HOST to the .env.development file')
}

export const RootLayout = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      syncHost={SYNC_HOST}
    >
      <div className="plasmo-w-[400px] plasmo-h-[600px] plasmo-flex plasmo-flex-col plasmo-bg-background plasmo-text-foreground plasmo-font-sans plasmo-antialiased">
        <main className="plasmo-flex-1 plasmo-flex plasmo-flex-col plasmo-overflow-hidden">
          <Outlet />
        </main>
        <footer className="plasmo-shadow-lg plasmo-relative plasmo-z-10">
          <NavBar />
        </footer>
      </div>
    </ClerkProvider>
  );
};
