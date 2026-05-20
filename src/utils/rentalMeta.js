const RENTAL_META_KEY = 'morent_rental_meta_v1';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function getRentalMetaMap() {
  const raw = localStorage.getItem(RENTAL_META_KEY);
  if (!raw) return {};
  const data = safeParse(raw, {});
  return data && typeof data === 'object' ? data : {};
}

export function setRentalMeta(rentalId, meta) {
  if (!rentalId) return;
  const map = getRentalMetaMap();
  map[String(rentalId)] = {
    ...meta,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(RENTAL_META_KEY, JSON.stringify(map));
}

export function removeRentalMeta(rentalId) {
  if (!rentalId) return;
  const map = getRentalMetaMap();
  delete map[String(rentalId)];
  localStorage.setItem(RENTAL_META_KEY, JSON.stringify(map));
}

