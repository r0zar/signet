# Changelog

All notable changes to the Signet Extension web app will be documented in this file.

## [Unreleased]

### Fixed
- TypeScript errors in the build process related to null safety checks
- Type definition conflicts in multiple files
- Added null checks for DOM elements and SVG manipulations in `main.tsx`
- Added null checks for window API methods in `index.tsx`

### Added
- Missing dependencies: `clsx` and `tailwind-merge`
- Consolidated type definitions in `vite-env.d.ts`
- Created consistent interfaces for `SignetAPI` and `SignatureResult`

## [0.1.0] - 2025-03-04

### Added
- Initial project setup with Vite + React
- Basic landing page with hero section
- SignetDemo components for interaction showcase
- Developer documentation section