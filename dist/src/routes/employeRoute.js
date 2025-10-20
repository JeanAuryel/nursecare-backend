"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeController_1 = require("../controllers/employeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Toutes les routes employés nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// GET /api/employes - Récupérer tous les employés (DIRECTEUR et SECRETAIRE)
router.get('/', (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), employeController_1.getAllEmployes);
// GET /api/employes/role/:role - Récupérer les employés par rôle (DIRECTEUR et SECRETAIRE)
router.get('/role/:role', (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), employeController_1.getEmployesByRole);
// GET /api/employes/:email - Récupérer un employé par email (tous les rôles authentifiés)
router.get('/:email', employeController_1.getEmployeByEmail);
// POST /api/employes - Créer un nouvel employé (DIRECTEUR et SECRETAIRE)
router.post('/', (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), employeController_1.createEmploye);
// PUT /api/employes/:email - Mettre à jour un employé (DIRECTEUR et SECRETAIRE)
router.put('/:email', (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE), employeController_1.updateEmploye);
exports.default = router;
