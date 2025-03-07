import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./style.css" // Import the Tailwind CSS styles

function IndexPopup() {
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected">("connected")
  const [systemStatus, setSystemStatus] = useState({
    power: 100,
    signal: 85,
    shield: 92
  })

  // Virtual console typing effect
  const [consoleText, setConsoleText] = useState("")
  const fullConsoleText = "> SIGNET SYSTEM ONLINE\n> SECURE CONNECTION ESTABLISHED\n> BLAZE PROTOCOL ACTIVE"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullConsoleText.length) {
        setConsoleText(fullConsoleText.substring(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      style={{
        width: '360px',
        height: '500px',
        background: 'linear-gradient(180deg, #0D1117 0%, #010409 100%)',
        border: '1px solid rgba(125, 249, 255, 0.3)',
        borderRadius: '0px',
        overflow: 'hidden',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        position: 'relative',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 5px rgba(125, 249, 255, 0.5)'
      }}
    >
      {/* Top bar with status indicators */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(13, 17, 23, 0.8) 0%, rgba(125, 249, 255, 0.1) 50%, rgba(13, 17, 23, 0.8) 100%)',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(125, 249, 255, 0.3)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <motion.div
            animate={{
              boxShadow: ['0 0 2px rgba(125, 249, 255, 0.8)', '0 0 8px rgba(125, 249, 255, 0.8)', '0 0 2px rgba(125, 249, 255, 0.8)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#7DF9FF',
            }}
          />
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#7DF9FF' }}>SIGNET</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>SIGNAL</span>
            <motion.div
              style={{
                width: '30px',
                height: '6px',
                background: 'linear-gradient(90deg, #7DF9FF 0%, #36C758 100%)',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                }}
              />
            </motion.div>
          </div>
          <div style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>PWR</span>
            <motion.div
              style={{
                width: '30px',
                height: '6px',
                background: 'linear-gradient(90deg, #DA2FB7 0%, #8C32C1 100%)',
                borderRadius: '3px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)'
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main interface section */}
      <div style={{
        position: 'relative',
        padding: '16px',
        height: 'calc(100% - 100px)', // Account for top and bottom bars
        overflow: 'hidden'
      }}>
        {/* Background grid lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(125, 249, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(125, 249, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          zIndex: 0
        }} />

        {/* Holographic display area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{
            background: 'rgba(13, 17, 23, 0.6)',
            border: '1px solid rgba(125, 249, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
            zIndex: 1,
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Panel border effect - top */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, #7DF9FF 50%, transparent 100%)',
              opacity: 0.8
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)'
              }}
            />
          </motion.div>

          {/* 3D Hologram placeholder */}
          <div style={{
            margin: '20px auto',
            width: '120px',
            height: '120px',
            position: 'relative'
          }}>
            <motion.div
              animate={{
                rotateY: [0, 360],
                boxShadow: [
                  '0 0 15px rgba(125, 249, 255, 0.5)',
                  '0 0 25px rgba(125, 249, 255, 0.7)',
                  '0 0 15px rgba(125, 249, 255, 0.5)'
                ]
              }}
              transition={{
                rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
                boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
              }}
              style={{
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(125, 249, 255, 0.2) 0%, rgba(13, 17, 23, 0.2) 100%)',
                border: '1px solid rgba(125, 249, 255, 0.6)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <motion.div
                animate={{
                  rotateX: [0, 360],
                  rotateZ: [0, -360],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                style={{
                  width: '70%',
                  height: '70%',
                  borderRadius: '2px',
                  background: 'radial-gradient(circle, rgba(125, 249, 255, 0.1) 0%, rgba(125, 249, 255, 0.4) 100%)',
                  border: '1px solid rgba(125, 249, 255, 0.6)',
                  boxShadow: '0 0 15px rgba(125, 249, 255, 0.5)',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '100%',
                  height: '1px',
                  background: 'rgba(125, 249, 255, 0.8)',
                  transform: 'translate(-50%, -50%)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '1px',
                  height: '100%',
                  background: 'rgba(125, 249, 255, 0.8)',
                  transform: 'translate(-50%, -50%)'
                }} />
              </motion.div>
            </motion.div>

            {/* Scanning lines effect */}
            <motion.div
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(125, 249, 255, 0.8) 50%, transparent 100%)',
                boxShadow: '0 0 5px rgba(125, 249, 255, 0.8)'
              }}
            />
          </div>

          {/* Status data */}
          <div style={{
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}>
            <div>STATUS: ACTIVE</div>
            <div>POWER: {systemStatus.power}%</div>
            <div>SHIELD: {systemStatus.shield}%</div>
          </div>
        </motion.div>

        {/* Terminal/Console section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{
            background: 'rgba(1, 4, 9, 0.8)',
            border: '1px solid rgba(125, 249, 255, 0.3)',
            borderRadius: '6px',
            padding: '12px',
            position: 'relative',
            height: '100px',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          {/* Panel border effect - shimmer at top */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(125, 249, 255, 0.6) 50%, transparent 100%)',
              opacity: 0.6
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '30%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)'
              }}
            />
          </motion.div>

          {/* Panel detail - "circuit" lines */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '6px',
            width: '25px',
            height: '30px',
            zIndex: 2
          }}>
            <div style={{
              position: 'absolute',
              top: '0px',
              right: '0px',
              width: '2px',
              height: '100%',
              background: 'rgba(125, 249, 255, 0.15)'
            }} />
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '0px',
              width: '10px',
              height: '2px',
              background: 'rgba(125, 249, 255, 0.15)'
            }} />
            <div style={{
              position: 'absolute',
              top: '18px',
              right: '0px',
              width: '15px',
              height: '2px',
              background: 'rgba(125, 249, 255, 0.15)'
            }} />
            <div style={{
              position: 'absolute',
              top: '28px',
              right: '0px',
              width: '5px',
              height: '2px',
              background: 'rgba(125, 249, 255, 0.15)'
            }} />
          </div>

          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'repeating-linear-gradient(0deg, rgba(125, 249, 255, 0.03) 0px, rgba(125, 249, 255, 0.03) 1px, transparent 1px, transparent 2px)',
            pointerEvents: 'none'
          }} />

          <pre style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#7DF9FF',
            margin: 0,
            height: '100%',
            overflow: 'hidden'
          }}>
            {consoleText}
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >_</motion.span>
          </pre>
        </motion.div>
      </div>

      {/* Bottom control bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(13, 17, 23, 0.9) 0%, #0D1117 100%)',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(125, 249, 255, 0.3)',
        zIndex: 2
      }}>
        {/* System readout */}
        <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)' }}>
          <div>SYS: V0.1.0</div>
          <div>ENV: BROWSER</div>
        </div>

        {/* Control buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgba(125, 249, 255, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(125, 249, 255, 0.1)',
              border: '1px solid rgba(125, 249, 255, 0.4)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '10px',
              color: '#7DF9FF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#7DF9FF',
              boxShadow: '0 0 4px #7DF9FF'
            }} />
            SCAN
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgba(218, 47, 183, 0.8)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(218, 47, 183, 0.1)',
              border: '1px solid rgba(218, 47, 183, 0.4)',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '10px',
              color: '#DA2FB7',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#DA2FB7',
              boxShadow: '0 0 4px #DA2FB7'
            }} />
            CONNECT
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup