# CLAUDE.md - Development Guide

## Commands
- Dev: `pnpm dev` (Firefox: `pnpm dev:firefox`)
- Build: `pnpm build` (Firefox: `pnpm build:firefox`)
- Package: `pnpm package` (Firefox: `pnpm package:firefox`)
- Lint: `pnpm lint`
- Format: `pnpm format` (Fix web-app: `pnpm format:fix`)
- Debug: `pnpm debug` (Firefox: `pnpm debug:firefox`)

## Code Style
- **Formatting**: 2 spaces, single quotes, no semicolons in root project
- **Imports**: Use path aliases (`~` for src directory)
- **Types**: Strongly typed, use `type` imports
- **Naming**: PascalCase for components, camelCase for functions, kebab-case for files
- **Components**: Favor functional components with hooks
- **Error Handling**: Use React error boundaries, async/await pattern

## Project Structure
- Monorepo (Turborepo) with pnpm workspaces
- Chrome extension (Plasmo framework)
- Web app (Vite + React)