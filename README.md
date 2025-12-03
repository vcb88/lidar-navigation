# 3D Lidar Navigation Simulator

A web-based 3D simulator demonstrating autonomous robot navigation in unknown environments using Lidar. The robot explores a grid-based map, builds an internal representation of the world ("Fog of War"), and dynamically plans paths to a target destination.

![Simulator Preview](https://via.placeholder.com/800x400?text=3D+Lidar+Simulator+Preview)

## ✨ Key Features

*   **Unknown Environment (Fog of War):** The robot starts with no knowledge of the map. It only "sees" what its Lidar sensor detects.
*   **Lidar Simulation:** Implements 2D Raycasting to simulate a 360° laser scanner that detects walls within a specific radius.
*   **Dynamic Pathfinding:** Uses the **A* (A-Star)** algorithm to calculate the optimal path based on the *currently known* map. If a new obstacle blocks the path, the robot instantly recalculates.
*   **3D Visualization:** Built with **React Three Fiber (R3F)**.
    *   **Blue Cylinder:** The Robot.
    *   **Red Lines:** Real-time Lidar rays.
    *   **Green Line:** Calculated path to target.
    *   **Grey Blocks:** Discovered walls.
    *   **Dark Blocks:** Unexplored areas.
*   **Level System:** Maps are defined as simple 2D ASCII arrays, making it easy to add new levels.

## 🛠 Tech Stack

*   **Core:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **3D Engine:** [Three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Containerization:** Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

*   Node.js (v22+)

### Running Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running with Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

## 🎮 How to Use

1.  **Start Navigation:** Click the blue **"Start Navigation"** button. The robot will begin scanning and moving.
2.  **Pause:** Click **"Pause"** to freeze the simulation and inspect the state.
3.  **Next Level:** Click **"Next Level"** to load a different map layout from `src/data/maps.ts`.
4.  **Controls:** Use your mouse to rotate (Left Click + Drag) and zoom (Scroll) the 3D view.

## 🗺 Customizing Maps

You can add new levels by editing `src/data/maps.ts`. Maps are defined using ASCII characters:

```typescript
`
####################
#S.................#  <-- S: Start Position
#...####.....####..#  <-- #: Wall
#...#...E....#.....#  <-- E: End Target
#..................#  <-- .: Empty Space
####################
`
```

## 📂 Project Structure

```
src/
├── components/
│   └── World3D.tsx    # R3F scene (Robot, Map, Rays)
├── data/
│   └── maps.ts        # ASCII map definitions
├── utils/
│   ├── lidar.ts       # Raycasting algorithm
│   └── pathfinding.ts # A* (A-Star) algorithm
├── App.tsx            # Main game loop & state management
└── types.ts           # TypeScript interfaces
```

## 📄 License

MIT License.