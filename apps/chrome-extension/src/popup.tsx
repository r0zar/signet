import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./style.css" // Import the Tailwind CSS styles

function IndexPopup() {
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected">("connected")

  return (
    <div className="min-h-[50px] w-[360px] text-white font-sans bg-gradient-to-b from-gray-900 to-black">
      {/* Header Bar with Chrome-like window controls */}
      <div className="bg-gray-900 border-b border-gray-800 p-3 flex items-center justify-between">
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

      {/* Footer */}
      <div className="border-t border-gray-800 mt-auto py-2 px-4 flex justify-between items-center text-xs text-gray-500">
        <div>Signet v0.1.0</div>
        <div className="flex space-x-3">
          <a href="#" className="hover:text-[#5546FF] transition-colors">Docs</a>
          <a href="#" className="hover:text-[#5546FF] transition-colors">Support</a>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup