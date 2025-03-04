import { SignedIn, SignedOut, useUser } from "@clerk/chrome-extension"
import { Link } from "react-router-dom"
import { Button } from "~components/ui/button"
import { useState } from "react"

// Mock data for demonstration purposes
const mockTokens = [
  { symbol: "STX", name: "Stacks", balance: "1,245.58", usdValue: "$1,432.42", change: "+2.4%", color: "#5546FF" },
  { symbol: "BTC", name: "Bitcoin", balance: "0.0214", usdValue: "$1,285.71", change: "-0.8%", color: "#F7931A" }
]

const mockTransactions = [
  { id: 1, type: "receive", amount: "+250 STX", from: "SP2ZNGJ8XY...", date: "2 hrs ago", status: "confirmed" },
  { id: 2, type: "send", amount: "-120 STX", to: "SP3H5TJY7Z...", date: "Yesterday", status: "confirmed" },
  { id: 3, type: "swap", amount: "30 STX → 0.0005 BTC", date: "Mar 2, 2025", status: "confirmed" }
]

export const Home = () => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState("assets");

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-bg-gradient-to-b plasmo-from-background-dark plasmo-to-[#101935] plasmo-text-text-dark plasmo-overflow-hidden">
      {/* Wallet Header */}
      <div className="plasmo-px-6 plasmo-py-4 plasmo-border-b plasmo-border-gray-dark/30">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
          <div className="plasmo-flex plasmo-items-center">
            <div className="plasmo-h-8 plasmo-mr-3 plasmo-flex plasmo-items-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="#5546FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#5546FF20" />
                <path d="M12 11L4 6" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11L20 6" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 11V22" stroke="#5546FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-bg-primary/10 plasmo-border plasmo-border-primary/20 plasmo-rounded-full plasmo-py-1 plasmo-px-3">
              <div className="plasmo-h-2 plasmo-w-2 plasmo-rounded-full plasmo-bg-success plasmo-mr-2"></div>
              <span className="plasmo-text-xs plasmo-font-medium">Stacks Mainnet</span>
            </div>
          </div>
          <SignedIn>
            <div className="plasmo-flex plasmo-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-text-dark/70 plasmo-mr-4 plasmo-cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="plasmo-h-7 plasmo-w-7 plasmo-rounded-full plasmo-cursor-pointer"
                />
              ) : (
                <div className="plasmo-h-7 plasmo-w-7 plasmo-rounded-full plasmo-bg-gray-800 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-white plasmo-cursor-pointer plasmo-border plasmo-border-gray-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="plasmo-flex-grow plasmo-overflow-y-auto plasmo-pb-16 custom-scrollbar">
        <SignedOut>
          <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-px-8 plasmo-text-center">
            <div className="plasmo-bg-primary/10 plasmo-p-6 plasmo-rounded-full plasmo-mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-16 plasmo-h-16 plasmo-text-primary">
                <path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
              </svg>
            </div>
            <h1 className="plasmo-text-2xl plasmo-font-bold plasmo-mb-3">Welcome to Signet Wallet</h1>
            <p className="plasmo-text-text-dark/70 plasmo-mb-6 plasmo-max-w-md">
              Your gateway to seamless blockchain transactions with the Blaze protocol
            </p>
            <div className="plasmo-grid plasmo-grid-cols-1 plasmo-gap-3 plasmo-w-full plasmo-max-w-xs">
              <Button asChild variant="accent" className="plasmo-h-11">
                <Link to="/sign-up">Create a Wallet</Link>
              </Button>
              <Button asChild variant="outline" className="plasmo-h-11">
                <Link to="/sign-in">Access My Wallet</Link>
              </Button>
            </div>

            <div className="plasmo-mt-8 plasmo-w-full plasmo-max-w-md plasmo-bg-white/5 plasmo-rounded-lg plasmo-border plasmo-border-gray-dark/30 plasmo-p-4">
              <h3 className="plasmo-text-sm plasmo-font-medium plasmo-text-text-dark plasmo-mb-2">Powered by Blaze Protocol</h3>
              <p className="plasmo-text-xs plasmo-text-text-dark/70">
                Experience lightning-fast transactions with our L2 scaling solution, offering all the security of blockchain with the speed of Web2.
              </p>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Wallet Balance Section */}
          <div className="plasmo-px-6 plasmo-pt-6 plasmo-pb-3">
            <div className="plasmo-bg-card plasmo-border plasmo-border-border/40 plasmo-backdrop-blur-md plasmo-shadow-charisma plasmo-rounded-lg plasmo-p-5 plasmo-relative plasmo-overflow-hidden">
              <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] plasmo-opacity-30"></div>
              <h2 className="plasmo-text-xs plasmo-font-medium plasmo-uppercase plasmo-text-muted-foreground plasmo-mb-1 plasmo-relative plasmo-z-10">Total Balance</h2>
              <div className="plasmo-flex plasmo-items-baseline plasmo-mb-1 plasmo-relative plasmo-z-10">
                <span className="plasmo-text-3xl plasmo-font-bold plasmo-text-foreground">$2,718.13</span>
                <span className="plasmo-text-xs plasmo-text-green-300 plasmo-ml-2">+1.2% today</span>
              </div>
              <div className="plasmo-flex plasmo-justify-between plasmo-mt-5 plasmo-relative plasmo-z-10">
                <Button variant="glassMorph" size="sm" className="plasmo-text-foreground hover:plasmo-border-primary-legacy/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Deposit
                </Button>
                <Button variant="glassMorph" size="sm" className="plasmo-text-foreground hover:plasmo-border-primary-legacy/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1">
                    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                  Send
                </Button>
                <Button variant="glassMorph" size="sm" className="plasmo-text-foreground hover:plasmo-border-primary-legacy/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1">
                    <path fillRule="evenodd" d="M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z" clipRule="evenodd" />
                  </svg>
                  Swap
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="plasmo-flex plasmo-border-b plasmo-border-border/30 plasmo-px-6">
            <button
              className={`plasmo-px-4 plasmo-py-3 plasmo-text-sm plasmo-font-medium ${selectedTab === 'assets' ? 'plasmo-text-foreground plasmo-border-b-2 plasmo-border-white/50' : 'plasmo-text-muted-foreground hover:plasmo-text-foreground/80'}`}
              onClick={() => setSelectedTab('assets')}
            >
              Assets
            </button>
            <button
              className={`plasmo-px-4 plasmo-py-3 plasmo-text-sm plasmo-font-medium ${selectedTab === 'activity' ? 'plasmo-text-foreground plasmo-border-b-2 plasmo-border-white/50' : 'plasmo-text-muted-foreground hover:plasmo-text-foreground/80'}`}
              onClick={() => setSelectedTab('activity')}
            >
              Activity
            </button>
            <button
              className={`plasmo-px-4 plasmo-py-3 plasmo-text-sm plasmo-font-medium ${selectedTab === 'apps' ? 'plasmo-text-foreground plasmo-border-b-2 plasmo-border-white/50' : 'plasmo-text-muted-foreground hover:plasmo-text-foreground/80'}`}
              onClick={() => setSelectedTab('apps')}
            >
              Apps
            </button>
          </div>

          {/* Assets Tab */}
          {selectedTab === 'assets' && (
            <div className="plasmo-px-6 plasmo-py-4 plasmo-overflow-y-auto plasmo-pb-16 custom-scrollbar">
              <div className="plasmo-space-y-3">
                {mockTokens.map((token) => (
                  <div key={token.symbol} className="plasmo-flex plasmo-items-center plasmo-p-3 plasmo-bg-card plasmo-rounded-lg plasmo-border plasmo-border-border/40 plasmo-backdrop-blur-sm plasmo-shadow-sm hover:plasmo-border-white/20 plasmo-transition-all plasmo-cursor-pointer">
                    <div className="plasmo-flex-shrink-0 plasmo-mr-3">
                      <div 
                        className="plasmo-w-10 plasmo-h-10 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center" 
                        style={{ 
                          background: `linear-gradient(135deg, ${token.color}20, ${token.color}40)`,
                          boxShadow: `0 0 8px ${token.color}30`, 
                        }}
                      >
                        <span className="plasmo-font-bold" style={{ color: token.color }}>{token.symbol}</span>
                      </div>
                    </div>
                    <div className="plasmo-flex-grow">
                      <div className="plasmo-flex plasmo-justify-between">
                        <span className="plasmo-font-medium">{token.name}</span>
                        <span className="plasmo-font-semibold">{token.balance}</span>
                      </div>
                      <div className="plasmo-flex plasmo-justify-between plasmo-mt-1">
                        <span className="plasmo-text-xs plasmo-text-muted-foreground">{token.symbol}</span>
                        <div className="plasmo-flex plasmo-items-center">
                          <span className="plasmo-text-xs plasmo-text-muted-foreground plasmo-mr-2">{token.usdValue}</span>
                          <span className={`plasmo-text-xs ${token.change.startsWith('+') ? 'plasmo-text-success' : 'plasmo-text-error'}`}>{token.change}</span>
                        </div>
                      </div>
                    </div>
                    <div className="plasmo-flex-shrink-0 plasmo-ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-muted-foreground">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ))}
                <button className="plasmo-w-full plasmo-mt-3 plasmo-p-2 plasmo-border plasmo-border-dashed plasmo-border-border/40 plasmo-rounded-lg plasmo-text-muted-foreground hover:plasmo-border-white/30 hover:plasmo-text-foreground plasmo-flex plasmo-items-center plasmo-justify-center plasmo-transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-2">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Add Token
                </button>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {selectedTab === 'activity' && (
            <div className="plasmo-px-6 plasmo-py-4 plasmo-overflow-y-auto plasmo-pb-16 custom-scrollbar">
              <div className="plasmo-space-y-3">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="plasmo-p-3 plasmo-bg-white/5 plasmo-rounded-lg plasmo-border plasmo-border-gray-dark/30">
                    <div className="plasmo-flex plasmo-items-center">
                      <div className={`plasmo-w-8 plasmo-h-8 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3 ${tx.type === 'receive' ? 'plasmo-bg-success/20 plasmo-text-success' :
                          tx.type === 'send' ? 'plasmo-bg-primary/20 plasmo-text-primary' :
                            'plasmo-bg-secondary/20 plasmo-text-secondary'
                        }`}>
                        {tx.type === 'receive' && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                          </svg>
                        )}
                        {tx.type === 'send' && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z" clipRule="evenodd" transform="rotate(90, 10, 10)" />
                          </svg>
                        )}
                        {tx.type === 'swap' && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
                            <path fillRule="evenodd" d="M13.2 2.24a.75.75 0 0 0 .04 1.06l2.1 1.95H6.75a.75.75 0 0 0 0 1.5h8.59l-2.1 1.95a.75.75 0 1 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 0 0-1.06.04Zm-6.4 8a.75.75 0 0 0-1.06-.04l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 1 0 1.02-1.1l-2.1-1.95h8.59a.75.75 0 0 0 0-1.5H4.66l2.1-1.95a.75.75 0 0 0 .04-1.06Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="plasmo-flex-grow">
                        <div className="plasmo-flex plasmo-justify-between">
                          <span className="plasmo-font-medium plasmo-capitalize">{tx.type}</span>
                          <span className={`plasmo-font-semibold ${tx.type === 'receive' ? 'plasmo-text-success' : ''}`}>{tx.amount}</span>
                        </div>
                        <div className="plasmo-flex plasmo-justify-between plasmo-mt-1">
                          {tx.from && <span className="plasmo-text-xs plasmo-text-text-dark/60">From: {tx.from}</span>}
                          {tx.to && <span className="plasmo-text-xs plasmo-text-text-dark/60">To: {tx.to}</span>}
                          <span className="plasmo-text-xs plasmo-text-text-dark/60">{tx.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button className="plasmo-w-full plasmo-mt-2 plasmo-p-2 plasmo-text-text-dark/60 hover:plasmo-text-text-dark/80 plasmo-text-sm">
                  View All Transactions
                </button>
              </div>
            </div>
          )}

          {/* Apps Tab */}
          {selectedTab === 'apps' && (
            <div className="plasmo-px-6 plasmo-py-4 plasmo-overflow-y-auto plasmo-pb-16 custom-scrollbar">
              <div className="plasmo-bg-white/5 plasmo-rounded-lg plasmo-border plasmo-border-gray-dark/30 plasmo-p-5 plasmo-text-center">
                <div className="plasmo-flex plasmo-justify-center plasmo-mb-4">
                  <div className="plasmo-bg-primary/10 plasmo-p-3 plasmo-rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-8 plasmo-h-8 plasmo-text-primary">
                      <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
                    </svg>
                  </div>
                </div>
                <h3 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-2">Connect to Blaze dApps</h3>
                <p className="plasmo-text-text-dark/70 plasmo-text-sm plasmo-mb-4">
                  No applications are currently connected. Visit a Blaze-enabled app to connect your wallet.
                </p>
                <Button>
                  Browse dApps
                </Button>
              </div>
            </div>
          )}
        </SignedIn>
      </div>
    </div>
  );
};
