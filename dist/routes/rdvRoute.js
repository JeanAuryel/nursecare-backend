"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rdvController_1 = require("../controllers/rdvController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Validation rules pour la création/modification
const rdvValidation = [
    { field: 'idEmploye', required: true, type: 'number', min: 1 },
    { field: 'idPrestation', required: true, type: 'number', min: 1 },
    { field: 'idPatient', required: true, type: 'number', min: 1 },
    { field: 'idStagiaire', required: true, type: 'number', min: 1 },
    { field: 'timestamp_RDV_prevu', required: true, type: 'date' },
    { field: 'timestamp_RDV_reel', required: false, type: 'date' },
    { field: 'timestamp_RDV_facture', required: false, type: 'date' },
    { field: 'timestamp_RDV_integrePGI', required: false, type: 'date' },
    { field: 'noteStagiaire', required: false, type: 'number', min: 0, max: 20 },
    { field: 'commentaireStagiaire', required: false, type: 'string', maxLength: 500 }
];
// Validation pour les paramètres d'URL complexes (clé composite)
const rdvParamsValidation = [
    { field: 'idEmploye', required: true, type: 'number' },
    { field: 'idPrestation', required: true, type: 'number' },
    { field: 'idPatient', required: true, type: 'number' },
    { field: 'idStagiaire', required: true, type: 'number' }
];
// Toutes les routes RDV nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// Routes de lecture (tous les rôles authentifiés)
router.get("/", rdvController_1.getAllRdv);
router.get("/:idEmploye/:idPrestation/:idPatient/:idStagiaire", (0, validationMiddleware_1.validateParams)(rdvParamsValidation), rdvController_1.getRdvById);
// Routes de création (DIRECTEUR, SECRETAIRE et INFIRMIER)
router.post("/", (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE, employe_1.RoleEmploye.INFIRMIER), (0, validationMiddleware_1.validateBody)(rdvValidation), rdvController_1.createRdv);
// Routes de modification (DIRECTEUR, SECRETAIRE et INFIRMIER)
router.put("/:idEmploye/:idPrestation/:idPatient/:idStagiaire", (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE, employe_1.RoleEmploye.INFIRMIER), (0, validationMiddleware_1.validateParams)(rdvParamsValidation), (0, validationMiddleware_1.validateBody)(rdvValidation), rdvController_1.updateRdv);
// Routes de suppression (DIRECTEUR seulement)
router.delete("/:idEmploye/:idPrestation/:idPatient/:idStagiaire", (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR), (0, validationMiddleware_1.validateParams)(rdvParamsValidation), rdvController_1.deleteRdv);
exports.default = router;
