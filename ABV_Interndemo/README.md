# 3D Solar System Simulation (Frontend Assignment)

## Overview
This project is a mobile-responsive, interactive 3D simulation of the solar system built with [Three.js](https://threejs.org/). It features:
- The Sun and all 8 planets orbiting in 3D
- Realistic lighting and orbital animation
- Speed controls for each planet
- Pause/Resume animation
- Background stars
- Labels on hover
- Camera zoom on planet click

## How to Run
1. **Download or clone this repository.**
2. **Open `index.html` in any modern web browser.**
   - No build step or server required.
   - Works on Chrome, Firefox, Edge, Safari, and most mobile browsers.

## Features
- **3D Scene:** Sun at the center, 8 planets with accurate relative distances and sizes.
- **Orbits:** Each planet orbits the Sun at a default speed, which can be adjusted in real-time.
- **Speed Control:** Use the sliders in the control panel to change the orbital speed of any planet instantly.
- **Pause/Resume:** Pause or resume the entire animation with a single button.
- **Background Stars:** Adds depth and realism to the scene.
- **Labels:** Hover over a planet to see its name.
- **Camera Zoom:** Click a planet to zoom in on it.
- **Responsive UI:** Control panel adapts to mobile screens.

## Code Structure
- `index.html` — Main HTML file, includes Three.js via CDN, UI controls, and links to `main.js`.
- `main.js` — All 3D logic, animation, and UI interaction. No frameworks, just plain JavaScript and Three.js.
- `README.md` — This file.

## Code Walkthrough
- **Scene Setup:**
  - Initializes Three.js scene, camera, and renderer.
  - Adds lighting (point light for Sun, ambient for scene).
- **Sun & Planets:**
  - Sun is a glowing sphere at the center.
  - Each planet is a colored sphere, with distance, size, and orbital period based on real solar system data (scaled for visualization).
- **Animation:**
  - Uses `requestAnimationFrame` and `THREE.Clock` for smooth, time-based animation.
  - Each planet's position is updated per frame based on its speed and period.
- **Controls:**
  - Sliders update each planet's speed multiplier in real time.
  - Pause/Resume button toggles animation.
- **Extras:**
  - Stars are rendered as random points in the background.
  - Raycasting is used for hover labels and camera zoom on click.

## Demo Video
See the attached video for a walkthrough and demonstration of all features.

---
**Assignment by [Your Name]** 