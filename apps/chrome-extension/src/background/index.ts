import "@plasmohq/messaging/background"
import { startHub } from "@plasmohq/messaging/pub-sub"

console.log(`[BLAZE] PROTOCOL BOOTING...`)

// Start message hub for communication
startHub()

// Log successful boot
console.log(`[BLAZE] PROTOCOL READY`)