const axios = require('axios');
const crypto = require('crypto');
const { validateApiKey } = require('../utils/auth');

class OpenAIPService {
  constructor(apiKey) {
    if (!validateApiKey(apiKey)) {
      throw new Error('Invalid OpenAIP API key format');
    }

    this.client = axios.create({
      baseURL: 'https://api.core.openaip.net/api',
      timeout: 8000,
      headers: {
        'Accept': 'application/vnd.openaip+json',
        'x-openaip-api-key': apiKey, // Primary auth
        'X-Request-Source': 'granava/1.0'
      }
    });

    // Fallback to query param if headers are blocked
    this.client.interceptors.request.use(config => {
      if (!config.headers['x-openaip-api-key']) {
        config.params = { ...config.params, apiKey };
      }
      return config;
    });
  }

  async getData(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint
