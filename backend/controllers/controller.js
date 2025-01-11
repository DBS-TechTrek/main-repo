import { getBalance } from "../models/model.js";

// Controller function to get balance for a specific company from the request body
export async function controllerGetBalance(req, res) {
  try {
    // Extract companyId from the request params
    console.log("Before req params");
    const companyId = req.params.id;
    console.log(req.params.id);

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
