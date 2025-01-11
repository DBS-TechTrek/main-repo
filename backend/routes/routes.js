import express from "express";
import {
  controllerGetBalance,
  controllerEditRequest,
  controllerGetAllOutstandingRequests,
} from "../controllers/controller.js";

const router = express.Router();

// Routes for notes
router.get("/companyBalance/:id", controllerGetBalance); // GET /notes
router.put("/editRequest/:id", controllerEditRequest);

router.get("/companyOutstandingRequests/:id", controllerGetAllOutstandingRequests); // GET /notes

export default router;
