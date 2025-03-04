import { SignedIn, SignedOut, UserButton } from "@clerk/chrome-extension"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"

export const NavBar = () => {
  const location = useLocation();

  // Function to check if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SignedIn>
        <div className="plasmo-flex plasmo-flex-row plasmo-w-full plasmo-items-center plasmo-justify-between plasmo-bg-background plasmo-border-t plasmo-border-border/30 plasmo-py-1 plasmo-h-14">
          <Link
            to="/"
            className={`plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-flex-1 plasmo-text-sm plasmo-font-medium ${
              isActive('/') 
                ? 'plasmo-text-foreground plasmo-font-semibold' 
                : 'plasmo-text-muted-foreground hover:plasmo-text-foreground hover:plasmo-bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mb-1">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
            <span>Wallet</span>
          </Link>

          <Link
            to="/sdk-features"
            className={`plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-flex-1 plasmo-text-sm plasmo-font-medium ${
              isActive('/sdk-features') 
                ? 'plasmo-text-foreground plasmo-font-semibold' 
                : 'plasmo-text-muted-foreground hover:plasmo-text-foreground hover:plasmo-bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mb-1">
              <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
              <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
              <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
              <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
            </svg>
            <span>Staking</span>
          </Link>

          <Link
            to="/send-receive"
            className={`plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-flex-1 plasmo-text-sm plasmo-font-medium ${
              isActive('/send-receive') 
                ? 'plasmo-text-foreground plasmo-font-semibold' 
                : 'plasmo-text-muted-foreground hover:plasmo-text-foreground hover:plasmo-bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mb-1">
              <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 9a.75.75 0 010 1.06l-3.22 3.22H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
            <span>Swap</span>
          </Link>

          <Link
            to="/settings"
            className={`plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-flex-1 plasmo-text-sm plasmo-font-medium ${
              isActive('/settings') 
                ? 'plasmo-text-foreground plasmo-font-semibold' 
                : 'plasmo-text-muted-foreground hover:plasmo-text-foreground hover:plasmo-bg-white/5'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mb-1">
              <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
            </svg>
            <span>Settings</span>
          </Link>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="plasmo-flex plasmo-flex-row plasmo-w-full plasmo-items-center plasmo-justify-between plasmo-bg-background plasmo-border-t plasmo-border-border/30 plasmo-py-3 plasmo-px-6">
          <div className="plasmo-flex plasmo-items-center plasmo-space-x-5 plasmo-w-full plasmo-justify-center">
            <Button variant="glassMorph" asChild className="plasmo-h-10 hover:plasmo-border-white/30">
              <Link to="/sign-in">Access Wallet</Link>
            </Button>
            <Button variant="charisma" asChild className="plasmo-h-10">
              <Link to="/sign-up">Create Wallet</Link>
            </Button>
          </div>
        </div>
      </SignedOut>
    </>
  )
}
