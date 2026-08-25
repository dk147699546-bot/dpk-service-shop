/**
 * DPK Service Shop
 * Provider API Client
 *
 * Common HTTP client for communicating with
 * authorized provider APIs.
 *
 * Important:
 * - API credentials code में hard-code नहीं होंगे.
 * - Credentials runtime पर provide किए जाएंगे.
 * - Timeout और error handling built-in है.
 */

class ProviderClient {
  constructor({
    baseUrl,
    apiKey,
    timeout = 15000
  }) {
    if (!baseUrl) {
      throw new Error("Provider base URL is required");
    }

    if (!apiKey) {
      throw new Error("Provider API credential is required");
    }

    this.baseUrl = String(baseUrl).replace(/\/+$/, "");
    this.apiKey = String(apiKey);
    this.timeout = Number(timeout);
  }

  async request(path, options = {}) {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeout);

    try {
      const cleanPath = String(path).replace(/^\/+/, "");

      const url = new URL(
        cleanPath,
        `${this.baseUrl}/`
      );

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...(options.headers || {})
      };

      const response = await fetch(url, {
        method: options.method || "GET",
        headers,
        body:
          options.body !== undefined
            ? JSON.stringify(options.body)
            : undefined,
        signal: controller.signal
      });

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const error = new Error(
          `Provider request failed with status ${response.status}`
        );

        error.statusCode = response.status;
        error.providerResponse = data;

        throw error;
      }

      return {
        success: true,
        status: response.status,
        data
      };
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Provider request timed out");
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get(path, options = {}) {
    return this.request(path, {
      ...options,
      method: "GET"
    });
  }

  async post(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: "POST",
      body
    });
  }

  async put(path, body, options = {}) {
    return this.request(path, {
      ...options,
      method: "PUT",
      body
    });
  }

  async delete(path, options = {}) {
    return this.request(path, {
      ...options,
      method: "DELETE"
    });
  }
}

export default ProviderClient;
export { ProviderClient };
