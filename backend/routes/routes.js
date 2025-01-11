import express from "express";
import { controllerGetBalance } from "../controllers/controller.js";

const router = express.Router();

// Routes for notes
router.get("/companyBalance/:id", controllerGetBalance); // GET /notes

export default router;
