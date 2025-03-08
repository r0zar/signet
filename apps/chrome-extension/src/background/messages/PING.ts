import type { PlasmoMessaging } from "@plasmohq/messaging"

/**
 * Simple ping handler to check extension and node status
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log(`[BLAZE] PING RECEIVED`)

    res.send({
        status: 'active',
        extensionVersion: '0.1.0'
    })
}

export default handler
