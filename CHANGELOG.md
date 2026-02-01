# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-02-01

### Security
- **Server-Side Validation**: Implemented strict server-side score verification in `scoreController.js`. The server now recalculates scores based on the grid state rather than trusting client input.
- **Anti-Cheat**: Added logic to reject submissions with invalid characters or incorrect answers.
- **Input Sanitization**: Enhanced algorithm input handling to strip non-alphabetic characters.

### Added
- **Fallback Algorithm**: `crosswordGenerator.js` now includes a fallback mechanism to place disconnected words in empty grid spots, ensuring higher word usage rates.
- **Multiplayer Sync**: Added real-time state synchronization logic using Socket.IO (Peer-to-Peer state transfer via server relay).
- **Error Handling**: Introduced `ErrorBoundary` component for React to prevent white-screen crashes.
- **Deployment Config**: Added `netlify.toml` and `_redirects` for seamless Netlify deployment.
- **Health Check**: Added `/health` endpoint in server for uptime monitoring.

### Changed
- **Architecture**: Separated frontend (Netlify) and backend (Heroku) deployment configurations.
- **Resilience**: Wrapped main App component with ErrorBoundary.
- **Linting**: Fixed unused variable warnings in `CrosswordPlayer.jsx`.

### Testing
- Added `audit_algo.js` for algorithm edge cases.
- Added `stress_test.js` for stability verification (100x run pass).
- Added `test_score_logic.js` for security validation.
