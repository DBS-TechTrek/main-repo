import express from "express";
import {
  controllerGetBalance,
  controllerCreateRequest,
  controllerEditRequest,
  controllerGetAllOutstandingRequests,
} from "../controllers/controller.js";

const router = express.Router();

// Routes for notes
router.get("/companyBalance/:id", controllerGetBalance); // GET /notes
router.put("/editRequest/:id", controllerEditRequest);
router.post("/companyBalance", controllerCreateRequest); // POST /notes

router.get("/companyOutstandingRequests/:id", controllerGetAllOutstandingRequests); // GET /notes

export default router;
