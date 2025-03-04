import { Button } from "~components/ui/button"
import { Input } from "~components/ui/input"
import { useState } from "react"

export const SDKFeatures = () => {
  const [selectedPool, setSelectedPool] = useState("stacks");
  
  // Mock staking pools data
  const stakingPools = [
    { 
      id: "stacks", 
      name: "Stacks PoX", 
      token: "STX", 
      balance: "1,245.58", 
      apy: "12.4%", 
      totalStaked: "6.2M STX",
      lockupPeriod: "12 cycles (~2 weeks)", 
      icon: "🔷" 
    },
    { 
      id: "bitcoin", 
      name: "sBTC Pool", 
      token: "sBTC", 
      balance: "0.0214", 
      apy: "8.7%", 
      totalStaked: "215 sBTC",
      lockupPeriod: "1000 blocks (~1 week)", 
      icon: "₿" 
    },
    { 
      id: "usda", 
      name: "USDA Yield", 
      token: "USDA", 
      balance: "0.00", 
      apy: "5.2%", 
      totalStaked: "1.8M USDA",
      lockupPeriod: "None (instant withdraw)", 
      icon: "💵" 
    }
  ];
  
  // User's staking data
  const userStaking = [
    { 
      id: "stacks", 
      staked: "500.00", 
      rewards: "14.52", 
      endDate: "Mar 18, 2025",
      status: "active"
    }
  ];
  
  const selectedPoolData = stakingPools.find(pool => pool.id === selectedPool);
  const userStakingData = userStaking.find(staking => staking.id === selectedPool);
  
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-bg-background plasmo-text-foreground plasmo-overflow-hidden">
      {/* Header with Title */}
      <div className="plasmo-flex plasmo-justify-center plasmo-border-b plasmo-border-b-border/30 plasmo-py-4 plasmo-shrink-0">
        <h1 className="plasmo-text-2xl plasmo-font-bold">Earn Rewards</h1>
      </div>
      
      {/* Main Content */}
      <div className="plasmo-p-6 plasmo-flex-1 plasmo-overflow-y-auto custom-scrollbar">
        {/* Staking Summary Card */}
        <div className="plasmo-bg-gradient-to-br plasmo-from-primary-legacy/70 plasmo-to-primary-legacy/50 plasmo-rounded-xl plasmo-p-5 plasmo-mb-6 plasmo-relative plasmo-overflow-hidden plasmo-shadow-glow">
          <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMjAgMCBMIDAgMCAwIDIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] plasmo-opacity-30"></div>
          <div className="plasmo-relative plasmo-z-10">
            <h2 className="plasmo-text-xs plasmo-font-medium plasmo-uppercase plasmo-text-card-foreground/80 plasmo-mb-1">Total Staking Rewards</h2>
            <div className="plasmo-flex plasmo-items-baseline plasmo-mb-3">
              <span className="plasmo-text-3xl plasmo-font-bold">14.52 STX</span>
              <span className="plasmo-text-xs plasmo-text-green-300 plasmo-ml-2">≈ $16.70</span>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-mb-1">
              <div className="plasmo-w-full plasmo-bg-white/20 plasmo-rounded-full plasmo-h-2">
                <div className="plasmo-bg-white plasmo-h-2 plasmo-rounded-full" style={{ width: "28%" }}></div>
              </div>
              <span className="plasmo-text-xs plasmo-text-white plasmo-ml-2">28%</span>
            </div>
            <p className="plasmo-text-xs plasmo-text-card-foreground/80">6 days until next reward distribution</p>
          </div>
        </div>

        {/* Staking Pools */}
        <h2 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-4">Staking Pools</h2>
        <div className="plasmo-space-y-3 plasmo-mb-6">
          {stakingPools.map(pool => (
            <div 
              key={pool.id}
              className={`plasmo-p-3 plasmo-bg-card/30 plasmo-rounded-lg plasmo-border ${selectedPool === pool.id ? 'plasmo-border-primary-legacy/70 plasmo-shadow-glow' : 'plasmo-border-border/30'} hover:plasmo-bg-card/50 plasmo-transition-colors plasmo-cursor-pointer`}
              onClick={() => setSelectedPool(pool.id)}
            >
              <div className="plasmo-flex plasmo-items-center">
                <div className="plasmo-flex-shrink-0 plasmo-w-10 plasmo-h-10 plasmo-rounded-full plasmo-bg-primary-legacy/10 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mr-3 plasmo-text-xl">
                  {pool.icon}
                </div>
                <div className="plasmo-flex-grow">
                  <div className="plasmo-flex plasmo-justify-between">
                    <span className="plasmo-font-medium">{pool.name}</span>
                    <span className="plasmo-font-medium plasmo-text-green-400">{pool.apy}</span>
                  </div>
                  <div className="plasmo-flex plasmo-justify-between plasmo-mt-1">
                    <span className="plasmo-text-xs plasmo-text-muted-foreground">{pool.token}</span>
                    <span className="plasmo-text-xs plasmo-text-muted-foreground">Balance: {pool.balance}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pool Details */}
        {selectedPoolData && (
          <div className="plasmo-bg-card/30 plasmo-border plasmo-border-border/30 plasmo-rounded-lg plasmo-p-4 plasmo-mb-6">
            <div className="plasmo-mb-4">
              <h3 className="plasmo-text-lg plasmo-font-semibold plasmo-mb-2">{selectedPoolData.name} Details</h3>
              
              <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3 plasmo-mb-4">
                <div>
                  <p className="plasmo-text-xs plasmo-text-muted-foreground">APY</p>
                  <p className="plasmo-font-medium plasmo-text-green-400">{selectedPoolData.apy}</p>
                </div>
                <div>
                  <p className="plasmo-text-xs plasmo-text-muted-foreground">Total Staked</p>
                  <p className="plasmo-font-medium">{selectedPoolData.totalStaked}</p>
                </div>
                <div>
                  <p className="plasmo-text-xs plasmo-text-muted-foreground">Lockup Period</p>
                  <p className="plasmo-font-medium">{selectedPoolData.lockupPeriod}</p>
                </div>
                <div>
                  <p className="plasmo-text-xs plasmo-text-muted-foreground">Your Balance</p>
                  <p className="plasmo-font-medium">{selectedPoolData.balance} {selectedPoolData.token}</p>
                </div>
              </div>
              
              {userStakingData ? (
                <>
                  <div className="plasmo-bg-primary-legacy/10 plasmo-border plasmo-border-primary-legacy/30 plasmo-rounded-lg plasmo-p-3 plasmo-mb-4">
                    <h4 className="plasmo-text-sm plasmo-font-medium plasmo-mb-2">Your Staking Position</h4>
                    <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-3">
                      <div>
                        <p className="plasmo-text-xs plasmo-text-muted-foreground">Amount Staked</p>
                        <p className="plasmo-font-medium">{userStakingData.staked} {selectedPoolData.token}</p>
                      </div>
                      <div>
                        <p className="plasmo-text-xs plasmo-text-muted-foreground">Rewards Earned</p>
                        <p className="plasmo-font-medium plasmo-text-green-400">{userStakingData.rewards} {selectedPoolData.token}</p>
                      </div>
                      <div>
                        <p className="plasmo-text-xs plasmo-text-muted-foreground">Status</p>
                        <p className="plasmo-font-medium plasmo-capitalize">{userStakingData.status}</p>
                      </div>
                      <div>
                        <p className="plasmo-text-xs plasmo-text-muted-foreground">Unlock Date</p>
                        <p className="plasmo-font-medium">{userStakingData.endDate}</p>
                      </div>
                    </div>
                    
                    <div className="plasmo-flex plasmo-space-x-2 plasmo-mt-4">
                      <Button variant="charisma" className="plasmo-flex-1 plasmo-text-sm plasmo-h-9">
                        Claim Rewards
                      </Button>
                      <Button variant="outline" className="plasmo-flex-1 plasmo-border-primary-legacy/50 plasmo-text-primary-legacy plasmo-text-sm plasmo-h-9">
                        Unstake
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="plasmo-flex plasmo-flex-col plasmo-space-y-3">
                  <Input
                    variant="glassMorph"
                    type="text"
                    placeholder={`Amount to stake (${selectedPoolData.token})`}
                    className="plasmo-w-full plasmo-py-3 plasmo-px-4"
                  />
                  
                  <Button variant="charisma" className="plasmo-w-full plasmo-h-10">
                    Stake {selectedPoolData.token}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Learn More */}
        <div className="plasmo-bg-card/30 plasmo-border plasmo-border-border/30 plasmo-rounded-lg plasmo-p-4 plasmo-text-center">
          <h3 className="plasmo-font-medium plasmo-mb-2">About Staking in Charisma</h3>
          <p className="plasmo-text-sm plasmo-text-muted-foreground plasmo-mb-4">
            Staking allows you to earn rewards while supporting the Stacks blockchain network. Learn more about the different staking options and how they work.
          </p>
          <Button 
            variant="charismaSecondary"
            onClick={() => {
              chrome.tabs.create({
                url: "https://docs.charisma.network/staking"
              })
            }}
          >
            Learn About Staking
          </Button>
        </div>
      </div>
    </div>
  )
}
