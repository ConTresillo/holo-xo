{
function normalizePoint(point, bounds) {
  return { x: (point.x - bounds.left) / bounds.width, y: (point.y - bounds.top) / bounds.height };
}

function classifyStroke(points, minLength = 0.07) {
  if (!Array.isArray(points) || points.length < 4) return null;
  const xs = points.map(p => p.x), ys = points.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const width = maxX - minX, height = maxY - minY;
  if (width < minLength || height < minLength) return null;
  const pathLength = points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0);
  if (pathLength < minLength * 1.8) return null;

  const marginX = width * 0.2, marginY = height * 0.2;
  let down = false, up = false;
  for (const p of points) {
    const tx = width ? (p.x - minX) / width : 0;
    const ty = height ? (p.y - minY) / height : 0;
    if (Math.abs(tx - ty) < 0.27) down = true;
    if (Math.abs(tx - (1 - ty)) < 0.27) up = true;
  }
  const dx = points[0].x - points.at(-1).x, dy = points[0].y - points.at(-1).y;
  const closed = Math.hypot(dx, dy) < Math.max(width, height) * 0.38;
  const startDistance = Math.hypot(dx, dy);
  const perimeter = 2 * (width + height) || 1;
  const aspect = width / height;
  const circular = aspect > 0.55 && aspect < 1.8;
  if (closed && circular && startDistance < Math.max(width, height) * 0.3 && pathLength > perimeter * 0.7) return 'O';
  if (down && up && !closed && width / height > 0.48 && height / width > 0.48) return 'X';
  return null;
}

function pointCell(point, rect) {
  const x = (point.x - rect.left) / rect.width;
  const y = (point.y - rect.top) / rect.height;
  if (x < 0 || x >= 1 || y < 0 || y >= 1) return null;
  const col = Math.min(2, Math.floor(x * 3));
  const row = Math.min(2, Math.floor(y * 3));
  return row * 3 + col;
}

function validCellStroke(points, cell, rect) {
  if (!points.length) return false;
  return points.every(p => pointCell(p, rect) === cell);
}

if (typeof module !== 'undefined') module.exports = { classifyStroke, pointCell, validCellStroke, normalizePoint };
else Object.assign(window.HoloXO, { classifyStroke, pointCell, validCellStroke, normalizePoint });
}
