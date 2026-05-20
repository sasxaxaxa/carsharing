/**
 * Интерфейс сервиса API (Заместитель / Proxy).
 * @typedef {object} IApiService
 * @property {(path: string, options?: object) => Promise<unknown>} request
 * @property {(params?: object) => Promise<unknown>} getCarsList
 * @property {(params?: object) => Promise<unknown[]>} getAllCars
 * @property {(carId: number|string) => Promise<unknown>} getCarDetail
 * @property {() => Promise<unknown>} getCarCategories
 * @property {(payload: object) => Promise<unknown>} login
 * @property {(payload: object) => Promise<unknown>} register
 * @property {() => Promise<unknown>} getProfile
 * @property {() => Promise<unknown>} getRentalHistory
 */

export {};
