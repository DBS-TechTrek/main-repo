import {
  getBalance,
  editRequest,
  getAllOutstandingRequests,
  createRequest,
  deleteRequest,
  getCompanyName,
  updateStatus,
  getOtherOutstandingRequests,
} from "../models/model.js";

import jwt from "jsonwebtoken";

// Controller function to get balance for a specific company from the request body
export async function controllerGetBalance(req, res) {
  try {
    const companyNameFromToken = req.companyName; // Extracted from token
    const companyNameFromParams = req.params.companyName;

    // Ensure the token's companyName matches the URL parameter
    if (companyNameFromToken !== companyNameFromParams) {
      return res.status(403).json({
        error: "Unauthorized: You can only access your own company's balance",
      });
    }

    // Fetch the balance from the model
    const balance = await getBalance(companyNameFromToken);

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

// Controller function to get balance for a specific company from the request body
export async function controllerGetAllOutstandingRequests(req, res) {
  try {
    // Extract companyId from the request params
    console.log("Before req params");
    const companyName = req.params.companyName;
    console.log(req.params.companyName);
    const companyNameFromToken = req.companyName; // Extracted from token
    const companyNameFromParams = req.params.companyName;

    // Ensure the token's companyName matches the URL parameter
    if (companyNameFromToken !== companyNameFromParams) {
      return res.status(403).json({
        error: "Unauthorized: You can only access your own company's balance",
      });
    }
    // Validate that companyId is provided
    if (!companyName) {
      return res
        .status(400)
        .json({ error: "companyName is required in the request body" });
    }

    // Fetch the balance from the model
    const balance = await getAllOutstandingRequests(companyName);

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

export async function controllerGetOtherOutstandingRequests(req, res) {
  try {
    // Extract companyId from the request params
    console.log("Before req params");
    const companyName = req.params.companyName;
    console.log(req.params.companyName);

    // Validate that companyId is provided
    if (!companyName) {
      return res
        .status(400)
        .json({ error: "companyName is required in the request body" });
    }

    // Fetch the balance from the model
    const balance = await getOtherOutstandingRequests(companyName);

    // Check if a result exists
    if (balance.length === 0) {
      return res.status(404).json({ error: "Companies not found" });
    }

    // Respond with the retrieved balance
    return res.status(200).json(balance);
  } catch (error) {
    // Handle errors (e.g., database issues)
    console.error("Error fetching company balance:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Controller function to get balance for a specific company from the request body
export async function controllerCreateRequest(req, res) {
  try {
    // TOCOMPLETE: Extract data from the request body
    const {
      companyId,
      requestReason,
      carbonUnitPrice,
      requestorCompanyId,
      requestType,
      createdDatetime,
      carbonQuantity,
    } = req.body;
    const requestStatus = "Pending";

    // TOCOMPLETE: Validate the data (optional, depending on your use case)
    if (
      !companyId ||
      !requestReason ||
      !carbonUnitPrice ||
      !requestorCompanyId ||
      !requestStatus ||
      !requestType ||
      !createdDatetime ||
      !carbonQuantity
    ) {
      return res.status(400).json({ error: "Missing information" });
    }

    // TOCOMPLETE: Call the model function to create data (assumed to be a database insert)
    const newRequest = await createRequest({
      companyId,
      requestReason,
      carbonUnitPrice,
      requestorCompanyId,
      requestStatus,
      requestType,
      createdDatetime,
      carbonQuantity,
    });

    // Respond with the retrieved balance
    return res.status(200).json(newRequest);
  } catch (error) {
    // Handle errors (e.g., database issues)
    console.error("Error creating request:", error);
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

export async function controllerDeleteRequest(req, res) {
  console.log("req.params:", req.params);
  const { id } = req.params;
  try {
    const result = await deleteRequest(id);
    if (!result) {
      return res.status(404).send("request not found");
    }
    res.send(result);
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).send("Failed to fetch request");
  }
}

export async function controllerLogin(req, res) {
  const body = req.body;
  const companyName = body.username;
  console.log("username is", body.username);
  console.log("password is ", body.password);

  // Checking if the user entered the correct username/password combo
  try {
    const result = await getCompanyName(body.username);
    if (!result) {
      return res.status(404).send("request not found");
    }
    if (body.password === result.password) {
      console.log("Passwords match");
      const jsontoken = jwt.sign({ companyName }, "qwe1234", {
        expiresIn: "1h",
      });
      res.send(jsontoken);
    }
  } catch (err) {
    console.error("Error fetching request:", err);
    res.status(500).send("Failed to fetch request");
  }
}

export async function controllerUpdateStatus(req, res) {
  try {
    // Extract input from the request body
    const requestId = req.params.id;
    console.log(requestId);
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
    const result = await updateStatus({
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
    console.error("Error handling updateStatus:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
