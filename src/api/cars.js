import { apiRequest } from './http.js';

export function getCarsList(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return apiRequest(`/api/cars/list${query ? `?${query}` : ''}`);
}

export async function getAllCars(params = {}) {
  const pageSize = 50;
  let page = 1;
  let allResults = [];
  let totalPages = 1;

  do {
    const data = await getCarsList({ ...params, page, page_size: pageSize });
    allResults = allResults.concat(data.results);
    totalPages = data.total_pages;
    page += 1;
  } while (page <= totalPages);

  return allResults;
}

export function getCarDetail(carId) {
  return apiRequest(`/api/cars/${carId}`);
}

export function getNearestCars({ latitude, longitude, limit = 10 }) {
  return apiRequest('/api/cars/nearest', {
    method: 'POST',
    body: { latitude, longitude, limit },
  });
}
