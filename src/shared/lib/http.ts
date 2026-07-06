import axios from 'axios'
import { env } from '@/shared/config/env'

export const perenualHttp = axios.create({
  baseURL: 'https://perenual.com/api',
  timeout: 9000,
})

perenualHttp.interceptors.request.use((config) => {
  config.params = { ...config.params, key: env.perenualApiKey }
  return config
})
