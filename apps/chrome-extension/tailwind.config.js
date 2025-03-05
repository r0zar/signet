/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html}"],
  darkMode: "class",
  // Removed prefix to make Tailwind classes work without prefixing
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover, var(--card)))",
          foreground: "hsl(var(--popover-foreground, var(--card-foreground)))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        
        // Legacy colors (keeping for backwards compatibility)
        "primary-legacy": {
          DEFAULT: "#c1121f",
          dark: "#a8101b",
          light: "#ff4d6d"
        },
        "secondary-legacy": "#8d99ae",
        "accent-legacy": {
          DEFAULT: "#F76808",
          light: "#FF8A3D"
        },
        "background-legacy": {
          dark: "#000000",
          light: "#FFFFFF"
        },
        "text-legacy": {
          dark: "#F2F5F9",
          light: "#1A202C"
        },
        gray: {
          dark: "#2C3E50",
          light: "#E2E8F0"
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif']
      },
      boxShadow: {
        charisma: '0 8px 32px rgba(0, 0, 0, 0.2)',
        glow: '0 4px 14px rgba(193, 18, 31, 0.2)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        shimmer: {
          "0%": { transform: "translateX(var(--shimmer-from, -100%))" },
          "100%": { transform: "translateX(var(--shimmer-to, 100%))" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        'gradient-charisma': 'linear-gradient(90deg, #c1121f 0%, #ff4d6d 100%)',
        'gradient-charisma-hover': 'linear-gradient(90deg, #a8101b 0%, #e64361 100%)',
        'gradient-card': 'linear-gradient(180deg, rgba(17, 17, 27, 0.05) 0%, rgba(17, 17, 27, 0.2) 100%)',
      },
    }
  }
}
