import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { Card } from "~components/ui/card"
import { useState, useEffect } from "react"

export const SDKFeatures = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [signatureStatus, setSignatureStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [connectionAge, setConnectionAge] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  
  // Update connection age and current time
  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setConnectionAge(prev => prev + 1)
        setCurrentTime(new Date().toLocaleTimeString())
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isConnected])
  
  // Sample data for demo
  const sampleData = {
    "transaction": {
      "type": "transfer",
      "sender": "0xA1B2...F9E0",
      "recipient": "0xC3D4...76G8",
      "amount": "0.05 ETH",
      "fee": "0.002 ETH",
      "nonce": 42
    }
  }
  
  // Handle connection
  const handleConnect = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
      setConnectionAge(0)
      
      // Show wallet connection notification
      window.dispatchEvent(
        new CustomEvent("signet:show-wallet-notification", {
          detail: {
            type: "success",
            title: "Wallet Connected",
            message: "Your Signet wallet is now connected to SDK Demo"
          }
        })
      );
    }, 1000)
  }
  
  // Handle signing
  const handleSign = () => {
    setIsLoading(true)
    setSignatureStatus("signing")
    setTimeout(() => {
      setSignatureStatus("signed")
      setIsLoading(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Show signature success notification
      window.dispatchEvent(
        new CustomEvent("signet:show-signature-notification", {
          detail: {
            type: "success",
            title: "Signature Complete",
            message: "Your data has been successfully signed."
          }
        })
      );
    }, 1500)
  }
  
  // Format connection time
  const formatConnectionTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
  
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-bg-gradient-to-b plasmo-from-background plasmo-to-background/90 plasmo-text-foreground plasmo-overflow-hidden">
      {/* Header */}
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-border-b plasmo-border-border/20 plasmo-py-3 plasmo-px-4 plasmo-backdrop-blur-sm plasmo-bg-card/10">
        <div className="plasmo-flex plasmo-items-center">
          <div className="plasmo-h-8 plasmo-w-8 plasmo-rounded-full plasmo-bg-primary/10 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3 plasmo-border plasmo-border-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-text-primary">
              <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.674 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="plasmo-text-lg plasmo-font-bold plasmo-bg-clip-text plasmo-text-transparent plasmo-bg-gradient-to-r plasmo-from-primary plasmo-to-primary-legacy-light">
            Signet
          </h1>
        </div>
        
        {/* Connection Status Badge */}
        {isConnected ? (
          <div className="plasmo-flex plasmo-items-center plasmo-text-xs plasmo-px-3 plasmo-py-1 plasmo-rounded-full plasmo-bg-success/10 plasmo-border plasmo-border-success/30">
            <div className="plasmo-h-1.5 plasmo-w-1.5 plasmo-rounded-full plasmo-bg-success plasmo-mr-1.5 plasmo-animate-pulse-glow"></div>
            <span className="plasmo-text-success">Connected • {formatConnectionTime(connectionAge)}</span>
          </div>
        ) : (
          <div className="plasmo-flex plasmo-items-center plasmo-text-xs plasmo-px-3 plasmo-py-1 plasmo-rounded-full plasmo-bg-gray/10 plasmo-border plasmo-border-gray/20">
            <div className="plasmo-h-1.5 plasmo-w-1.5 plasmo-rounded-full plasmo-bg-gray plasmo-mr-1.5"></div>
            <span className="plasmo-text-muted-foreground">Disconnected</span>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="plasmo-p-4 plasmo-flex-1 plasmo-overflow-y-auto">
        {/* Feature Description */}
        <div className="plasmo-mb-4 plasmo-p-4 plasmo-bg-gradient-to-br plasmo-from-primary/5 plasmo-to-primary/10 plasmo-rounded-xl plasmo-border plasmo-border-primary/20 plasmo-backdrop-blur-sm plasmo-shadow-md">
          <div className="plasmo-flex plasmo-items-center plasmo-mb-3">
            <div className="plasmo-h-10 plasmo-w-10 plasmo-rounded-full plasmo-bg-gradient-to-br plasmo-from-primary/20 plasmo-to-primary/30 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3 plasmo-shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-text-primary">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.674 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="plasmo-text-lg plasmo-font-bold plasmo-bg-clip-text plasmo-text-transparent plasmo-bg-gradient-to-r plasmo-from-primary-legacy plasmo-to-primary-legacy-light">Signet Signer</h2>
              <div className="plasmo-text-xs plasmo-text-muted-foreground">{currentTime} • Secure Blockchain Interactions</div>
            </div>
          </div>
          <p className="plasmo-text-sm plasmo-text-muted-foreground/90 plasmo-mb-3 plasmo-leading-relaxed">
            Sign transactions and messages securely without exposing your private keys. All cryptographic operations happen locally in your browser for maximum security.
          </p>
          <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3 plasmo-text-xs plasmo-font-medium">
            <div className="plasmo-flex plasmo-items-center plasmo-bg-gradient-to-r plasmo-from-primary/10 plasmo-to-transparent plasmo-p-1.5 plasmo-rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1.5 plasmo-text-success">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="plasmo-text-foreground/90">Private Key Security</span>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-bg-gradient-to-r plasmo-from-primary/10 plasmo-to-transparent plasmo-p-1.5 plasmo-rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1.5 plasmo-text-success">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="plasmo-text-foreground/90">Fast Transactions</span>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-bg-gradient-to-r plasmo-from-primary/10 plasmo-to-transparent plasmo-p-1.5 plasmo-rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1.5 plasmo-text-success">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="plasmo-text-foreground/90">Cross-Chain Support</span>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-bg-gradient-to-r plasmo-from-primary/10 plasmo-to-transparent plasmo-p-1.5 plasmo-rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4 plasmo-mr-1.5 plasmo-text-success">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="plasmo-text-foreground/90">Smart Contract Support</span>
            </div>
          </div>
        </div>
        
        {/* Action Cards Section */}
        <div className="plasmo-grid plasmo-grid-cols-1 plasmo-gap-4">
          {/* Step 1: Connect */}
          <div className="plasmo-bg-card plasmo-border plasmo-border-border/20 plasmo-rounded-xl plasmo-p-4 plasmo-shadow-md plasmo-backdrop-blur-sm">
            <div className="plasmo-flex plasmo-items-center plasmo-mb-3">
              <div className="plasmo-h-8 plasmo-w-8 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-rounded-full plasmo-bg-primary/10 plasmo-text-primary plasmo-mr-3 plasmo-text-lg plasmo-font-bold">
                1
              </div>
              <h3 className="plasmo-font-bold plasmo-text-base">Connect Wallet</h3>
            </div>
            
            <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-4 plasmo-ml-11">
              Connect Signet to your wallet to sign transactions securely.
            </p>
            
            {!isConnected ? (
              <Button 
                variant="charisma" 
                className="plasmo-w-full plasmo-h-10 plasmo-shadow-lg plasmo-font-medium"
                onClick={handleConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="plasmo-flex plasmo-items-center">
                    <svg className="plasmo-animate-spin plasmo-h-4 plasmo-w-4 plasmo-mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="plasmo-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="plasmo-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </div>
                ) : (
                  <div className="plasmo-flex plasmo-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mr-2">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" clipRule="evenodd" />
                      <path d="M4.25 5.5a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-.75-.75m10.25-1a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5a.75.75 0 01.75-.75M7.25 9a.75.75 0 001.5 0V7.36l1.41 1.41a.75.75 0 001.06-1.06l-2.5-2.5a.75.75 0 00-1.06 0l-2.5 2.5a.75.75 0 001.06 1.06l1.03-1.03V9z" />
                    </svg>
                    Connect Wallet
                  </div>
                )}
              </Button>
            ) : (
              <div className="plasmo-flex plasmo-items-center plasmo-bg-success/10 plasmo-border plasmo-border-success/30 plasmo-rounded-lg plasmo-py-2 plasmo-px-3">
                <div className="plasmo-h-2 plasmo-w-2 plasmo-rounded-full plasmo-bg-success plasmo-mr-2 plasmo-animate-pulse-glow"></div>
                <span className="plasmo-text-sm plasmo-text-success">Wallet Connected Successfully</span>
              </div>
            )}
          </div>

          {/* Step 2: Sign Data */}
          <div className={`plasmo-bg-card plasmo-border plasmo-border-border/20 plasmo-rounded-xl plasmo-p-4 plasmo-shadow-md plasmo-backdrop-blur-sm ${!isConnected ? 'plasmo-opacity-50' : ''}`}>
            <div className="plasmo-flex plasmo-items-center plasmo-mb-3">
              <div className="plasmo-h-8 plasmo-w-8 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-rounded-full plasmo-bg-primary/10 plasmo-text-primary plasmo-mr-3 plasmo-text-lg plasmo-font-bold">
                2
              </div>
              <h3 className="plasmo-font-bold plasmo-text-base">Sign Transaction</h3>
            </div>
            
            <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-4 plasmo-ml-11">
              Sign blockchain transactions securely with your wallet.
            </p>
            
            {/* Show Sample Data */}
            <div className="plasmo-bg-black/30 plasmo-border plasmo-border-border/20 plasmo-rounded-lg plasmo-p-3 plasmo-mb-4 plasmo-overflow-hidden">
              <div className="plasmo-flex plasmo-justify-between plasmo-mb-2 plasmo-text-xs">
                <span className="plasmo-text-muted-foreground">Transaction Data</span>
                <span className="plasmo-text-primary-legacy-light plasmo-font-mono">0x8f2e...</span>
              </div>
              <div className="plasmo-font-mono plasmo-text-xs plasmo-text-white/90">
                <pre className="plasmo-p-0">{JSON.stringify(sampleData, null, 2)}</pre>
              </div>
            </div>
            
            <Button 
              variant="charisma" 
              className="plasmo-w-full plasmo-h-10 plasmo-shadow-lg plasmo-font-medium"
              onClick={handleSign}
              disabled={isLoading || !isConnected}
            >
              {isLoading ? (
                <div className="plasmo-flex plasmo-items-center">
                  <svg className="plasmo-animate-spin plasmo-h-4 plasmo-w-4 plasmo-mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="plasmo-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="plasmo-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing...
                </div>
              ) : (
                <div className="plasmo-flex plasmo-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mr-2">
                    <path fillRule="evenodd" d="M10.53 5.968a.75.75 0 01.071 1.06L7.26 10.69l3.012 3.073a.75.75 0 11-1.072 1.05l-3.25-3.312a.75.75 0 010-1.04l3.508-3.571a.75.75 0 011.072.078z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M11.5 5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h1z" />
                    <path d="M13.28 7.78a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 001.06-1.06l-1.47-1.47 1.47-1.47z" />
                    <path d="M10.5 1a.75.75 0 01.75.75V4h3.25a.75.75 0 010 1.5H11.5v6.75a.75.75 0 01-1.5 0V5.5h-.75a.75.75 0 010-1.5h.75V1.75A.75.75 0 0110.5 1z" />
                  </svg>
                  Sign Transaction
                </div>
              )}
            </Button>
            
            {/* Success Indicator */}
            {showSuccess && (
              <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mt-4 plasmo-bg-success/10 plasmo-border plasmo-border-success/30 plasmo-rounded-lg plasmo-p-2 plasmo-text-success plasmo-text-sm plasmo-animate-fade-in">
                <svg className="plasmo-w-4 plasmo-h-4 plasmo-mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transaction Signed Successfully
              </div>
            )}
            
            {/* Signature Animation */}
            {signatureStatus === "signed" && (
              <div className="plasmo-mt-4 plasmo-flex plasmo-justify-center plasmo-overflow-hidden">
                <svg className="plasmo-w-full plasmo-h-16" viewBox="0 0 200 60">
                  <path 
                    d="M20,40 C30,20 40,30 50,40 C60,50 70,20 80,30 C90,40 100,20 110,30 C120,40 130,20 140,40 C150,50 160,30 180,35" 
                    stroke="url(#signatureGradient)" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    className="plasmo-animate-signature"
                  />
                  <defs>
                    <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#c1121f" />
                      <stop offset="100%" stopColor="#ff4d6d" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>
          
          {/* Connection Status Card */}
          <div className="plasmo-bg-card plasmo-border plasmo-border-border/20 plasmo-rounded-xl plasmo-overflow-hidden plasmo-shadow-md">
            <div className="plasmo-bg-gradient-to-r plasmo-from-primary/20 plasmo-to-primary/5 plasmo-py-2 plasmo-px-4 plasmo-border-b plasmo-border-border/20">
              <h3 className="plasmo-font-bold plasmo-text-sm">Connection Status</h3>
            </div>
            <div className="plasmo-p-4 plasmo-space-y-2">
              <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <span className="plasmo-text-xs plasmo-text-muted-foreground">Status</span>
                {isConnected ? (
                  <div className="plasmo-flex plasmo-items-center plasmo-text-xs plasmo-bg-success/10 plasmo-text-success plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full">
                    <div className="plasmo-h-1.5 plasmo-w-1.5 plasmo-rounded-full plasmo-bg-success plasmo-mr-1.5 plasmo-animate-pulse-glow"></div>
                    <span>Connected</span>
                  </div>
                ) : (
                  <div className="plasmo-flex plasmo-items-center plasmo-text-xs plasmo-bg-gray/10 plasmo-text-gray plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full">
                    <div className="plasmo-h-1.5 plasmo-w-1.5 plasmo-rounded-full plasmo-bg-gray plasmo-mr-1.5"></div>
                    <span>Disconnected</span>
                  </div>
                )}
              </div>
              
              <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <span className="plasmo-text-xs plasmo-text-muted-foreground">Network</span>
                <div className="plasmo-flex plasmo-items-center plasmo-text-xs plasmo-bg-primary/10 plasmo-text-primary plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full">
                  <div className="plasmo-h-1.5 plasmo-w-1.5 plasmo-rounded-full plasmo-bg-primary plasmo-mr-1.5"></div>
                  <span>Ethereum Mainnet</span>
                </div>
              </div>
              
              <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <span className="plasmo-text-xs plasmo-text-muted-foreground">Last Activity</span>
                <span className="plasmo-text-xs">{currentTime}</span>
              </div>
              
              <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
                <span className="plasmo-text-xs plasmo-text-muted-foreground">Session</span>
                <span className="plasmo-text-xs">{isConnected ? formatConnectionTime(connectionAge) : 'Not started'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="plasmo-py-2 plasmo-px-4 plasmo-border-t plasmo-border-border/20 plasmo-backdrop-blur-sm plasmo-bg-card/10 plasmo-flex plasmo-justify-between plasmo-items-center">
        <div className="plasmo-text-xs plasmo-text-muted-foreground">v1.0.0</div>
        <div className="plasmo-flex plasmo-space-x-3">
          <button className="plasmo-text-muted-foreground hover:plasmo-text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
              <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="plasmo-text-muted-foreground hover:plasmo-text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Add some CSS for signature animation
// This will be scoped to the component
const style = document.createElement('style');
style.textContent = `
  .plasmo-animate-signature {
    stroke-dasharray: 500;
    stroke-dashoffset: 500;
    animation: signatureAnimation 2s ease-in-out forwards;
  }
  
  .plasmo-animate-fade-in {
    animation: fadeIn 0.5s ease-in-out forwards;
  }
  
  @keyframes signatureAnimation {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);
