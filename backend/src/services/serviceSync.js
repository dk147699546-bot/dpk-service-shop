/**
 * DPK Service Shop
 * Service Synchronization
 *
 * Provider API से services लेकर उन्हें
 * हमारे standard format में convert करके
 * Service Manager में sync करता है.
 */

import providerManager from "./providers/providerManager.js";
import {
  mapServices
} from "./providers/providerMapper.js";
import serviceManager from "./serviceManager.js";

class ServiceSync {
  /**
   * Sync services from a registered provider.
   *
   * @param {string} providerName
   * @param {string} endpoint
   */
  async sync(providerName, endpoint) {
    if (!providerName) {
      throw new Error("Provider name is required");
    }

    if (!endpoint) {
      throw new Error("Service endpoint is required");
    }

    const provider = providerManager.get(providerName);

    if (!provider) {
      throw new Error(
        `Provider "${providerName}" is not available`
      );
    }

    const response = await provider.getServices(endpoint);

    const providerData = response?.data;

    let services = providerData;

    /*
     * कुछ APIs services को:
     * { services: [...] }
     * के अंदर भेजती हैं।
     */
    if (
      providerData &&
      typeof providerData === "object" &&
      Array.isArray(providerData.services)
    ) {
      services = providerData.services;
    }

    const mappedServices = mapServices(services);

    const syncedServices =
      serviceManager.upsertMany(mappedServices);

    return {
      success: true,
      provider: providerName,
      total: syncedServices.length,
      services: syncedServices
    };
  }

  /**
   * Preview provider services without storing them.
   */
  async preview(providerName, endpoint) {
    if (!providerName) {
      throw new Error("Provider name is required");
    }

    if (!endpoint) {
      throw new Error("Service endpoint is required");
    }

    const provider = providerManager.get(providerName);

    const response = await provider.getServices(endpoint);

    let services = response?.data;

    if (
      services &&
      typeof services === "object" &&
      Array.isArray(services.services)
    ) {
      services = services.services;
    }

    return {
      success: true,
      provider: providerName,
      services: mapServices(services)
    };
  }
}

const serviceSync = new ServiceSync();

export default serviceSync;
export { ServiceSync };
