# Signet Design System Style Guide

This comprehensive style guide outlines the design language, components, and principles of the Signet system. Use this guide to create consistent, visually cohesive applications that align with Signet's cyberpunk-inspired, futuristic aesthetic.

## Table of Contents
1. [Brand Identity](#brand-identity)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [UI Components](#ui-components)
5. [Animations and Interactions](#animations-and-interactions)
6. [Iconography](#iconography)
7. [Spacing and Layout](#spacing-and-layout)
8. [Implementation Guidelines](#implementation-guidelines)

---

## Brand Identity

### Core Values
- **Innovation**: Forward-thinking, embracing new possibilities
- **Security**: Trustworthy, reliable, protected
- **Precision**: Technical excellence, attention to detail
- **Futurism**: Cyberpunk-inspired, sci-fi aesthetics

### Personality
- Sophisticated yet approachable
- Technical but not alienating
- Advanced without being overwhelming
- Futuristic but functional

### Signet's Voice
- **Clear**: Simple explanations for complex concepts
- **Concise**: Brief, to-the-point messaging
- **Technical**: Embraces technical terminology when appropriate
- **Confident**: Authoritative without being arrogant

---

## Color System

### Primary Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Space Black | `#010409` | `rgb(1, 4, 9)` | Primary background |
| Space Dark | `#0d1117` | `rgb(13, 17, 23)` | Secondary background, panels |
| Space Void | `#161b22` | `rgb(22, 27, 34)` | Tertiary background, cards |
| Cyber Blue | `#7df9ff` | `rgb(125, 249, 255)` | Primary accent, highlights, glows |

### Secondary Palette

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Neon Green | `#50fa7b` | `rgb(80, 250, 123)` | Success, approval, positive actions |
| Neon Pink | `#ff79c6` | `rgb(255, 121, 198)` | Highlights, secondary accents |
| Neon Red | `#ff5555` | `rgb(255, 85, 85)` | Errors, warnings, rejection |
| Neon Purple | `#bd93f9` | `rgb(189, 147, 249)` | Special features, alternate accent |
| Neon Orange | `#ffb86c` | `rgb(255, 184, 108)` | Warnings, attention, notifications |

### Neutrals

| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| White | `#f8f8f2` | `rgb(248, 248, 242)` | Text, icons on dark backgrounds |
| Steel | `#6272a4` | `rgb(98, 114, 164)` | Secondary text, disabled states |
| Dark Steel | `#44475a` | `rgb(68, 71, 90)` | Borders, dividers, inactive elements |

### Color Usage Guidelines

- Use color to establish hierarchy and guide users
- Employ the cyber blue accent sparingly to highlight important elements
- Pair dark backgrounds with bright, neon accents for the cyberpunk aesthetic
- Use color transparency to create depth (common values: 11%, 22%, 44%, 66%, 88%)
- Implement glowing effects on interactive elements using the appropriate neon colors

### Example Gradients

```css
/* Primary background gradient */
background: linear-gradient(180deg, #010409 0%, #0d1117 100%);

/* Panel background gradient */
background: linear-gradient(160deg, #0d1117 0%, #161b22 100%);

/* Cyber glow gradient */
box-shadow: 0 0 15px rgba(125, 249, 255, 0.4), 0 0 30px rgba(125, 249, 255, 0.2);
```

---

## Typography

### Font Families

- **Primary Font**: Inter (UI text, body content)
- **Monospace Font**: JetBrains Mono (code, technical data, timestamps)
- **System Fallbacks**: -apple-system, system-ui, sans-serif

### Font Weights

- **Regular**: 400 (body text, general content)
- **Medium**: 500 (section headers, emphasized text)
- **Semi-Bold**: 600 (buttons, interactive elements)
- **Bold**: 700 (primary headers, important information)

### Type Scale

| Size Name | Size (px) | Line Height | Usage |
|-----------|-----------|-------------|-------|
| Micro | 10px | 14px | Legal text, footnotes, timestamps |
| Small | 12px | 16px | Secondary information, details |
| Body | 14px | 20px | Main body text, descriptions |
| UI | 16px | 24px | Buttons, inputs, navigation |
| Title | 18px | 28px | Section headings, card titles |
| Heading | 24px | 32px | Major section headings |
| Display | 32px | 40px | Page titles, main headings |

### Typography Examples

```css
/* Main heading */
font-family: 'Inter', -apple-system, system-ui, sans-serif;
font-weight: 700;
font-size: 24px;
letter-spacing: -0.02em;
color: #f8f8f2;

/* Body text */
font-family: 'Inter', -apple-system, system-ui, sans-serif;
font-weight: 400;
font-size: 14px;
line-height: 20px;
color: #f8f8f2;

/* Technical data */
font-family: 'JetBrains Mono', monospace;
font-weight: 500;
font-size: 12px;
letter-spacing: 0.02em;
color: #7df9ff;
```

---

## UI Components

### Buttons

#### Primary Button
- Background: Cyber Blue (#7df9ff11 with border #7df9ff66)
- Text: Cyber Blue (#7df9ff)
- Font: Inter Semi-Bold, 12-14px, uppercase
- Hover: Scale 1.05, shadow: 0 0 8px rgba(125, 249, 255, 0.4)
- Active: Scale 0.95
- Border-radius: 4px
- Border: 1px solid rgba(125, 249, 255, 0.4)

#### Secondary Button
- Background: Transparent with border #44475a66
- Text: White (#f8f8f2)
- Font: Inter Medium, 12-14px, uppercase
- Hover: Scale 1.05, border color change
- Active: Scale 0.95
- Border-radius: 4px

#### Action Button Variants
- Approve/Confirm: Neon Green (#50fa7b)
- Reject/Cancel: Neon Red (#ff5555)
- Warning/Caution: Neon Orange (#ffb86c)
- Special Action: Neon Purple (#bd93f9)

### Cards and Panels

#### Standard Panel
- Background: Linear gradient from Space Dark to Space Void
- Border: 1px solid rgba(125, 249, 255, 0.3)
- Corner Accents: Small glowing highlights in corners
- Box Shadow: 0 0 15px rgba(0, 0, 0, 0.7), 0 0 5px rgba(125, 249, 255, 0.13)
- Border-radius: 6px
- Padding: 16px

#### Notification Panel
- Incorporates a header with status indicator
- Contains message content and actionable buttons
- Uses border glow to indicate importance
- Implements 3D tilt effect on hover

### Form Elements

#### Input Field
- Background: Space Void (#161b22)
- Border: 1px solid #44475a
- Text: White (#f8f8f2)
- Focus: Border color Cyber Blue (#7df9ff66)
- Placeholder: Steel (#6272a4)
- Border-radius: 4px
- Padding: 8px 12px

#### Toggle/Switch
- Off State: Dark Steel (#44475a)
- On State: Cyber Blue (#7df9ff)
- Knob: White (#f8f8f2)
- Transition: Smooth 0.2s with slight glow on active

### Misc UI Elements

#### Dividers
- Color: Dark Steel (#44475a66)
- Optional gradient fade: transparent to Dark Steel to transparent
- Optional animated shimmer effect for dynamic sections

#### Progress Indicators
- Track: Dark Steel (#44475a)
- Fill: Cyber Blue gradient with animated glow
- Pulsing animation for indeterminate state

---

## Animations and Interactions

### Principles
- **Purpose**: Animations should serve a functional purpose
- **Performance**: Optimize for performance, use GPU-accelerated properties
- **Subtlety**: Effects should enhance, not distract
- **Sci-Fi Feel**: Lean into technological, cyberpunk aesthetic

### Duration Guidelines
- **Ultra Fast**: 100ms (state changes)
- **Fast**: 200-300ms (simple transitions)
- **Medium**: 300-500ms (emphasis transitions)
- **Slow**: 500-800ms (feature presentations)

### Standard Transitions

#### Hover Effects
```css
transition: all 0.2s cubic-bezier(0.36, 0.66, 0.04, 1);
transform: scale(1.05);
box-shadow: 0 0 15px rgba(125, 249, 255, 0.4);
```

#### Entry Animations
```css
/* For notifications, modals, panels */
@keyframes slideInUp {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
animation: slideInUp 0.4s cubic-bezier(0.36, 0.66, 0.04, 1) forwards;
```

#### Exit Animations
```css
/* Sci-fi exit effect */
@keyframes fadeOutBlur {
  to {
    opacity: 0;
    filter: blur(8px);
    transform: scale(0.9) rotateX(15deg);
  }
}
animation: fadeOutBlur 0.4s cubic-bezier(0.36, 0.66, 0.04, 1) forwards;
```

### Special Effects

#### 3D Effect
- Apply subtle 3D rotation based on mouse position
- Add perspective and transform-style: preserve-3d
- Use spring physics for natural movement

```javascript
// Example spring configuration
const springConfig = {
  stiffness: 250,     // Higher for faster response
  damping: 15,        // Higher for less oscillation
  mass: 0.8,          // Lower for quicker movement
};
```

#### Glow Pulse
```css
@keyframes glowPulse {
  0% { box-shadow: 0 0 5px rgba(125, 249, 255, 0.4); }
  50% { box-shadow: 0 0 15px rgba(125, 249, 255, 0.7); }
  100% { box-shadow: 0 0 5px rgba(125, 249, 255, 0.4); }
}
animation: glowPulse 2s infinite ease-in-out;
```

#### Scan Line
```css
@keyframes scanLine {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.scan-line {
  position: absolute;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(125, 249, 255, 0.7), transparent);
  animation: scanLine 3s infinite linear;
  pointer-events: none;
}
```

---

## Iconography

### Icon Style
- Line weight: 1.5-2px
- Corner radius: 1px
- Style: Simple, geometric, techy
- Sizing: 16px, 20px, 24px (standard)
- Color: Typically white (#f8f8f2) or Cyber Blue (#7df9ff)

### System Icons
Provide a consistent set of icons for common actions:
- Navigation: arrows, hamburger menu, close/x
- Actions: add, edit, delete, save
- Feedback: success, warning, error, info
- Media: play, pause, volume, fullscreen
- Objects: document, user, chart, settings

### Icon Guidelines
- Use icons consistently throughout the application
- Pair with text labels for clarity when appropriate
- Maintain consistent padding within the icon bounding box
- Consider slight glow effects for important interactive icons

---

## Spacing and Layout

### Spacing Scale
A consistent spacing scale based on 4px increments:

| Token | Size (px) | Usage |
|-------|-----------|-------|
| space-1 | 4px | Minimum spacing, tight grouping |
| space-2 | 8px | Default spacing between related items |
| space-3 | 16px | Standard spacing between components |
| space-4 | 24px | Spacing between sections |
| space-5 | 32px | Large spacing, page sections |
| space-6 | 64px | Major page divisions |

### Layout Guidelines
- Use a 12-column grid system for responsive layouts
- Maintain consistent margins (typically 16px or 24px)
- Group related information visually with spacing
- Use negative space strategically to create focus
- Implement hierarchy through size, position, and color

### Z-Index Scale

| Layer | Z-Index | Usage |
|-------|---------|-------|
| Base | 0 | Default content |
| Raised | 10 | Slightly elevated components |
| Navigation | 100 | Sticky headers, persistent navigation |
| Overlay | 1000 | Modals, overlays |
| Popover | 2000 | Tooltips, popovers |
| Notification | 9999 | Notifications, alerts |

---

## Implementation Guidelines

### CSS Variables

```css
:root {
  /* Colors */
  --space-black: #010409;
  --space-dark: #0d1117;
  --space-void: #161b22;
  --cyber-blue: #7df9ff;
  --neon-green: #50fa7b;
  --neon-pink: #ff79c6;
  --neon-red: #ff5555;
  --neon-purple: #bd93f9;
  --neon-orange: #ffb86c;
  --white: #f8f8f2;
  --steel: #6272a4;
  --dark-steel: #44475a;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-micro: 10px;
  --font-small: 12px;
  --font-body: 14px;
  --font-ui: 16px;
  --font-title: 18px;
  --font-heading: 24px;
  --font-display: 32px;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 64px;
  
  /* Borders */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 6px;
  
  /* Animation */
  --duration-fast: 0.2s;
  --duration-medium: 0.4s;
  --duration-slow: 0.8s;
  --ease-standard: cubic-bezier(0.36, 0.66, 0.04, 1);
  --ease-spring: cubic-bezier(0.43, 0.13, 0.23, 0.96);
}
```

### Component Integration with React

```jsx
// Example button component with Signet styling
const SignetButton = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false 
}) => {
  const getVariantStyles = () => {
    switch(variant) {
      case 'success':
        return { color: 'var(--neon-green)', borderColor: 'rgba(80, 250, 123, 0.66)', background: 'rgba(80, 250, 123, 0.11)' };
      case 'danger':
        return { color: 'var(--neon-red)', borderColor: 'rgba(255, 85, 85, 0.66)', background: 'rgba(255, 85, 85, 0.11)' };
      case 'warning':
        return { color: 'var(--neon-orange)', borderColor: 'rgba(255, 184, 108, 0.66)', background: 'rgba(255, 184, 108, 0.11)' };
      case 'primary':
      default:
        return { color: 'var(--cyber-blue)', borderColor: 'rgba(125, 249, 255, 0.66)', background: 'rgba(125, 249, 255, 0.11)' };
    }
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: `0 0 8px ${getVariantStyles().color}66` }}
      whileTap={{ scale: 0.95 }}
      disabled={disabled}
      onClick={onClick}
      style={{
        fontSize: 'var(--font-small)',
        fontWeight: 600,
        fontFamily: 'var(--font-primary)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${getVariantStyles().borderColor}`,
        background: getVariantStyles().background,
        color: getVariantStyles().color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'all var(--duration-fast) var(--ease-standard)'
      }}
    >
      {children}
    </motion.button>
  );
};
```

### Accessibility Considerations

- Maintain color contrast ratio of at least 4.5:1 for text
- Ensure interactive elements have appropriate focus states
- Provide alternative text for visual elements
- Test all components with screen readers
- Support keyboard navigation for all interactive elements
- Consider users with motion sensitivity when implementing animations (respect prefers-reduced-motion)

---

## Examples and Templates

See our [Design System Components](https://github.com/charisma/signet/design-system) repository for:
- Component examples
- Code snippets
- Animation demos
- Integration examples for React, Vue, and vanilla JS
- Utility classes and helpers

---

## Contact and Support

For questions or clarifications about Signet's design system:
- GitHub: [File an issue](https://github.com/charisma/signet/issues)
- Email: design@signet.com
- Discord: [Join our server](https://discord.gg/signet)

---

*This style guide is a living document and will evolve as Signet continues to develop.*