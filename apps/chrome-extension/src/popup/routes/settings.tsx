import { UserProfile, useUser, useClerk } from "@clerk/chrome-extension";
import { Button } from "~components/ui/button";
import { Input } from "~components/ui/input";
import { useState } from "react";

export const Settings = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("wallet");
  const [showExportModal, setShowExportModal] = useState(false);
  
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-bg-background plasmo-text-foreground plasmo-overflow-hidden">
      {/* Header with Title */}
      <div className="plasmo-flex plasmo-justify-center plasmo-border-b plasmo-border-b-border/30 plasmo-py-4 plasmo-shrink-0">
        <h1 className="plasmo-text-2xl plasmo-font-bold">Settings</h1>
      </div>
      
      {/* Settings Tabs */}
      <div className="plasmo-px-6 plasmo-pt-2 plasmo-flex-1 plasmo-overflow-y-auto custom-scrollbar">
        <div className="plasmo-flex plasmo-mb-6 plasmo-border-b plasmo-border-border/30 plasmo-shrink-0">
          <button 
            className={`plasmo-px-4 plasmo-py-2 plasmo-font-medium ${activeTab === "wallet" ? "plasmo-border-b-2 plasmo-border-white/50 plasmo-text-foreground" : "plasmo-text-muted-foreground"}`}
            onClick={() => setActiveTab("wallet")}
          >
            Wallet
          </button>
          <button 
            className={`plasmo-px-4 plasmo-py-2 plasmo-font-medium ${activeTab === "security" ? "plasmo-border-b-2 plasmo-border-white/50 plasmo-text-foreground" : "plasmo-text-muted-foreground"}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
          <button 
            className={`plasmo-px-4 plasmo-py-2 plasmo-font-medium ${activeTab === "network" ? "plasmo-border-b-2 plasmo-border-white/50 plasmo-text-foreground" : "plasmo-text-muted-foreground"}`}
            onClick={() => setActiveTab("network")}
          >
            Networks
          </button>
          <button 
            className={`plasmo-px-4 plasmo-py-2 plasmo-font-medium ${activeTab === "advanced" ? "plasmo-border-b-2 plasmo-border-white/50 plasmo-text-foreground" : "plasmo-text-muted-foreground"}`}
            onClick={() => setActiveTab("advanced")}
          >
            Advanced
          </button>
        </div>
        
        {/* Wallet Tab */}
        {activeTab === "wallet" && (
          <div>
            <div className="plasmo-mb-6">
              <div className="plasmo-flex plasmo-items-center plasmo-mb-4">
                {user?.imageUrl && (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "User"} 
                    className="plasmo-w-12 plasmo-h-12 plasmo-rounded-full plasmo-mr-4"
                  />
                )}
                <div>
                  <h2 className="plasmo-text-lg plasmo-font-semibold">{user?.fullName || "My Wallet"}</h2>
                  <p className="plasmo-text-gray-400 plasmo-text-sm">
                    {user?.primaryEmailAddress?.emailAddress || "SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS"}
                  </p>
                </div>
              </div>
              
              <div className="plasmo-space-y-4">
                <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30">
                  <h3 className="plasmo-font-medium plasmo-mb-3">Display Currency</h3>
                  
                  <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                    <div className="plasmo-flex-1">
                      <select className="plasmo-w-full plasmo-bg-card/30 plasmo-border plasmo-border-border/30 plasmo-rounded plasmo-p-2.5 plasmo-text-foreground">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mt-4">
                  <h3 className="plasmo-font-medium plasmo-mb-3">Gas Price Settings</h3>
                  
                  <div className="plasmo-space-y-4">
                    <div className="plasmo-flex plasmo-items-center">
                      <input
                        type="radio"
                        id="gas-auto"
                        name="gas-option"
                        className="plasmo-h-4 plasmo-w-4 plasmo-border-border/30 plasmo-bg-background plasmo-text-primary-legacy"
                        defaultChecked
                      />
                      <label htmlFor="gas-auto" className="plasmo-ml-2 plasmo-block plasmo-text-sm">
                        Automatic (Recommended)
                      </label>
                    </div>
                    
                    <div className="plasmo-flex plasmo-items-center">
                      <input
                        type="radio"
                        id="gas-custom"
                        name="gas-option"
                        className="plasmo-h-4 plasmo-w-4 plasmo-border-border/30 plasmo-bg-background plasmo-text-primary-legacy"
                      />
                      <label htmlFor="gas-custom" className="plasmo-ml-2 plasmo-block plasmo-text-sm">
                        Custom
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mt-4">
                  <h3 className="plasmo-font-medium plasmo-mb-3">Transaction Settings</h3>
                  
                  <div className="plasmo-space-y-3">
                    <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                      <div>
                        <span className="plasmo-text-sm">Transaction Notifications</span>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="tx-notifications" className="plasmo-opacity-0 plasmo-w-0 plasmo-h-0 plasmo-absolute" defaultChecked />
                        <label htmlFor="tx-notifications"></label>
                      </div>
                    </div>
                    
                    <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                      <div>
                        <span className="plasmo-text-sm">Auto-lock after 5 minutes of inactivity</span>
                      </div>
                      <div className="toggle-switch">
                        <input type="checkbox" id="auto-lock" className="plasmo-opacity-0 plasmo-w-0 plasmo-h-0 plasmo-absolute" defaultChecked />
                        <label htmlFor="auto-lock"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="plasmo-space-y-6">
            <div>
              <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-4">Security Settings</h2>
              
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mb-4">
                <div className="plasmo-flex plasmo-items-start">
                  <div className="plasmo-p-2 plasmo-bg-primary-legacy/10 plasmo-rounded-full plasmo-mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-primary-legacy">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="plasmo-font-medium">Change Password</h3>
                    <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mt-1">Update your wallet password</p>
                    <Button variant="charisma" className="plasmo-mt-3 plasmo-px-3 plasmo-py-1.5 plasmo-text-sm">Change Password</Button>
                  </div>
                </div>
              </div>
              
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mb-4">
                <div className="plasmo-flex plasmo-items-start">
                  <div className="plasmo-p-2 plasmo-bg-primary-legacy/10 plasmo-rounded-full plasmo-mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-primary-legacy">
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="plasmo-font-medium">Reveal Secret Recovery Phrase</h3>
                    <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mt-1">View your 12-word recovery phrase</p>
                    <Button 
                      variant="charisma"
                      className="plasmo-mt-3 plasmo-px-3 plasmo-py-1.5 plasmo-text-sm"
                      onClick={() => setShowExportModal(true)}
                    >
                      Reveal Phrase
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30">
                <div className="plasmo-flex plasmo-items-start">
                  <div className="plasmo-p-2 plasmo-bg-primary-legacy/10 plasmo-rounded-full plasmo-mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-primary-legacy">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="plasmo-font-medium plasmo-text-primary-legacy">Delete Wallet</h3>
                    <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mt-1">Permanently remove this wallet</p>
                    <Button 
                      variant="outline"
                      className="plasmo-mt-3 plasmo-px-3 plasmo-py-1.5 plasmo-text-sm plasmo-border-primary-legacy/50 plasmo-text-primary-legacy"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this wallet? This action cannot be undone.")) {
                          signOut();
                        }
                      }}
                    >
                      Delete Wallet
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Network Tab */}
        {activeTab === "network" && (
          <div>
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-4">Network Settings</h2>
            
            <div className="plasmo-space-y-4">
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30">
                <h3 className="plasmo-font-medium plasmo-mb-3">Default Network</h3>
                
                <div className="plasmo-space-y-3">
                  <div className="plasmo-flex plasmo-items-center">
                    <input
                      type="radio"
                      id="mainnet"
                      name="network"
                      className="plasmo-h-4 plasmo-w-4 plasmo-border-border/30 plasmo-bg-background plasmo-text-primary-legacy"
                      defaultChecked
                    />
                    <label htmlFor="mainnet" className="plasmo-ml-2 plasmo-block plasmo-text-sm">
                      <div className="plasmo-font-medium">Stacks Mainnet</div>
                      <div className="plasmo-text-xs plasmo-text-muted-foreground">Production blockchain network</div>
                    </label>
                  </div>
                  
                  <div className="plasmo-flex plasmo-items-center">
                    <input
                      type="radio"
                      id="testnet"
                      name="network"
                      className="plasmo-h-4 plasmo-w-4 plasmo-border-border/30 plasmo-bg-background plasmo-text-primary-legacy"
                    />
                    <label htmlFor="testnet" className="plasmo-ml-2 plasmo-block plasmo-text-sm">
                      <div className="plasmo-font-medium">Stacks Testnet</div>
                      <div className="plasmo-text-xs plasmo-text-muted-foreground">Test network for developers</div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mt-4">
                <h3 className="plasmo-font-medium plasmo-mb-3">RPC Endpoints</h3>
                
                <div className="plasmo-space-y-3">
                  <div>
                    <label className="plasmo-block plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-1">
                      Mainnet RPC URL
                    </label>
                    <Input
                      variant="glassMorph"
                      type="text"
                      className="plasmo-w-full plasmo-p-2 plasmo-text-sm"
                      defaultValue="https://stacks-node-api.mainnet.stacks.co"
                    />
                  </div>
                  
                  <div>
                    <label className="plasmo-block plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-1">
                      Testnet RPC URL
                    </label>
                    <Input
                      variant="glassMorph"
                      type="text"
                      className="plasmo-w-full plasmo-p-2 plasmo-text-sm"
                      defaultValue="https://stacks-node-api.testnet.stacks.co"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Advanced Tab */}
        {activeTab === "advanced" && (
          <div>
            <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-4">Advanced Settings</h2>
            
            <div className="plasmo-space-y-4">
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30">
                <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                  <div>
                    <h3 className="plasmo-font-medium">Developer Mode</h3>
                    <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mt-1">Enable advanced features for developers</p>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="dev-mode" className="plasmo-opacity-0 plasmo-w-0 plasmo-h-0 plasmo-absolute" />
                    <label htmlFor="dev-mode"></label>
                  </div>
                </div>
              </div>
              
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mt-4">
                <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                  <div>
                    <h3 className="plasmo-font-medium">Reset Account</h3>
                    <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mt-1">Clear cached data and reset transaction history</p>
                  </div>
                  <Button variant="outline" className="plasmo-text-foreground plasmo-text-sm">
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="plasmo-p-4 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border plasmo-border-border/30 plasmo-mt-4">
                <div className="plasmo-flex plasmo-items-start">
                  <div>
                    <h3 className="plasmo-font-medium">About</h3>
                    <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mt-1">Charisma Wallet v1.0.0</p>
                    <div className="plasmo-flex plasmo-gap-2 plasmo-mt-3">
                      <a href="https://charisma.network" target="_blank" rel="noopener" className="plasmo-text-primary-legacy plasmo-text-sm">
                        Website
                      </a>
                      <span className="plasmo-text-card">|</span>
                      <a href="https://docs.charisma.network" target="_blank" rel="noopener" className="plasmo-text-primary-legacy plasmo-text-sm">
                        Documentation
                      </a>
                      <span className="plasmo-text-card">|</span>
                      <a href="https://github.com/charisma-protocol" target="_blank" rel="noopener" className="plasmo-text-primary-legacy plasmo-text-sm">
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Secret Recovery Phrase Modal */}
      {showExportModal && (
        <div className="plasmo-fixed plasmo-inset-0 plasmo-bg-black/80 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-z-50">
          <div className="plasmo-bg-background plasmo-border plasmo-border-border/50 plasmo-rounded-lg plasmo-p-5 plasmo-w-[90%] plasmo-max-w-md">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
              <h3 className="plasmo-text-lg plasmo-font-bold">Secret Recovery Phrase</h3>
              <button 
                className="plasmo-text-muted-foreground hover:plasmo-text-foreground"
                onClick={() => setShowExportModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
            
            <div className="plasmo-bg-primary-legacy/10 plasmo-border plasmo-border-primary-legacy/30 plasmo-rounded-lg plasmo-p-3 plasmo-mb-4">
              <div className="plasmo-flex plasmo-items-start">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-primary-legacy plasmo-mr-2 plasmo-flex-shrink-0">
                  <path fillRule="evenodd" d="M10.339 2.237a.532.532 0 00-.678 0 11.947 11.947 0 01-7.078 2.75.538.538 0 00-.479.533v5.15c0 3.07 2.279 5.788 5.759 7.023a.531.531 0 00.392 0c3.48-1.235 5.76-3.953 5.76-7.023v-5.15a.538.538 0 00-.48-.534 11.947 11.947 0 01-7.077-2.749zM10.5 7a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 0110.5 7zm0 6a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <p className="plasmo-text-xs plasmo-text-primary-legacy">
                  Never share your recovery phrase with anyone. Anyone with this phrase can take full control of your wallet.
                </p>
              </div>
            </div>
            
            <div className="plasmo-grid plasmo-grid-cols-3 plasmo-gap-2 plasmo-mb-6">
              {[
                "wage", "stem", "coffee", "survey", "robot", "album",
                "fossil", "divide", "embark", "valid", "claim", "exercise"
              ].map((word, i) => (
                <div key={i} className="plasmo-bg-card/30 plasmo-border plasmo-border-border/30 plasmo-rounded plasmo-p-2 plasmo-text-center">
                  <span className="plasmo-text-xs plasmo-text-muted-foreground">{i+1}.</span> <span className="plasmo-text-sm">{word}</span>
                </div>
              ))}
            </div>
            
            <div className="plasmo-flex plasmo-justify-between">
              <Button 
                variant="outline" 
                className="plasmo-border-border/30 plasmo-text-foreground"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </Button>
              <Button variant="charisma">
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
