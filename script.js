const mapWidth = 10;
const mapHeight = 10;

let position = { x: 0, y: 0 };
let availableImages = [];

const getLetter = (index) => String.fromCharCode(97 + index);
const getImagePath = (x, y) => `images/map_${getLetter(x)}_${y + 1}.png`;

function updateMap() {
  const imagePath = getImagePath(position.x, position.y);
  const img = new Image();
  img.onload = () => {
    document.getElementById('map-image').src = imagePath;
    toggleArrows();
  };
  img.onerror = () => console.warn("Image not found:", imagePath);
  img.src = imagePath;
}

function move(direction) {
  const newX = position.x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
  const newY = position.y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
  if (availableImages.some(img => img.x === newX && img.y === newY)) {
    position = { x: newX, y: newY };
    updateMap();
  }
}

function toggleArrows() {
  const directions = {
    up: [position.x, position.y - 1],
    down: [position.x, position.y + 1],
    left: [position.x - 1, position.y],
    right: [position.x + 1, position.y]
  };
  for (const dir in directions) {
    const [x, y] = directions[dir];
    const arrow = document.getElementById(`arrow-${dir}`);
    if (availableImages.some(img => img.x === x && img.y === y)) {
      arrow.style.display = 'block';
    } else {
      arrow.style.display = 'none';
    }
  }
}

function toggleFullMap() {
  const main = document.getElementById('main-map');
  const full = document.getElementById('full-map');
  if (main.classList.contains('hidden')) {
    main.classList.remove('hidden');
    full.classList.add('hidden');
  } else {
    main.classList.add('hidden');
    full.classList.remove('hidden');
    renderFullMap();
  }
}

function renderFullMap() {
  const container = document.getElementById('full-map');
  container.innerHTML = '';

  const xs = availableImages.map(i => i.x);
  const ys = availableImages.map(i => i.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const cols = maxX - minX + 1;
  const rows = maxY - minY + 1;

  const containerWidth = container.clientWidth;
  const tileWidth = containerWidth / cols;
  const tileHeight = tileWidth * 3 / 2;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const match = availableImages.find(i => i.x === x && i.y === y);
      const cell = document.createElement('img');

      cell.style.position = 'absolute';
      cell.style.width = `${tileWidth}px`;
      cell.style.height = `${tileHeight}px`;
      cell.style.left = `${(x - minX) * tileWidth}px`;
      cell.style.top = `${(y - minY) * tileHeight}px`;
      cell.style.margin = '0';
      cell.style.padding = '0';
      cell.style.display = 'block';
      cell.style.border = 'none';
      cell.style.boxSizing = 'border-box';

      if (match) {
        cell.src = getImagePath(x, y);
        cell.onclick = () => {
          position = { x, y };
          toggleFullMap();
          updateMap();
        };
        if (x === position.x && y === position.y) {
          cell.style.outline = '3px solid yellow';
          cell.style.outlineOffset = '-3px';
        }
      } else {
        cell.style.background = '#000';
      }

      container.appendChild(cell);
    }
  }
}

function scanAvailableImages() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const img = new Image();
      img.onload = () => {
        availableImages.push({ x, y });
        if (x === 0 && y === 0) updateMap();
      };
      img.src = getImagePath(x, y);
    }
  }
}
scanAvailableImages();