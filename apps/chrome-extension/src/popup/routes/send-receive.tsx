import { useState } from "react";
import { Button } from "~components/ui/button";
import { Card } from "~components/ui/card";
import { Input } from "~components/ui/input";

export const SendReceive = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [selectedToken, setSelectedToken] = useState("STX");
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  
  // Mock tokens 
  const tokens = [
    { symbol: "STX", name: "Stacks", balance: "1,245.58", price: "$1.15", color: "#c1121f" },
    { symbol: "BTC", name: "Bitcoin", balance: "0.0214", price: "$60,082.32", color: "#F7931A" }
  ];
  
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-bg-background plasmo-text-foreground plasmo-overflow-hidden">
      {/* Header */}
      <div className="plasmo-flex plasmo-justify-center plasmo-border-b plasmo-border-b-border/30 plasmo-py-4 plasmo-shrink-0">
        <h1 className="plasmo-text-2xl plasmo-font-bold">
          {activeTab === "send" ? "Send" : "Receive"}
        </h1>
      </div>
      
      {/* Tab Navigation */}
      <div className="plasmo-flex plasmo-border-b plasmo-border-border/30 plasmo-mx-6 plasmo-shrink-0">
        <button 
          className={`plasmo-flex-1 plasmo-px-4 plasmo-py-3 plasmo-text-sm plasmo-font-medium ${
            activeTab === 'send' 
              ? 'plasmo-text-foreground plasmo-border-b-2 plasmo-border-white/50' 
              : 'plasmo-text-muted-foreground hover:plasmo-text-foreground/80'
          }`}
          onClick={() => setActiveTab('send')}
        >
          Send
        </button>
        <button 
          className={`plasmo-flex-1 plasmo-px-4 plasmo-py-3 plasmo-text-sm plasmo-font-medium ${
            activeTab === 'receive' 
              ? 'plasmo-text-foreground plasmo-border-b-2 plasmo-border-white/50' 
              : 'plasmo-text-muted-foreground hover:plasmo-text-foreground/80'
          }`}
          onClick={() => setActiveTab('receive')}
        >
          Receive
        </button>
      </div>
      
      {/* Send Tab */}
      {activeTab === "send" && (
        <div className="plasmo-px-6 plasmo-py-4 plasmo-flex-1 plasmo-overflow-y-auto custom-scrollbar">
          {/* Token Selection */}
          <div className="plasmo-mb-6">
            <label className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-muted-foreground plasmo-mb-2">
              Select Asset
            </label>
            <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3">
              {tokens.map(token => (
                <Card 
                  key={token.symbol}
                  variant={selectedToken === token.symbol ? 'glassMorph' : 'default'}
                  className={`plasmo-p-3 plasmo-cursor-pointer hover:plasmo-border-primary-legacy/30 transition-all ${
                    selectedToken === token.symbol 
                      ? 'plasmo-border-primary-legacy/50 plasmo-shadow-glow' 
                      : ''
                  }`}
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <div className="plasmo-flex plasmo-items-center">
                    <div 
                      className="plasmo-w-8 plasmo-h-8 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3" 
                      style={{ 
                        background: `linear-gradient(135deg, ${token.color}20, ${token.color}40)`,
                        boxShadow: `0 0 8px ${token.color}30`, 
                      }}
                    >
                      <span className="plasmo-font-bold plasmo-text-xs" style={{ color: token.color }}>{token.symbol}</span>
                    </div>
                    <div>
                      <div className="plasmo-font-medium">{token.name}</div>
                      <div className="plasmo-text-xs plasmo-text-muted-foreground">{token.balance} {token.symbol}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Amount Input */}
          <div className="plasmo-mb-6">
            <label className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-muted-foreground plasmo-mb-2">
              Amount
            </label>
            <div className="plasmo-relative">
              <Input
                variant="glassMorph"
                type="text"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="plasmo-w-full plasmo-py-3 plasmo-px-4 plasmo-text-lg"
              />
              <div className="plasmo-absolute plasmo-inset-y-0 plasmo-right-0 plasmo-flex plasmo-items-center plasmo-pr-3 plasmo-pointer-events-none">
                <span className="plasmo-text-muted-foreground">{selectedToken}</span>
              </div>
            </div>
            <div className="plasmo-flex plasmo-justify-between plasmo-mt-2 plasmo-text-xs plasmo-text-muted-foreground">
              <span>≈ ${(Number(sendAmount || 0) * (selectedToken === "STX" ? 1.15 : 60082.32)).toFixed(2)} USD</span>
              <button 
                className="plasmo-text-primary-legacy hover:plasmo-underline"
                onClick={() => {
                  const token = tokens.find(t => t.symbol === selectedToken);
                  if (token) {
                    setSendAmount(token.balance.replace(",", ""));
                  }
                }}
              >
                MAX
              </button>
            </div>
          </div>
          
          {/* Recipient Input */}
          <div className="plasmo-mb-6">
            <label className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-muted-foreground plasmo-mb-2">
              Recipient Address
            </label>
            <div className="plasmo-relative">
              <Input
                variant="glassMorph"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter address or select contact"
                className="plasmo-w-full"
              />
              <button className="plasmo-absolute plasmo-inset-y-0 plasmo-right-0 plasmo-flex plasmo-items-center plasmo-pr-3 plasmo-text-muted-foreground hover:plasmo-text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5">
                  <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16.5h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16.5z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Network Fee */}
          <Card variant="glassMorph" className="plasmo-mb-8 plasmo-p-3">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
              <span className="plasmo-text-sm plasmo-text-muted-foreground">Network Fee</span>
              <span className="plasmo-text-sm">0.00042 {selectedToken}</span>
            </div>
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mt-1">
              <span className="plasmo-text-xs plasmo-text-muted-foreground">Estimated processing time</span>
              <span className="plasmo-text-xs plasmo-text-muted-foreground">~2 seconds</span>
            </div>
          </Card>
          
          {/* Send Button */}
          <Button 
            variant="charisma"
            size="xl"
            className="plasmo-w-full"
            disabled={!sendAmount || !recipient}
          >
            Send {selectedToken}
          </Button>
        </div>
      )}
      
      {/* Receive Tab */}
      {activeTab === "receive" && (
        <div className="plasmo-px-6 plasmo-py-4 plasmo-flex-1 plasmo-overflow-y-auto custom-scrollbar plasmo-flex plasmo-flex-col plasmo-items-center">
          {/* QR Code */}
          <Card variant="shadow" className="plasmo-bg-white plasmo-p-3 plasmo-mb-6">
            <div className="plasmo-bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGgyMDB2MjAwSDB6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI1IDI1aDUwdjUwSDI1ek0xMjUgMjVoNTB2NTBoLTUwek0yNSAxMjVoNTB2NTBIMjV6TTc1IDc1aDUwdjUwSDc1ek0xMjUgNzVoMjV2MjVoLTI1ek0xNzUgNzVoMjV2MjVoLTE3NXpNMTI1IDEyNWgyNXYyNWgtMjV6TTE3NSAxMjVoMjV2MjVoLTI1ek0xMjUgMTc1aDI1djI1aC0yNXpNMTc1IDE3NWgyNXYyNWgtMjV6IiBmaWxsPSIjMDAwIi8+PC9zdmc+')]" style={{ width: "200px", height: "200px" }}></div>
          </Card>
          
          {/* Address Display */}
          <div className="plasmo-w-full plasmo-mb-6">
            <label className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-muted-foreground plasmo-mb-2">
              Your {selectedToken} Address
            </label>
            <Card variant="glassMorph" className="plasmo-flex plasmo-items-center plasmo-p-3">
              <div className="plasmo-flex-grow plasmo-font-mono plasmo-text-sm plasmo-truncate">
                SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS
              </div>
              <button className="plasmo-flex-shrink-0 plasmo-ml-2 plasmo-text-primary-legacy hover:plasmo-text-primary-legacy/80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5">
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
              </button>
            </Card>
          </div>
          
          {/* Token Selection */}
          <div className="plasmo-w-full plasmo-mb-6">
            <label className="plasmo-block plasmo-text-sm plasmo-font-medium plasmo-text-muted-foreground plasmo-mb-2">
              Select Asset to Receive
            </label>
            <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3">
              {tokens.map(token => (
                <Card 
                  key={token.symbol}
                  variant={selectedToken === token.symbol ? 'glassMorph' : 'default'}
                  className={`plasmo-p-3 plasmo-cursor-pointer hover:plasmo-border-primary-legacy/30 transition-all ${
                    selectedToken === token.symbol 
                      ? 'plasmo-border-primary-legacy/50 plasmo-shadow-glow' 
                      : ''
                  }`}
                  onClick={() => setSelectedToken(token.symbol)}
                >
                  <div className="plasmo-flex plasmo-items-center">
                    <div 
                      className="plasmo-w-8 plasmo-h-8 plasmo-rounded-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3" 
                      style={{ 
                        background: `linear-gradient(135deg, ${token.color}20, ${token.color}40)`,
                        boxShadow: `0 0 8px ${token.color}30`, 
                      }}
                    >
                      <span className="plasmo-font-bold plasmo-text-xs" style={{ color: token.color }}>{token.symbol}</span>
                    </div>
                    <div>
                      <div className="plasmo-font-medium">{token.name}</div>
                      <div className="plasmo-text-xs plasmo-text-muted-foreground">{token.balance} {token.symbol}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Share Button */}
          <Button 
            variant="charismaSecondary"
            size="xl"
            className="plasmo-w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-5 plasmo-h-5 plasmo-mr-2">
              <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
            </svg>
            Share Address
          </Button>
        </div>
      )}
    </div>
  );
};