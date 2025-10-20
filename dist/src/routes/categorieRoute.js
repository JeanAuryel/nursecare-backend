"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categorieController_1 = require("../controllers/categorieController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Validation rules
const categorieValidation = [
    { field: 'nomCategorie', required: true, type: 'string', minLength: 2, maxLength: 100 }
];
const idValidation = [
    { field: 'id', required: true, type: 'number' }
];
// Routes publiques (lecture seule)
router.get("/", categorieController_1.getAllCategories);
router.get("/:id", (0, validationMiddleware_1.validateParams)(idValidation), categorieController_1.getCategorieById);
// Routes protégées (modification - DIRECTEUR et SECRETAIRE)
router.post("/", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), (0, validationMiddleware_1.validateBody)(categorieValidation), categorieController_1.createCategorie);
router.put("/:id", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), (0, validationMiddleware_1.validateParams)(idValidation), (0, validationMiddleware_1.validateBody)(categorieValidation), categorieController_1.updateCategorie);
// Routes super admin (suppression - DIRECTEUR seulement)
router.delete("/:id", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR), (0, validationMiddleware_1.validateParams)(idValidation), categorieController_1.deleteCategorie);
exports.default = router;
