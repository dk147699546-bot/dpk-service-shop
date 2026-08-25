/**
 * DPK Service Shop
 * Service Manager
 *
 * Provider से मिलने वाली services को
 * application के standard format में manage करता है.
 */

class ServiceManager {
  constructor() {
    this.services = new Map();
  }

  /**
   * Add or update a service.
   */
  upsert(service) {
    if (!service || typeof service !== "object") {
      throw new Error("Service data is required");
    }

    if (!service.providerServiceId) {
      throw new Error("Provider service ID is required");
    }

    const id = String(service.providerServiceId);

    const normalizedService = {
      providerServiceId: id,
      name: String(service.name || "").trim(),
      category: String(service.category || "").trim(),
      type: String(service.type || "default").trim(),
      rate: Number(service.rate || 0),
      min: Number(service.min || 1),
      max: Number(service.max || 1),
      description: String(service.description || "").trim(),
      status: service.status || "active"
    };

    this.services.set(id, normalizedService);

    return normalizedService;
  }

  /**
   * Add multiple services.
   */
  upsertMany(services) {
    if (!Array.isArray(services)) {
      throw new Error("Services must be an array");
    }

    return services.map((service) => this.upsert(service));
  }

  /**
   * Get one service.
   */
  get(providerServiceId) {
    return this.services.get(String(providerServiceId)) || null;
  }

  /**
   * Get all services.
   */
  list() {
    return Array.from(this.services.values());
  }

  /**
   * Enable or disable a service.
   */
  setStatus(providerServiceId, status) {
    const service = this.get(providerServiceId);

    if (!service) {
      throw new Error("Service not found");
    }

    if (!["active", "inactive"].includes(status)) {
      throw new Error("Invalid service status");
    }

    service.status = status;

    this.services.set(
      service.providerServiceId,
      service
    );

    return service;
  }

  /**
   * Remove a service.
   */
  remove(providerServiceId) {
    return this.services.delete(
      String(providerServiceId)
    );
  }

  /**
   * Remove all services.
   */
  clear() {
    this.services.clear();
  }
}

const serviceManager = new ServiceManager();

export default serviceManager;
export { ServiceManager };
