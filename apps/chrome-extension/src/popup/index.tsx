import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/chrome-extension"
import { CountButton } from "~features/count-button"

import "~style.css"

const PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Please add the PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env.development file')
}

function IndexPopup() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-[600px] plasmo-w-[800px] plasmo-flex plasmo-flex-col">
        <header className="plasmo-w-full">
          <SignedOut>
            <SignInButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <main className="plasmo-grow">
          <CountButton />
        </main>
      </div>
    </ClerkProvider>
  )
}

export default IndexPopup
