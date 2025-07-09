// --- Solar System Simulation with Three.js ---

// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111122);
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 60, 160);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Lighting
const sunLight = new THREE.PointLight(0xffffff, 2.2, 0, 2);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x222233, 0.7));

// Sun
const sunGeometry = new THREE.SphereGeometry(8, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffe066 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.name = 'Sun';
scene.add(sun);

// Planet Data (distance, size, color, orbital period in seconds, label)
const planetData = [
  { name: 'Mercury', distance: 16, size: 1.2, color: 0xb1b1b1, period: 8 },
  { name: 'Venus',   distance: 22, size: 2.2, color: 0xeedcb3, period: 20 },
  { name: 'Earth',   distance: 30, size: 2.4, color: 0x3399ff, period: 32 },
  { name: 'Mars',    distance: 38, size: 1.8, color: 0xff5533, period: 60 },
  { name: 'Jupiter', distance: 50, size: 5.5, color: 0xf4e2d8, period: 180 },
  { name: 'Saturn',  distance: 62, size: 4.7, color: 0xf7e7b6, period: 400 },
  { name: 'Uranus',  distance: 74, size: 3.2, color: 0x7de2fc, period: 800 },
  { name: 'Neptune', distance: 86, size: 3.1, color: 0x4062bb, period: 1600 },
];

// Planets array
const planets = [];
const planetSpeeds = {};
const planetMeshes = {};

// Create Planets
planetData.forEach((p, i) => {
  const geometry = new THREE.SphereGeometry(p.size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: p.color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(p.distance, 0, 0);
  mesh.name = p.name;
  scene.add(mesh);
  planets.push({ ...p, mesh, angle: Math.random() * Math.PI * 2 });
  planetSpeeds[p.name] = 1; // Default speed multiplier
  planetMeshes[p.name] = mesh;
});

// Add background stars
function addStars(numStars = 400) {
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 1200;
    const y = (Math.random() - 0.5) * 1200;
    const z = (Math.random() - 0.5) * 1200;
    starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.1 });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}
addStars();

// Orbit lines (optional, for visualizing orbits)
planetData.forEach((p) => {
  const curve = new THREE.EllipseCurve(
    0, 0, p.distance, p.distance, 0, 2 * Math.PI, false, 0
  );
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points.map(pt => new THREE.Vector3(pt.x, 0, pt.y)));
  const material = new THREE.LineBasicMaterial({ color: 0x444455 });
  const ellipse = new THREE.Line(geometry, material);
  scene.add(ellipse);
});

// --- UI Controls ---
const planetNames = planetData.map(p => p.name);
planetNames.forEach(name => {
  const slider = document.getElementById(name.toLowerCase() + 'Speed');
  if (slider) {
    slider.addEventListener('input', (e) => {
      planetSpeeds[name] = parseFloat(e.target.value);
    });
  }
});

// Pause/Resume
let paused = false;
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
});

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  if (!paused) {
    const delta = clock.getDelta();
    planets.forEach((p) => {
      // Calculate angular speed (radians/sec)
      const baseSpeed = (2 * Math.PI) / p.period;
      p.angle += baseSpeed * planetSpeeds[p.name] * delta;
      // Update position
      p.mesh.position.x = Math.cos(p.angle) * p.distance;
      p.mesh.position.z = Math.sin(p.angle) * p.distance;
      // Self-rotation
      p.mesh.rotation.y += 0.02;
    });
    // Sun slow rotation
    sun.rotation.y += 0.004;
  }
  renderer.render(scene, camera);
}
animate();

// --- Responsive Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- (Bonus) Labels on Hover ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let labelDiv = null;

function showLabel(name, x, y) {
  if (!labelDiv) {
    labelDiv = document.createElement('div');
    labelDiv.style.position = 'fixed';
    labelDiv.style.background = 'rgba(30,30,40,0.95)';
    labelDiv.style.color = '#fff';
    labelDiv.style.padding = '4px 10px';
    labelDiv.style.borderRadius = '6px';
    labelDiv.style.pointerEvents = 'none';
    labelDiv.style.fontSize = '1em';
    labelDiv.style.zIndex = 100;
    document.body.appendChild(labelDiv);
  }
  labelDiv.textContent = name;
  labelDiv.style.left = x + 12 + 'px';
  labelDiv.style.top = y + 8 + 'px';
  labelDiv.style.display = 'block';
}
function hideLabel() {
  if (labelDiv) labelDiv.style.display = 'none';
}

renderer.domElement.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
  if (intersects.length > 0) {
    showLabel(intersects[0].object.name, event.clientX, event.clientY);
  } else {
    hideLabel();
  }
});

renderer.domElement.addEventListener('mouseleave', hideLabel);

// --- (Bonus) Camera Zoom on Click ---
renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));
  if (intersects.length > 0) {
    const planet = intersects[0].object;
    // Animate camera to planet
    const target = planet.position.clone();
    const camStart = camera.position.clone();
    const camEnd = target.clone().add(new THREE.Vector3(0, 8, 16));
    let t = 0;
    function zoomAnim() {
      t += 0.04;
      camera.position.lerpVectors(camStart, camEnd, Math.min(t, 1));
      camera.lookAt(target);
      if (t < 1) requestAnimationFrame(zoomAnim);
    }
    zoomAnim();
  }
});

// --- (Bonus) Dark/Light Toggle ---
// (Optional: Add a button in HTML and implement theme switching if desired) 