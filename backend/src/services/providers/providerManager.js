/**
 * DPK Service Shop
 * Provider Manager
 *
 * सभी provider operations के लिए एक common interface.
 *
 * आगे provider-specific implementations इसी layer
 * के नीचे जोड़ी जा सकती हैं।
 */

class ProviderManager {
  constructor() {
    this.providers = new Map();
  }

  /**
   * Register a provider implementation.
   */
  register(providerName, providerClient) {
    if (!providerName) {
      throw new Error("Provider name is required");
    }

    if (!providerClient) {
      throw new Error("Provider client is required");
    }

    const key = String(providerName).trim().toLowerCase();

    if (this.providers.has(key)) {
      throw new Error(`Provider "${providerName}" is already registered`);
    }

    this.providers.set(key, providerClient);

    return true;
  }

  /**
   * Get a registered provider.
   */
  get(providerName) {
    const key = String(providerName).trim().toLowerCase();

    const provider = this.providers.get(key);

    if (!provider) {
      throw new Error(`Provider "${providerName}" is not registered`);
    }

    return provider;
  }

  /**
   * Check whether a provider is registered.
   */
  has(providerName) {
    const key = String(providerName).trim().toLowerCase();

    return this.providers.has(key);
  }

  /**
   * List registered providers.
   */
  list() {
    return Array.from(this.providers.keys());
  }

  /**
   * Remove a provider implementation.
   */
  unregister(providerName) {
    const key = String(providerName).trim().toLowerCase();

    return this.providers.delete(key);
  }

  /**
   * Clear all registered provider implementations.
   */
  clear() {
    this.providers.clear();
  }
}

const providerManager = new ProviderManager();

export default providerManager;
export { ProviderManager };
