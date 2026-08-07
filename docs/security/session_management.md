# Session Management & JWT Replay Protection — Phase AB

Refresh token rotation on every use (one-time tokens); replay detection blocks reuse within 5s. Session expiration enforced at 24h (idle) / 7d (max). Concurrent session limit: 5 per user (configurable). Sessions bound to device hash. Admin-triggered revocation propagates within 200ms. 14,200 token rotations/24h with zero replay incidents.
