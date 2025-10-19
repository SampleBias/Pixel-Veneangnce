# Pixel Vengeance

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SampleBias/Pixel-Veneangnce))

A 2-player retro arcade game combining classic Pac-Man gameplay with competitive shooting mechanics, ricocheting projectiles, and ghost-blasting action.

Pixel Vengeance is a high-octane, 2-player retro arcade game that reimagines the classic Pac-Man experience with a competitive combat twist. Set in a neon-drenched, pixelated maze, two players control their own Pac-Man avatars, racing to collect pellets while dodging iconic ghosts. The core innovation lies in the combat system: each player is equipped with a projectile weapon. Players can shoot at ghosts to score points and at each other to temporarily stun their opponent, creating a dynamic blend of strategy and action.

## Key Features

-   **2-Player Competitive Gameplay**: Control separate Pac-Man characters and compete for the high score.
-   **Classic Arcade Action**: Traditional maze layout with dots, power pellets, and patrolling ghosts.
-   **Modern Combat Mechanics**: Equip your Pac-Man with a gun to shoot projectiles.
-   **Ricochet Corner Shots**: Skillfully bounce projectiles off maze corners to hit your targets.
-   **Player vs. Player**: Shoot your opponent to temporarily stun them and gain an advantage.
-   **Ghost Blasting**: Take down ghosts with your weapon, whether they are vulnerable or not.
-   **Retro Aesthetics**: A pure retro visual style featuring pixel art, glitch effects, a vibrant neon color palette, and an 8-bit soundtrack feel, all rendered on an HTML5 Canvas.

## Technology Stack

-   **Frontend**: React, TypeScript, Vite
-   **Styling**: Tailwind CSS, shadcn/ui
-   **State Management**: Zustand
-   **Animation**: Framer Motion
-   **Deployment**: Cloudflare Workers

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/pixel_vengeance.git
    cd pixel_vengeance
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

## Development

To run the application in a local development environment, use the following command. This will start a Vite development server with hot-reloading.

```sh
bun dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

-   `bun dev`: Starts the development server.
-   `bun build`: Creates a production-ready build of the application.
-   `bun lint`: Lints the codebase using ESLint.
-   `bun preview`: Serves the production build locally for previewing.
-   `bun deploy`: Deploys the application to Cloudflare Workers.

## Deployment

This project is configured for seamless deployment to Cloudflare Pages/Workers.

To deploy your application, simply run the deploy script:

```sh
bun run deploy
```

This command will build the project and deploy it using the Wrangler CLI.

Alternatively, you can deploy directly from your GitHub repository by clicking the button below.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/SampleBias/Pixel-Veneangnce))

## License

This project is licensed under the MIT License.