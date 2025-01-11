import express from "express";
import {
  controllerGetBalance,
  controllerCreateRequest,
  controllerEditRequest,
  controllerGetAllOutstandingRequests,
  controllerDeleteRequest,
  controllerLogin,
  controllerUpdateStatus,
  controllerGetOtherOutstandingRequests,
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
router.get(
  "/otherCompanyOutstandingRequests/:companyName",
  controllerGetOtherOutstandingRequests
);
router.put("/editRequest/:id", controllerEditRequest);
router.post("/createRequest", controllerCreateRequest);
router.post("/login", controllerLogin);
router.delete("/deleteRequest/:companyName", controllerDeleteRequest);
router.put("/updateStatus/:id", controllerUpdateStatus);

export default router;
