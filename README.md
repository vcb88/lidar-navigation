# Lidar Navigation Simulator

A web-based simulator for robot navigation using Lidar (Light Detection and Ranging) sensors. This project simulates a robot in a 2D environment, generating maps, discovering obstacles via Lidar, and pathfinding to a target destination.

## 🚧 Project Status: Work In Progress

**Note:** This codebase currently appears to be in a refactoring state.
*   **Missing Logic:** `src/robotlogic.ts` is empty, meaning pathfinding and Lidar simulation logic are missing.
*   **Directory Structure:** Imports in `App.tsx` and `main.tsx` reference a `components` folder that does not exist in the root `src` directory. Files need to be reorganized.

## 🛠 Tech Stack

*   **Framework:** [React](https://reactjs.org/) (v18)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Containerization:** Docker & Docker Compose

## ✨ Features (Intended)

*   **Random Map Generation:** Automatically generates grid-based maps with walls and obstacles.
*   **Lidar Simulation:** Simulates a 360° Lidar sensor that "discovers" obstacles within a specific radius.
*   **Fog of War:** The map starts unexplored; the robot builds an internal map as it moves.
*   **Pathfinding:** Calculates optimal paths to a target point using the robot's current knowledge of the map (likely A* or similar algorithm).
*   **Visualization:** Real-time rendering of the robot, rays, known obstacles, and planned path.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18+)
*   Docker (optional, for containerized run)

### Running with Docker (Recommended)

The easiest way to run the development environment.

```bash
# Build and start the container
docker compose -f docker-compose.dev.yml up --build

# To run in background
docker compose -f docker-compose.dev.yml up -d

# To stop
docker compose -f docker-compose.dev.yml down
```

The application should be available at `http://localhost:5173` (standard Vite port) or the port defined in docker-compose.

### Running Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    # Note: package.json currently lists 'react-scripts start' which is incompatible with Vite.
    # You might need to run 'npx vite' directly or fix package.json.
    ```

## 📂 Project Structure

```
src/
├── main.tsx           # Entry point
├── app.tsx            # Main Application component
├── mapGenerator.ts    # Logic for creating random maps
├── robotNavigation.tsx # Main simulation controller component
├── robotLogic.ts      # (Empty) Core logic for Lidar and Pathfinding
├── map.tsx            # Map rendering component
└── types.ts           # TypeScript interfaces
```

## ⚠️ Known Issues

1.  **Empty `robotlogic.ts`:** The core simulation logic is missing. The app will likely crash or do nothing.
2.  **Broken Imports:** `App.tsx` imports `RobotNavigation` from `./components/RobotNavigation`, but the file is in `src/robotNavigation.tsx`.
3.  **Scripts Mismatch:** `package.json` defines scripts for Create React App (`react-scripts`), but the project uses `vite.config.ts`.

## 📄 License

Private / Unlicensed.
