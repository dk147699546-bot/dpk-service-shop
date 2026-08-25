import { query } from "../config/database.js";

/**
 * DPK Service Shop
 * Service Controller
 *
 * Database में available services को manage करता है।
 */

/**
 * Get all services
 */
export const getServices = async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT
        id,
        provider_id,
        provider_service_id,
        name,
        category,
        type,
        rate,
        min_quantity,
        max_quantity,
        description,
        status,
        created_at,
        updated_at
      FROM services
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get service by ID
 */
export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      SELECT
        id,
        provider_id,
        provider_service_id,
        name,
        category,
        type,
        rate,
        min_quantity,
        max_quantity,
        description,
        status,
        created_at,
        updated_at
      FROM services
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create service
 */
export const createService = async (req, res, next) => {
  try {
    const {
      providerId,
      providerServiceId,
      name,
      category,
      type = "default",
      rate = 0,
      minQuantity = 1,
      maxQuantity = 1,
      description = ""
    } = req.body;

    if (!providerId || !providerServiceId || !name) {
      return res.status(400).json({
        success: false,
        message: "Provider ID, provider service ID and name are required"
      });
    }

    if (
      Number(minQuantity) < 1 ||
      Number(maxQuantity) < Number(minQuantity)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity limits"
      });
    }

    const result = await query(
      `
      INSERT INTO services (
        provider_id,
        provider_service_id,
        name,
        category,
        type,
        rate,
        min_quantity,
        max_quantity,
        description
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *
      `,
      [
        providerId,
        String(providerServiceId),
        String(name).trim(),
        String(category || "").trim(),
        String(type).trim(),
        Number(rate),
        Number(minQuantity),
        Number(maxQuantity),
        String(description).trim()
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update service
 */
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      type,
      rate,
      minQuantity,
      maxQuantity,
      description
    } = req.body;

    const result = await query(
      `
      UPDATE services
      SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        type = COALESCE($3, type),
        rate = COALESCE($4, rate),
        min_quantity = COALESCE($5, min_quantity),
        max_quantity = COALESCE($6, max_quantity),
        description = COALESCE($7, description),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
      `,
      [
        name ?? null,
        category ?? null,
        type ?? null,
        rate !== undefined ? Number(rate) : null,
        minQuantity !== undefined ? Number(minQuantity) : null,
        maxQuantity !== undefined ? Number(maxQuantity) : null,
        description ?? null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change service status
 */
export const updateServiceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service status"
      });
    }

    const result = await query(
      `
      UPDATE services
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, status, updated_at
      `,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service status updated",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete service
 */
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      DELETE FROM services
      WHERE id = $1
      RETURNING id, name
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
