import { apiRequest } from '../../api/http.js';

export class RealApiService {
  request(path, options) {
    return apiRequest(path, options);
  }

  getCarsList(params = {}) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        search.set(key, String(value));
      }
    });
    const query = search.toString();
    return this.request(`/api/cars/list${query ? `?${query}` : ''}`);
  }

  async getAllCars(params = {}) {
    const pageSize = 50;
    let page = 1;
    let allResults = [];
    let totalPages = 1;

    do {
      const data = await this.getCarsList({ ...params, page, page_size: pageSize });
      allResults = allResults.concat(data.results);
      totalPages = data.total_pages;
      page += 1;
    } while (page <= totalPages);

    return allResults;
  }

  getCarDetail(carId) {
    return this.request(`/api/cars/${carId}`);
  }

  getNearestCars(payload) {
    return this.request('/api/cars/nearest', { method: 'POST', body: payload });
  }

  getCarCategories() {
    return this.request('/api/cars/categories');
  }

  login(payload) {
    return this.request('/api/users/login', { method: 'POST', body: payload });
  }

  register(payload) {
    return this.request('/api/users/register', { method: 'POST', body: payload });
  }

  getProfile() {
    return this.request('/api/users/profile', { auth: true });
  }

  updateProfile(payload) {
    return this.request('/api/users/profile', { method: 'PUT', body: payload, auth: true });
  }

  updateUserLocation(payload) {
    return this.request('/api/users/location', { method: 'POST', body: payload, auth: true });
  }

  getRentalHistory() {
    return this.request('/api/rentals/history', { auth: true });
  }

  startRental(payload) {
    return this.request('/api/rentals/start', { method: 'POST', body: payload, auth: true });
  }

  endRental(payload) {
    return this.request('/api/rentals/end', { method: 'POST', body: payload, auth: true });
  }
}
