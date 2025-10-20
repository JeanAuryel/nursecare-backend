import { Router } from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from "../controllers/patientController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Validation rules
const patientValidation = [
  { field: 'nomPatient', required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
  { field: 'prenomPatient', required: true, type: 'string' as const, minLength: 2, maxLength: 50 },
  { field: 'adressePatient', required: true, type: 'string' as const, minLength: 5, maxLength: 200 },
  { field: 'numPatient', required: true, type: 'string' as const, minLength: 10, maxLength: 15 },
  { field: 'mailPatient', required: true, type: 'email' as const, maxLength: 100 }
];

const idValidation = [
  { field: 'id', required: true, type: 'number' as const }
];

// Toutes les routes patients nécessitent une authentification
router.use(requireAuth);

// Routes de lecture (tous les rôles authentifiés)
router.get("/", getAllPatients);
router.get("/:id", validateParams(idValidation), getPatientById);

// Routes de modification (DIRECTEUR, SECRETAIRE et INFIRMIER)
router.post("/",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE, RoleEmploye.INFIRMIER]),
  validateBody(patientValidation),
  createPatient
);

router.put("/:id",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE, RoleEmploye.INFIRMIER]),
  validateParams(idValidation),
  validateBody(patientValidation),
  updatePatient
);

// Routes de suppression (DIRECTEUR seulement)
router.delete("/:id",
  requireRole([RoleEmploye.DIRECTEUR]),
  validateParams(idValidation),
  deletePatient
);

export default router;