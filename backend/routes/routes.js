import express from "express";
import {
  controllerGetBalance,
  controllerCreateRequest,
  controllerEditRequest,
  controllerGetAllOutstandingRequests,
  controllerDeleteRequest,
  controllerLogin,
} from "../controllers/controller.js";

import { checkToken } from "../auth/checkToken.js";

const router = express.Router();

// Routes for notes
//Change to companyName
router.get("/companyBalance/:companyName", checkToken, controllerGetBalance); // GET /notes
router.get(
  "/companyOutstandingRequests/:companyName",
  checkToken,
  controllerGetAllOutstandingRequests
);
router.put("/editRequest/:id", controllerEditRequest);
router.post("/createRequest", controllerCreateRequest);
router.delete("/deleteRequest/:id", controllerDeleteRequest);
router.post("/login", controllerLogin);

export default router;
