/**
 * Заместитель (Proxy): контролирует доступ к RealApiService.
 * — кэш для GET-запросов каталога;
 * — логирование вызовов (для отладки развёртывания);
 * — единая точка входа клиента при деплое.
 */
export class ApiServiceProxy {
  constructor(realService) {
    this.realService = realService;
    this.cache = new Map();
    this.loggingEnabled = import.meta.env.DEV;
  }

  log(action, detail) {
    if (this.loggingEnabled) {
      console.info(`[ApiServiceProxy] ${action}`, detail);
    }
  }

  getCacheKey(method, path, body) {
    return `${method}:${path}:${body ? JSON.stringify(body) : ''}`;
  }

  async request(path, options = {}) {
    const method = options.method ?? 'GET';
    const isCacheable = method === 'GET' && !options.auth;
    const cacheKey = this.getCacheKey(method, path, options.body);

    if (isCacheable && this.cache.has(cacheKey)) {
      this.log('cache hit', cacheKey);
      return this.cache.get(cacheKey);
    }

    this.log('request', { method, path });
    const result = await this.realService.request(path, options);

    if (isCacheable) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  getCarsList(params) {
    return this.realService.getCarsList(params);
  }

  getAllCars(params) {
    this.log('getAllCars', params);
    return this.realService.getAllCars(params);
  }

  getCarDetail(carId) {
    return this.realService.getCarDetail(carId);
  }

  getCarCategories() {
    const cacheKey = 'GET:/api/cars/categories';
    if (this.cache.has(cacheKey)) {
      this.log('cache hit', cacheKey);
      return Promise.resolve(this.cache.get(cacheKey));
    }
    this.log('getCarCategories', null);
    return this.realService.getCarCategories().then((data) => {
      this.cache.set(cacheKey, data);
      return data;
    });
  }

  login(payload) {
    return this.realService.login(payload);
  }

  register(payload) {
    return this.realService.register(payload);
  }

  getProfile() {
    return this.realService.getProfile();
  }

  updateUserLocation(payload) {
    return this.realService.updateUserLocation(payload);
  }

  getRentalHistory() {
    return this.realService.getRentalHistory();
  }

  startRental(payload) {
    return this.realService.startRental(payload);
  }

  endRental(payload) {
    this.log('endRental', { rental_id: payload?.rental_id });
    return this.realService.endRental(payload);
  }

  clearCache() {
    this.cache.clear();
    this.log('cache cleared', null);
  }
}
