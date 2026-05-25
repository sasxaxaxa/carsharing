import { RealApiService } from './RealApiService.js';
import { ApiServiceProxy } from './ApiServiceProxy.js';

const realService = new RealApiService();
export const apiClient = new ApiServiceProxy(realService);
