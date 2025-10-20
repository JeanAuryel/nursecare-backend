import { Router } from "express";
import {
  createStagiaire,
  getAllStagiaires,
  getStagiaireById,
  updateStagiaire,
  deleteStagiaire
} from "../controllers/stagiaireController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Validation rules
const stagiaireValidation = [
  { field: 'nomStagiaire', required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
  { field: 'prenomStagiaire', required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
  { field: 'idEcole', required: true, type: 'number' as const, min: 1 }
];

const idValidation = [
  { field: 'id', required: true, type: 'number' as const }
];

// Toutes les routes stagiaires nécessitent une authentification
router.use(requireAuth);

// Routes de lecture (tous les rôles authentifiés)
router.get("/", getAllStagiaires);
router.get("/:id", validateParams(idValidation), getStagiaireById);

// Routes de modification (DIRECTEUR et SECRETAIRE)
router.post("/",
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateBody(stagiaireValidation),
  createStagiaire
);

router.put("/:id",
  requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE),
  validateParams(idValidation),
  validateBody(stagiaireValidation),
  updateStagiaire
);

// Routes de suppression (DIRECTEUR seulement)
router.delete("/:id",
  requireRole(RoleEmploye.DIRECTEUR),
  validateParams(idValidation),
  deleteStagiaire
);

export default router;