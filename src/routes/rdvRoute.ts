import { Router } from "express";
import {
  createRdv,
  getAllRdv,
  getRdvById,
  updateRdv,
  deleteRdv,
  getPrestationsRealisees,
  getPrestationsAFacturer,
  getPrestationsFacturees,
  marquerPrestationFacturee,
  marquerPrestationIntegrePGI,
  getPrestationById
} from "../controllers/rdvController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { validateBody, validateParams } from "../middlewares/validationMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

// Validation rules pour la création/modification
const rdvValidation = [
  { field: 'idEmploye', required: true, type: 'number' as const, min: 1 },
  { field: 'idPrestation', required: true, type: 'number' as const, min: 1 },
  { field: 'idPatient', required: true, type: 'number' as const, min: 1 },
  { field: 'idStagiaire', required: true, type: 'number' as const, min: 1 },
  { field: 'timestamp_RDV_prevu', required: true, type: 'date' as const },
  { field: 'timestamp_RDV_reel', required: false, type: 'date' as const },
  { field: 'timestamp_RDV_facture', required: false, type: 'date' as const },
  { field: 'timestamp_RDV_integrePGI', required: false, type: 'date' as const },
  { field: 'noteStagiaire', required: false, type: 'number' as const, min: 0, max: 20 },
  { field: 'commentaireStagiaire', required: false, type: 'string' as const, maxLength: 500 }
];

// Validation pour les paramètres d'URL complexes (clé composite)
const rdvParamsValidation = [
  { field: 'idEmploye', required: true, type: 'number' as const },
  { field: 'idPrestation', required: true, type: 'number' as const },
  { field: 'idPatient', required: true, type: 'number' as const },
  { field: 'idStagiaire', required: true, type: 'number' as const }
];

// Toutes les routes RDV nécessitent une authentification
router.use(requireAuth);

// Routes de lecture (tous les rôles authentifiés)
router.get("/", getAllRdv);
router.get("/:idEmploye/:idPrestation/:idPatient/:idStagiaire",
  validateParams(rdvParamsValidation),
  getRdvById
);

// Routes de création (DIRECTEUR, SECRETAIRE et INFIRMIER)
router.post("/",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE, RoleEmploye.INFIRMIER]),
  validateBody(rdvValidation),
  createRdv
);

// Routes de modification (DIRECTEUR, SECRETAIRE et INFIRMIER)
router.put("/:idEmploye/:idPrestation/:idPatient/:idStagiaire",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE, RoleEmploye.INFIRMIER]),
  validateParams(rdvParamsValidation),
  validateBody(rdvValidation),
  updateRdv
);

// Routes de suppression (DIRECTEUR seulement)
router.delete("/:idEmploye/:idPrestation/:idPatient/:idStagiaire",
  requireRole([RoleEmploye.DIRECTEUR]),
  validateParams(rdvParamsValidation),
  deleteRdv
);

// ============================================
// Routes pour les prestations réalisées
// ============================================

// Récupérer toutes les prestations réalisées
router.get("/prestations/realisees",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getPrestationsRealisees
);

// Récupérer les prestations à facturer
router.get("/prestations/a-facturer",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getPrestationsAFacturer
);

// Récupérer les prestations facturées
router.get("/prestations/facturees",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getPrestationsFacturees
);

// Récupérer une prestation par ID
router.get("/prestations/:id",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  getPrestationById
);

// Marquer une prestation comme facturée
router.put("/prestations/:id/facturer",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  marquerPrestationFacturee
);

// Marquer une prestation comme intégrée au PGI
router.put("/prestations/:id/integrer-pgi",
  requireRole([RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE]),
  marquerPrestationIntegrePGI
);

export default router;