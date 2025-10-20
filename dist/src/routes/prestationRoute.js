"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prestationController_1 = require("../controllers/prestationController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Validation rules
const prestationValidation = [
    { field: 'nomPrestation', required: true, type: 'string', minLength: 2, maxLength: 100 },
    { field: 'prix_TTC', required: true, type: 'number', min: 0 },
    { field: 'idCategorie', required: true, type: 'number', min: 1 }
];
const idValidation = [
    { field: 'id', required: true, type: 'number' }
];
// Routes publiques (lecture seule)
router.get("/", prestationController_1.getAllPrestations);
router.get("/:id", (0, validationMiddleware_1.validateParams)(idValidation), prestationController_1.getPrestationById);
// Routes protégées (modification - DIRECTEUR et SECRETAIRE)
router.post("/", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), (0, validationMiddleware_1.validateBody)(prestationValidation), prestationController_1.createPrestation);
router.put("/:id", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), (0, validationMiddleware_1.validateParams)(idValidation), (0, validationMiddleware_1.validateBody)(prestationValidation), prestationController_1.updatePrestation);
// Routes super admin (suppression - DIRECTEUR seulement)
router.delete("/:id", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR), (0, validationMiddleware_1.validateParams)(idValidation), prestationController_1.deletePrestation);
exports.default = router;
