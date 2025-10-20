import { Router } from "express";
import {
  createPrestation,
  getAllPrestations,
  getPrestationById,
  updatePrestation,
  deletePrestation
} from "../controllers/prestationController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Validation rules
const prestationValidation = [
  { field: 'nomPrestation', required: true, type: 'string' as const, minLength: 2, maxLength: 100 },
  { field: 'prix_TTC', required: true, type: 'number' as const, min: 0 },
  { field: 'idCategorie', required: true, type: 'number' as const, min: 1 }
];

const idValidation = [
  { field: 'id', required: true, type: 'number' as const }
];

// Routes publiques (lecture seule)
router.get("/", getAllPrestations);
router.get("/:id", validateParams(idValidation), getPrestationById);

// Routes protégées (modification - DIRECTEUR et SECRETAIRE)
router.post("/",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateBody(prestationValidation),
  createPrestation
);

router.put("/:id",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateParams(idValidation),
  validateBody(prestationValidation),
  updatePrestation
);

// Routes super admin (suppression - DIRECTEUR seulement)
router.delete("/:id",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR),
  validateParams(idValidation),
  deletePrestation
);

export default router;