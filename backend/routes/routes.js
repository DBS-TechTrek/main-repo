import express from "express";
import {
  controllerGetBalance,
  controllerCreateRequest,
  controllerEditRequest,
  controllerGetAllOutstandingRequests,
  controllerDeleteRequest,
  controllerUpdateStatus,
  controllerGetOtherOutstandingRequests
} from "../controllers/controller.js";

const router = express.Router();

// Routes for notes
//Change to companyName
router.get("/companyBalance/:companyName", controllerGetBalance); // GET /notes
router.get(
  "/companyOutstandingRequests/:companyName",
  controllerGetAllOutstandingRequests
);
router.get(
  "/otherCompanyOutstandingRequests/:companyName",
  controllerGetOtherOutstandingRequests
);
router.put("/editRequest/:id", controllerEditRequest);
router.post("/createRequest", controllerCreateRequest);
router.delete("/deleteRequest/:id", controllerDeleteRequest);
router.put("/updateStatus/:id", controllerUpdateStatus);

export default router;
