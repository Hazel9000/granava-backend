const axios = require('axios');
const crypto = require('crypto');
const { OPENAIP_API_KEY } = process.env;

class OpenAIPService {
  constructor() {
    if (!this.constructor.validateKey(OPENAIP_API_KEY)) {
      throw new Error('Invalid OpenAIP API key format');
    }

    this.client = axios.create({
      baseURL: 'https://api.core.openaip.net/api',
      timeout: 8000,
      headers: {
        'x-openaip-api-key': OPENAIP_API_KEY,
        'Accept': 'application/vnd.openaip+json',
        'X-Client-ID': 'granava/1.0' 
      }
    });

    // Request interceptor for dual authentication
    this.client.interceptors.request.use(config => {
      config.params = {
        ...config.params,
        apiKey: config.headers['x-openaip-api-key'] ? undefined : OPENAIP_API_KEY
      };
      return config;
    });
  }

  static validateKey(key) {
    return /^[a-f0-9]{32}$/.test(key);
  }

  async getAirports(bbox) {
    return this._request('/airspaces/search', {
      bbox,
      types: 'AERODROME'
    });
  }

  async _request(endpoint, params) {
    try {
      const response = await this.client.get(endpoint, { params });
      return {
        success: true,
        data: response.data,
        metadata: {
          apiVersion: response.headers['x-openaip-version'],
          requestId: crypto.randomBytes(8).toString('hex')
        }
      };
    } catch (error) {
      return {
        success: false,
        error: this._normalizeError(error)
      };
    }
  }

  _normalizeError(error) {
    return {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'API request failed',
      retryable: ![401, 403, 404].includes(error.response?.status)
    };
  }
}

module.exports = new OpenAIPService();
