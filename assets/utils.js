function formatDate(dateStr) {
  if (!dateStr) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (!m) return dateStr; // "YYYY-MM-DD", raw otherwise

  const y = parseInt(m[1], 10);
  const mo = parseInt(m[2], 10);
  const d = parseInt(m[3], 10);

  // UTC, avoid parse issues on some browsers
  const dt = new Date(Date.UTC(y, mo - 1, d));

  return dt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

function adjustColor(hex, amount) {
    // Enlève le # si présent
    hex = hex.replace(/^#/, '');

    // Supporte les formats courts comme #abc
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const num = parseInt(hex, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;

    // Clamp entre 0 et 255
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}