import { Link, Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function RootLayout() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <header className="navbar">
        <div className="container flex justify-between items-center w-full">
          <div className="logo-container">
            <Link to="/" className="flex items-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#5546FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#5546FF20" />
                <path d="M12 11L4 6" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11L20 6" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11V22" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">Blaze Protocol</span>
            </Link>
          </div>
          <nav className="nav-links">
            <a href="/#features" className="text-white hover:opacity-90 transition-colors">Features</a>
            <a href="/#developers" className="text-white hover:opacity-90 transition-colors">Developers</a>
            <a href="/#about" className="text-white hover:opacity-90 transition-colors">About Blaze</a>
            <a href="/#signet" className="text-white hover:opacity-90 transition-colors">Signet Signer</a>

            <a href="https://chrome.google.com/webstore/detail/signet-signer/extension-id" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Download Extension
            </a>
          </nav>
        </div>
      </header>
      <main className="min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>
      <footer className="py-8 px-6 bg-black border-t border-primary-legacy/10">
        <div className="container">
          <div className="flex flex-wrap justify-between gap-8">
            <div className="max-w-xs">
              <div className="flex items-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#5546FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#5546FF20" />
                  <path d="M12 11L4 6" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11L20 6" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11V22" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="ml-2 text-lg font-bold text-white">Blaze Protocol</span>
              </div>
              <p className="text-sm text-gray-400">
                Blaze Protocol is a layer 2 scaling solution for Bitcoin and Stacks, with Signet Signer enabling secure, wallet-less web3 experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="https://docs.blazeprotocol.xyz" target="_blank" rel="noopener" className="text-gray-400 hover:text-white hover:opacity-80 transition-colors">Documentation</a></li>
                <li><a href="https://github.com/blaze-protocol" target="_blank" rel="noopener" className="text-gray-400 hover:text-white hover:opacity-80 transition-colors">GitHub</a></li>
                <li><a href="https://discord.gg/blazeprotocol" target="_blank" rel="noopener" className="text-gray-400 hover:text-white hover:opacity-80 transition-colors">Discord</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-gray-400 hover:text-white hover:opacity-80 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white hover:opacity-80 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Signet Signer. All rights reserved.
          </div>
        </div>
      </footer>
    </ClerkProvider>
  )
}
