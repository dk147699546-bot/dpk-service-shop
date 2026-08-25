import { query } from "../config/database.js";

/**
 * DPK Service Shop
 * Provider Controller
 *
 * Provider management के HTTP requests यहाँ handle होंगे।
 */

/**
 * Get all providers
 */
export const getProviders = async (req, res, next) => {
  try {
    const result = await query(
      `
      SELECT
        id,
        name,
        api_url,
        currency,
        status,
        last_balance,
        last_balance_checked_at,
        created_at,
        updated_at
      FROM providers
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
 * Get provider by ID
 */
export const getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      SELECT
        id,
        name,
        api_url,
        currency,
        status,
        last_balance,
        last_balance_checked_at,
        created_at,
        updated_at
      FROM providers
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
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
 * Create provider
 *
 * Actual credential encryption अगले module में जोड़ेंगे।
 */
export const createProvider = async (req, res, next) => {
  try {
    const {
      name,
      apiUrl,
      apiKey,
      currency = "INR"
    } = req.body;

    if (!name || !apiUrl || !apiKey) {
      return res.status(400).json({
        success: false,
        message: "Name, API URL and API key are required"
      });
    }

    const result = await query(
      `
      INSERT INTO providers (
        name,
        api_url,
        api_key_encrypted,
        currency
      )
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        api_url,
        currency,
        status,
        created_at
      `,
      [
        String(name).trim(),
        String(apiUrl).trim(),
        String(apiKey),
        String(currency).trim().toUpperCase()
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Provider created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update provider
 */
export const updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      apiUrl,
      currency
    } = req.body;

    const result = await query(
      `
      UPDATE providers
      SET
        name = COALESCE($1, name),
        api_url = COALESCE($2, api_url),
        currency = COALESCE($3, currency),
        updated_at = NOW()
      WHERE id = $4
      RETURNING
        id,
        name,
        api_url,
        currency,
        status,
        updated_at
      `,
      [
        name ? String(name).trim() : null,
        apiUrl ? String(apiUrl).trim() : null,
        currency ? String(currency).trim().toUpperCase() : null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change provider status
 */
export const updateProviderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "inactive"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid provider status"
      });
    }

    const result = await query(
      `
      UPDATE providers
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
        message: "Provider not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider status updated",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete provider
 */
export const deleteProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      DELETE FROM providers
      WHERE id = $1
      RETURNING id, name
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Provider deleted successfully",
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
