# Game Status State Diagram
This document illustrates the flow between the different game statuses in Pixel Vengeance.
```mermaid
stateDiagram-v2
    [*] --> MODE_SELECTION: Application Start
    MODE_SELECTION --> PLAYING: User selects "1 PLAYER START" or "2 PLAYER START"
    PLAYING --> PAUSED: User presses 'P' key
    PAUSED --> PLAYING: User presses 'P' key
    PLAYING --> GAME_OVER: All pellets are eaten OR a player loses all lives
    GAME_OVER --> MODE_SELECTION: User presses 'R' key to restart