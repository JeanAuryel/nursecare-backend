import { Router } from "express";
import {
  createCategorie,
  getAllCategories,
  getCategorieById,
  updateCategorie,
  deleteCategorie
} from "../controllers/categorieController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Validation rules
const categorieValidation = [
  { field: 'nomCategorie', required: true, type: 'string' as const, minLength: 2, maxLength: 100 }
];

const idValidation = [
  { field: 'id', required: true, type: 'number' as const }
];

// Routes publiques (lecture seule)
router.get("/", getAllCategories);
router.get("/:id", validateParams(idValidation), getCategorieById);

// Routes protégées (modification - DIRECTEUR et SECRETAIRE)
router.post("/",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateBody(categorieValidation),
  createCategorie
);

router.put("/:id",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateParams(idValidation),
  validateBody(categorieValidation),
  updateCategorie
);

// Routes super admin (suppression - DIRECTEUR seulement)
router.delete("/:id",
  requireAuth,
  requireRole(RoleEmploye.DIRECTEUR),
  validateParams(idValidation),
  deleteCategorie
);

export default router;