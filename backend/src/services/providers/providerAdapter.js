/**
 * DPK Service Shop
 * Provider Adapter
 *
 * यह layer ProviderClient और बाकी backend के बीच
 * standard interface provide करती है।
 *
 * अलग-अलग authorized providers के API formats
 * बाद में इसी adapter के माध्यम से handle किए जा सकते हैं.
 */

import ProviderClient from "./providerClient.js";

class ProviderAdapter {
  constructor({
    baseUrl,
    apiKey,
    timeout = 15000
  }) {
    this.client = new ProviderClient({
      baseUrl,
      apiKey,
      timeout
    });
  }

  /**
   * Generic GET request
   */
  async get(path) {
    return this.client.get(path);
  }

  /**
   * Generic POST request
   */
  async post(path, body = {}) {
    return this.client.post(path, body);
  }

  /**
   * Generic PUT request
   */
  async put(path, body = {}) {
    return this.client.put(path, body);
  }

  /**
   * Generic DELETE request
   */
  async delete(path) {
    return this.client.delete(path);
  }

  /**
   * Test whether the provider API is reachable.
   *
   * endpoint provider configuration के अनुसार
   * बाद में दिया जाएगा।
   */
  async testConnection(endpoint = "") {
    const response = await this.get(endpoint);

    return {
      success: true,
      status: response.status,
      data: response.data
    };
  }

  /**
   * Fetch services from a provider.
   *
   * Actual endpoint provider के API contract के
   * अनुसार configure किया जाएगा।
   */
  async getServices(endpoint) {
    if (!endpoint) {
      throw new Error("Service endpoint is required");
    }

    return this.get(endpoint);
  }

  /**
   * Create a provider request.
   *
   * केवल provider द्वारा supported/authorized
   * operations के लिए इस्तेमाल किया जाएगा।
   */
  async createRequest(endpoint, payload) {
    if (!endpoint) {
      throw new Error("Request endpoint is required");
    }

    if (!payload || typeof payload !== "object") {
      throw new Error("Request payload is required");
    }

    return this.post(endpoint, payload);
  }

  /**
   * Get request/order status.
   */
  async getRequestStatus(endpoint) {
    if (!endpoint) {
      throw new Error("Status endpoint is required");
    }

    return this.get(endpoint);
  }

  /**
   * Get provider account information/balance.
   *
   * Exact endpoint provider के API contract से आएगा।
   */
  async getAccountInfo(endpoint) {
    if (!endpoint) {
      throw new Error("Account endpoint is required");
    }

    return this.get(endpoint);
  }
}

export default ProviderAdapter;
export { ProviderAdapter };
