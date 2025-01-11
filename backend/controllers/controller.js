import { getBalance, editRequest } from "../models/model.js";

// Controller function to get balance for a specific company from the request body
export async function controllerGetBalance(req, res) {
  try {
    // Extract companyId from the request params
    const companyId = req.params.id;

    // Validate that companyId is provided
    if (!companyId) {
      return res
        .status(400)
        .json({ error: "companyId is required in the request body" });
    }

    // Fetch the balance from the model
    const balance = await getBalance(companyId);

    // Check if a result exists
    if (balance.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Respond with the retrieved balance
    return res.status(200).json(balance);
  } catch (error) {
    // Handle errors (e.g., database issues)
    console.error("Error fetching company balance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Controller function to handle editing a request
export async function controllerEditRequest(req, res) {
  try {
    // Extract input from the request body
    const requestId = req.params.id;
    const {
      companyId,
      requestorCompanyId,
      carbonUnitPrice,
      carbonQuantity,
      requestReason,
      requestStatus,
      requestType,
    } = req.body;

    // Validate required fields
    if (!requestId) {
      return res.status(400).json({ error: "requestId is required" });
    }

    // Call the model function to update the request
    const result = await editRequest({
      requestId,
      companyId,
      requestorCompanyId,
      carbonUnitPrice,
      carbonQuantity,
      requestReason,
      requestStatus,
      requestType,
    });

    // Check if any rows were affected (i.e., if the record was updated)
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Request not found or no changes made" });
    }

    // Respond with success
    return res.status(200).json({ message: "Request updated successfully" });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error handling editRequest:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
