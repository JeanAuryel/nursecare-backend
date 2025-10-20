"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factureController_1 = require("../controllers/factureController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Toutes les routes nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// Routes accessibles par DIRECTEUR et SECRETAIRE
router.get("/", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.getAllFactures);
router.get("/:id", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.getFactureById);
router.get("/statut/:statut", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.getFacturesByStatut);
router.get("/patient/:idPatient", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.getFacturesByPatient);
router.post("/", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.createFacture);
router.post("/:id/lignes", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.ajouterLigneFacture);
router.put("/:id/statut", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.updateStatutFacture);
router.delete("/:id", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE]), factureController_1.deleteFacture);
exports.default = router;
