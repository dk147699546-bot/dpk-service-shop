/**
 * DPK Service Shop
 * Service Sync Controller
 *
 * Provider से services synchronize करने और
 * preview करने के API endpoints के लिए controller.
 */

import serviceSync from "../services/serviceSync.js";

/**
 * Sync provider services
 */
export const syncServices = async (req, res, next) => {
  try {
    const {
      providerName,
      endpoint
    } = req.body;

    if (!providerName || !endpoint) {
      return res.status(400).json({
        success: false,
        message: "providerName and endpoint are required"
      });
    }

    const result = await serviceSync.sync(
      providerName,
      endpoint
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Preview provider services
 *
 * यह provider से data लेता है लेकिन
 * Service Manager में save नहीं करता।
 */
export const previewServices = async (req, res, next) => {
  try {
    const {
      providerName,
      endpoint
    } = req.body;

    if (!providerName || !endpoint) {
      return res.status(400).json({
        success: false,
        message: "providerName and endpoint are required"
      });
    }

    const result = await serviceSync.preview(
      providerName,
      endpoint
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
