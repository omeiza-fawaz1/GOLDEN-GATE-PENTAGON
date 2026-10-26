const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

function previewImage(file, target) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    target.style.backgroundImage = `url(${reader.result})`;
    target.style.backgroundSize = 'cover';
    target.style.backgroundPosition = 'center';
    target.classList.add('has-image');
    const placeholder = target.querySelector('span');
    if (placeholder) placeholder.style.opacity = '0';
  });
  reader.readAsDataURL(file);
}

document.querySelectorAll('input[type="file"][data-image-target]').forEach((input) => {
  input.addEventListener('change', (event) => {
    const target = document.querySelector(`.${event.currentTarget.dataset.imageTarget}`) || event.currentTarget.closest('.photo-placeholder, .gallery-image');
    previewImage(event.currentTarget.files[0], target);
  });
});

const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('golden-gate-theme');

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  if (themeToggle) themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀' : '☾';
  if (themeToggle) themeToggle.querySelector('.theme-label').textContent = isDark ? 'Light mode' : 'Dark mode';
}

setTheme(savedTheme === 'dark' ? 'dark' : 'light');
themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('golden-gate-theme', nextTheme);
  setTheme(nextTheme);
});

document.querySelector('#parent-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  status.textContent = 'Thank you. Your request is ready to be received by the school.';
  form.reset();
});

// ---------- Chat widget ----------
const chatFab = document.querySelector('#chat-fab');
const chatWindow = document.querySelector('#chat-window');
const chatClose = document.querySelector('#chat-close');
const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('#chat-messages');

chatFab?.addEventListener('click', () => {
  chatWindow.hidden = false;
  chatFab.setAttribute('aria-expanded', 'true');
  document.querySelector('#chat-text')?.focus();
});
chatClose?.addEventListener('click', () => {
  chatWindow.hidden = true;
  chatFab.setAttribute('aria-expanded', 'false');
});
chatForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('#chat-text');
  const text = input.value.trim();
  if (!text) return;
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-user';
  userMsg.textContent = text;
  chatMessages.appendChild(userMsg);
  input.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;
  const lower = text.toLowerCase();
  let reply = 'Thank you for your question! How else can I help you?';
  let redirect = null;
  if (lower.includes('where') && (lower.includes('school') || lower.includes('located') || lower.includes('location'))) {
    reply = 'Kubwa, Abuja, Unnin Street.';
  } else if (lower.includes('offer') || lower.includes('what does') || lower.includes('what do you') || lower.includes('services') || lower.includes('have')) {
    reply = 'We allow external students to write JAMB, WAEC and NECO. We also have good quality classrooms, cleaners, and friendly teachers who are always ready to help.';
  } else if (lower.includes('teacher') || lower.includes('staff') || lower.includes('people')) {
    reply = 'Of course! Let me take you to our people page so you can meet our wonderful teachers.';
    redirect = 'people.html';
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    reply = 'Hello! Welcome to Golden Gate Pentagon College. How can I assist you today?';
  } else if (lower.includes('admission') || lower.includes('enrol') || lower.includes('register')) {
    reply = 'We are happy to help with admissions! Please fill out the contact form or visit us at Kubwa, Abuja, Unnin Street.';
  } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email')) {
    reply = 'You can reach us at hello@goldengate.edu or visit us at Kubwa, Abuja, Unnin Street.';
  }
  setTimeout(() => {
    const bot = document.createElement('div');
    bot.className = 'chat-bot';
    bot.textContent = reply;
    chatMessages.appendChild(bot);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (redirect) {
      setTimeout(() => { window.location.href = redirect; }, 1200);
    }
  }, 600);
});

// ---------- Map init ----------
const mapEl = document.querySelector('#school-map');
if (mapEl) {
  const lat = 9.1537, lng = 7.3220;
  const map = L.map('school-map').setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  const popupContent = '<div style="text-align:center"><img src="pics/ChatGPT Image Sep 12, 2026, 12_06_50 PM.png" alt="School" style="width:180px;height:110px;object-fit:cover;border-radius:8px;margin-bottom:6px"><br><strong>Golden Gate Pentagon College</strong><br><small>Kubwa, Abuja, Unnin Street</small></div>';
  L.marker([lat, lng]).addTo(map).bindPopup(popupContent).openPopup();
}

// ---------- 3D Hologram ----------
const holoCanvas = document.querySelector('#holo-canvas');
if (holoCanvas) {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => initHolo();
  document.head.appendChild(script);
}

function initHolo() {
  const canvas = document.querySelector('#holo-canvas');
  if (!canvas || !window.THREE) return;
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(0, 2, 6);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  const ambient = new THREE.AmbientLight(0x4ecdc4, 0.6);
  scene.add(ambient);
  const point = new THREE.PointLight(0xb06bff, 1.2, 50);
  point.position.set(4, 6, 4);
  scene.add(point);
  // School building: base + roof + windows
  const baseGeo = new THREE.BoxGeometry(3.2, 1.6, 2.0);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x4d96ff, transparent: true, opacity: 0.85, metalness: 0.3, roughness: 0.4 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.8;
  scene.add(base);
  const roofGeo = new THREE.ConeGeometry(2.2, 1.0, 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b, transparent: true, opacity: 0.9, metalness: 0.2, roughness: 0.5 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 2.1;
  roof.rotation.y = Math.PI / 4;
  scene.add(roof);
  const doorGeo = new THREE.BoxGeometry(0.5, 0.9, 0.1);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0xffe66d });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 0.45, 1.05);
  scene.add(door);
  const winGeo = new THREE.BoxGeometry(0.4, 0.4, 0.1);
  const winMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4, emissive: 0x4ecdc4, emissiveIntensity: 0.4 });
  for (let x = -1.0; x <= 1.0; x += 0.7) {
    for (let y = 0.6; y <= 1.2; y += 0.6) {
      const w1 = new THREE.Mesh(winGeo, winMat);
      w1.position.set(x, y, 1.05);
      scene.add(w1);
      const w2 = new THREE.Mesh(winGeo, winMat);
      w2.position.set(x, y, -1.05);
      scene.add(w2);
    }
  }
  const group = new THREE.Group();
  group.add(base); group.add(roof); group.add(door);
  scene.remove(base); scene.remove(roof); scene.remove(door);
  scene.add(group);
  const edges = new THREE.EdgesGeometry(baseGeo);
  const lineMat = new THREE.LineBasicMaterial({ color: 0xb06bff });
  const wire = new THREE.LineSegments(edges, lineMat);
  wire.position.y = 0.8;
  scene.add(wire);
  let isDragging = false, prevX = 0, prevY = 0;
  canvas.addEventListener('mousedown', (e) => { isDragging = true; prevX = e.clientX; prevY = e.clientY; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    group.rotation.y += (e.clientX - prevX) * 0.01;
    group.rotation.x += (e.clientY - prevY) * 0.01;
    wire.rotation.y = group.rotation.y;
    wire.rotation.x = group.rotation.x;
    prevX = e.clientX; prevY = e.clientY;
  });
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    camera.position.z = Math.max(3, Math.min(12, camera.position.z + e.deltaY * 0.01));
  });
  function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) { group.rotation.y += 0.004; wire.rotation.y = group.rotation.y; }
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });
}








