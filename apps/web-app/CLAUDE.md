# CLAUDE.md - Signet Web App Development Guide

## Commands
- Development: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Preview: `pnpm preview`
- Format check: `pnpm format`
- Format fix: `pnpm format:fix`

## Code Style
- **Formatting**: 2 space indentation, single quotes, semicolons
- **Imports**: Group by type (React, libraries, components, utils)
- **Types**: Use TypeScript strictly, prefer explicit types over inference
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Components**: Functional components with explicit return types
- **Error Handling**: Use try/catch for async operations, proper UI feedback
- **File Structure**: Keep related components in same directory, kebab-case filenames

## Project Structure
- React + Vite + TypeScript + TailwindCSS
- React Router for page navigation
- Clerk for authentication
- Extension connectivity features via global SignetAPI