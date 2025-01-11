import express from "express";
import {
  controllerGetBalance,
  controllerEditRequest,
} from "../controllers/controller.js";

const router = express.Router();

// Routes for notes
router.get("/companyBalance/:id", controllerGetBalance); // GET /notes
router.put("/editRequest/:id", controllerEditRequest);

export default router;
