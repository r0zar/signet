import { useRef, useCallback, useEffect } from 'react'
import { useSpring, useTransform, useMotionValue, MotionValue } from 'framer-motion'

interface Use3DEffectResult {
  panelRef: React.RefObject<HTMLDivElement>
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  z: MotionValue<number>
  isHovering: boolean
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  handleMouseMove?: (e: React.MouseEvent) => void
}

interface Use3DEffectConfig {
  sensitivityFactor?: number
  springConfig?: {
    damping: number
    stiffness: number
  }
  zTranslation?: number
}

/**
 * Hook to create 3D tilt effects for panels
 * Optimized version that prevents excessive re-renders
 */
export function use3DEffect(config: Use3DEffectConfig = {}): Use3DEffectResult {
  const {
    sensitivityFactor = 0.5,  // Increased sensitivity
    springConfig = { damping: 15, stiffness: 250 }, // Bouncier rotation
    zTranslation = 50  // More dramatic z-translation
  } = config

  const panelRef = useRef<HTMLDivElement>(null)

  // Motion values for 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Use a motion value for hover state instead of React state
  const hoverState = useMotionValue(0)

  // Spring physics for smooth animation
  const rotateX = useSpring(
    useTransform(y, [-100, 100], [10, -10]),
    springConfig
  )

  const rotateY = useSpring(
    useTransform(x, [-100, 100], [-10, 10]),
    springConfig
  )

  // Create spring animation for z - using the motion value instead of React state
  const z = useSpring(
    useTransform(hoverState, [0, 1], [0, zTranslation]),
    {
      // Sleek, controlled settings for sci-fi feel
      damping: 22,       // Higher damping for controlled movement
      stiffness: 200,    // Stiffer for faster, more precise movement
      mass: 0.8,         // Lower mass for quicker response
      restDelta: 0.01    // Larger threshold for quicker settling
    }
  )

  // Get current hover state for components that need to know
  // This won't re-render when hover changes
  const isHovering = hoverState.get() === 1

  // Update mouse position using motion values
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      const panelCenterX = rect.left + rect.width / 2
      const panelCenterY = rect.top + rect.height / 2

      // Calculate position relative to center of panel
      const relativeX = e.clientX - panelCenterX
      const relativeY = e.clientY - panelCenterY

      // Apply tilt effect regardless of hover state
      x.set(relativeX * sensitivityFactor)
      y.set(relativeY * sensitivityFactor)
    }
  }, [sensitivityFactor, x, y])

  // Component-specific mouse move handler (optional)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect()
      const panelCenterX = rect.left + rect.width / 2
      const panelCenterY = rect.top + rect.height / 2

      // Calculate position relative to center of panel
      const relativeX = e.clientX - panelCenterX
      const relativeY = e.clientY - panelCenterY

      // Apply tilt effect
      x.set(relativeX * sensitivityFactor)
      y.set(relativeY * sensitivityFactor)
    }
  }, [sensitivityFactor, x, y])

  // Smooth transition when mouse leaves - using motion value
  const handleMouseLeave = useCallback(() => {
    hoverState.set(0)
  }, [hoverState])

  // Set hover state when mouse enters - using motion value
  const handleMouseEnter = useCallback(() => {
    hoverState.set(1)
  }, [hoverState])

  // Set up global mouse move listener
  useEffect(() => {
    window.addEventListener('mousemove', handleGlobalMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [handleGlobalMouseMove])

  return {
    panelRef,
    rotateX,
    rotateY,
    z,
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove
  }
}