import { Router } from "express";
import {
  getAllFactures,
  getFactureById,
  getFacturesByStatut,
  getFacturesByPatient,
  createFacture,
  ajouterLigneFacture,
  updateStatutFacture,
  deleteFacture
} from "../controllers/factureController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// Routes accessibles par DIRECTEUR et SECRETAIRE
router.get(
  "/",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getAllFactures
);

router.get(
  "/:id",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getFactureById
);

router.get(
  "/statut/:statut",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getFacturesByStatut
);

router.get(
  "/patient/:idPatient",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getFacturesByPatient
);

router.post(
  "/",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  createFacture
);

router.post(
  "/:id/lignes",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  ajouterLigneFacture
);

router.put(
  "/:id/statut",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  updateStatutFacture
);

router.delete(
  "/:id",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  deleteFacture
);

export default router;
