"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stagiaireController_1 = require("../controllers/stagiaireController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Validation rules
const stagiaireValidation = [
    { field: 'nomStagiaire', required: true, type: 'string', minLength: 2, maxLength: 50 },
    { field: 'prenomStagiaire', required: true, type: 'string', minLength: 2, maxLength: 50 },
    { field: 'idEcole', required: true, type: 'number', min: 1 }
];
const idValidation = [
    { field: 'id', required: true, type: 'number' }
];
// Toutes les routes stagiaires nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// Routes de lecture (tous les rôles authentifiés)
router.get("/", stagiaireController_1.getAllStagiaires);
router.get("/:id", (0, validationMiddleware_1.validateParams)(idValidation), stagiaireController_1.getStagiaireById);
// Routes de modification (DIRECTEUR et SECRETAIRE)
router.post("/", (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), (0, validationMiddleware_1.validateBody)(stagiaireValidation), stagiaireController_1.createStagiaire);
router.put("/:id", (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), (0, validationMiddleware_1.validateParams)(idValidation), (0, validationMiddleware_1.validateBody)(stagiaireValidation), stagiaireController_1.updateStagiaire);
// Routes de suppression (DIRECTEUR seulement)
router.delete("/:id", (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR), (0, validationMiddleware_1.validateParams)(idValidation), stagiaireController_1.deleteStagiaire);
exports.default = router;
