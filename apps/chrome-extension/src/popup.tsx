import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./style.css" // Import the Tailwind CSS styles

function IndexPopup() {
  const [status, setStatus] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected">("disconnected")

  // Check connection status on mount
  useEffect(() => {
    // Simulate connection check
    setTimeout(() => {
      setConnectionStatus("connected")
    }, 1000)
  }, [])

  // Open our test notifications page
  const openTestPage = () => {
    setIsLoading(true)
    setStatus("Opening test page...")
    
    chrome.tabs.create({
      url: chrome.runtime.getURL("tabs/test-notifications.html")
    })
    
    setTimeout(() => {
      setIsLoading(false)
      setStatus("Test page opened")
    }, 500)
  }

  // Trigger a success notification on the current page
  const testSuccessNotification = async () => {
    setIsLoading(true)
    setStatus("Testing success notification...")
    
    try {
      // Get current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (tabs[0]?.id) {
        // Execute script in the current tab
        await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            // Dispatch custom event
            try {
              window.dispatchEvent(
                new CustomEvent("signet:show-notification", {
                  detail: {
                    type: "success",
                    title: "Success from Popup",
                    message: "This notification was triggered from the extension popup!"
                  }
                })
              )
            } catch (error) {
              console.error("Failed to dispatch event:", error)
            }
          }
        })
        
        setStatus("Notification sent!")
      } else {
        setStatus("Error: Couldn't find active tab")
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[400px] w-[360px] text-white font-sans bg-gradient-to-b from-gray-900 to-black">
      {/* Header Bar with Chrome-like window controls */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#5546FF]/10 flex items-center justify-center border border-[#5546FF]/30 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5546FF]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Signet Signer</h1>
            <div className={`text-xs flex items-center ${connectionStatus === "connected" ? "text-green-400" : "text-yellow-400"}`}>
              <span className={`h-1.5 w-1.5 rounded-full mr-1 ${connectionStatus === "connected" ? "bg-green-500" : "bg-yellow-500"}`}></span>
              {connectionStatus === "connected" ? "Connected" : "Connecting..."}
            </div>
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between p-1 mb-4 bg-gray-800/60 rounded-lg backdrop-blur-sm border border-gray-700/50">
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${activeTab === "home" ? "bg-[#5546FF] text-white shadow-lg shadow-[#5546FF]/20" : "text-gray-400 hover:text-white"}`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveTab("activity")}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${activeTab === "activity" ? "bg-[#5546FF] text-white shadow-lg shadow-[#5546FF]/20" : "text-gray-400 hover:text-white"}`}
          >
            Activity
          </button>
          <button 
            onClick={() => setActiveTab("tests")}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${activeTab === "tests" ? "bg-[#5546FF] text-white shadow-lg shadow-[#5546FF]/20" : "text-gray-400 hover:text-white"}`}
          >
            Tests
          </button>
        </div>

        {/* Active Tab Content */}
        {activeTab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Status Card */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-xl overflow-hidden shadow-xl p-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#5546FF]/15 flex items-center justify-center border border-[#5546FF]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5546FF]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Secure Signing Ready</h3>
                  <p className="text-xs text-gray-400 mt-1">Your secure environment is active and ready to sign</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs bg-gray-800/70 rounded-lg border border-gray-700/60 p-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
                  <span className="text-white">No pending signatures</span>
                </div>
                <button className="text-[#5546FF] hover:text-[#6E60FF] transition-colors">
                  View History
                </button>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl border border-gray-700/50 p-4 transition-all cursor-pointer flex flex-col items-center justify-center h-[100px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5546FF] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-xs font-medium text-white">My Keys</span>
              </div>
              <div className="bg-gray-800/40 hover:bg-gray-800/60 rounded-xl border border-gray-700/50 p-4 transition-all cursor-pointer flex flex-col items-center justify-center h-[100px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#5546FF] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-medium text-white">Transaction Log</span>
              </div>
            </div>
            
            {/* Connected Sites */}
            <div className="bg-gray-800/40 rounded-xl border border-gray-700/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Connected Sites</h3>
                <button className="text-xs text-[#5546FF]">View All</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 hover:bg-gray-800/60 rounded-lg transition-colors">
                  <div className="w-6 h-6 rounded bg-white/10 mr-3 flex items-center justify-center text-xs font-semibold text-white">S</div>
                  <span className="text-xs text-white">signet-demo.charisma.xyz</span>
                  <div className="ml-auto px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">
                    Active
                  </div>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-800/60 rounded-lg transition-colors">
                  <div className="w-6 h-6 rounded bg-white/10 mr-3 flex items-center justify-center text-xs font-semibold text-white">B</div>
                  <span className="text-xs text-white">blaze-protocol.com</span>
                  <div className="ml-auto px-1.5 py-0.5 bg-gray-700/50 border border-gray-600/20 rounded text-xs text-gray-400">
                    Inactive
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-xl overflow-hidden shadow-xl p-4">
              <h3 className="text-sm font-medium text-white mb-3">Recent Activity</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-white">Data Signature</div>
                    <div className="text-xs text-gray-400">3 mins ago</div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-400">signet-demo.charisma.xyz</div>
                    <div className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">Successful</div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-white">Connection Request</div>
                    <div className="text-xs text-gray-400">15 mins ago</div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-400">blaze-protocol.com</div>
                    <div className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">Approved</div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-white">Key Generation</div>
                    <div className="text-xs text-gray-400">2 hours ago</div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-400">System</div>
                    <div className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400">Completed</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-3 py-2 text-xs font-medium text-[#5546FF] bg-[#5546FF]/10 hover:bg-[#5546FF]/20 rounded-lg transition-colors">
                Load More
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === "tests" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-gray-700/60 rounded-xl overflow-hidden shadow-xl p-4">
              <h3 className="text-sm font-medium text-white mb-3">Test Notification System</h3>
              <p className="text-xs text-gray-400 mb-4">Use these tools to test the Signet notification system functionality.</p>
              
              <div className="space-y-3">
                <button
                  onClick={openTestPage}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#5546FF] hover:bg-[#5546FF]/90 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Opening...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span>Open Test Page</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={testSuccessNotification}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-3 w-3 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Test Current Tab</span>
                    </>
                  )}
                </button>
              </div>
              
              {status && (
                <div className="mt-3 p-2 bg-gray-800/70 border border-gray-700/60 rounded-lg text-xs text-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-[#5546FF]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {status}
                </div>
              )}
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#5546FF]/10 flex items-center justify-center border border-[#5546FF]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#5546FF]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">About Signet</h3>
                  <p className="text-xs text-gray-400">Version 1.0.0</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Signet is a Chrome extension for auto-signing structured data securely. All cryptographic operations happen locally in your browser.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 mt-auto py-2 px-4 flex justify-between items-center text-xs text-gray-500">
        <div>© 2025 Charisma</div>
        <div className="flex space-x-3">
          <a href="#" className="hover:text-[#5546FF] transition-colors">Docs</a>
          <a href="#" className="hover:text-[#5546FF] transition-colors">Support</a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup