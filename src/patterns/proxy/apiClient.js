import { RealApiService } from './RealApiService.js';
import { ApiServiceProxy } from './ApiServiceProxy.js';

const realService = new RealApiService();
/** Единый клиент приложения (Заместитель поверх реального API). */
export const apiClient = new ApiServiceProxy(realService);
