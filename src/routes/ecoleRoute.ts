import { Router } from "express";
import {
  createEcole,
  getAllEcoles,
  getEcoleById,
  updateEcole,
  deleteEcole
} from "../controllers/ecoleController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Validation rules
const ecoleValidation = [
  { field: 'nomEcole', required: true, type: 'string' as const, minLength: 2, maxLength: 100 }
];

const idValidation = [
  { field: 'id', required: true, type: 'number' as const }
];

// Routes publiques (lecture seule)
router.get("/", getAllEcoles);
router.get("/:id", validateParams(idValidation), getEcoleById);

// Routes protégées (modification - DIRECTEUR et SECRETAIRE)
router.post("/",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateBody(ecoleValidation),
  createEcole
);

router.put("/:id",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateParams(idValidation),
  validateBody(ecoleValidation),
  updateEcole
);

// Routes super admin (suppression - DIRECTEUR seulement)
router.delete("/:id",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR),
  validateParams(idValidation),
  deleteEcole
);

export default router;