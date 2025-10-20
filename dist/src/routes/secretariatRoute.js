"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const secretariatController_1 = require("../controllers/secretariatController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Toutes les routes du secrétariat nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// Toutes les routes sont accessibles aux DIRECTEUR et SECRETAIRE
router.use((0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE));
// ==================== DASHBOARD ====================
// GET /api/secretariat/dashboard - Vue d'ensemble opérationnelle
router.get('/dashboard', secretariatController_1.getDashboardSecretariat);
// ==================== AGENDA ====================
// GET /api/secretariat/agenda/jour?date=2025-01-15 - RDV du jour
router.get('/agenda/jour', secretariatController_1.getRDVDuJour);
// GET /api/secretariat/agenda/semaine?date=2025-01-15 - RDV de la semaine
router.get('/agenda/semaine', secretariatController_1.getRDVDeLaSemaine);
// GET /api/secretariat/agenda/employe/:id?date=2025-01-15 - RDV d'un employé
router.get('/agenda/employe/:id', secretariatController_1.getRDVEmployeDuJour);
// GET /api/secretariat/agenda/disponibilites?date=2025-01-15&idEmploye=1 - Créneaux disponibles
router.get('/agenda/disponibilites', secretariatController_1.getDisponibilites);
// ==================== RAPPELS ====================
// GET /api/secretariat/rappels/demain - RDV de demain à rappeler
router.get('/rappels/demain', secretariatController_1.getRDVARappeler);
// ==================== PAIEMENTS ====================
// POST /api/secretariat/paiement/:idFacture - Enregistrer un paiement
router.post('/paiement/:idFacture', secretariatController_1.enregistrerPaiement);
// GET /api/secretariat/factures/en-attente - Factures en attente
router.get('/factures/en-attente', secretariatController_1.getFacturesEnAttente);
// GET /api/secretariat/factures/en-retard - Factures en retard
router.get('/factures/en-retard', secretariatController_1.getFacturesEnRetard);
// ==================== HISTORIQUE PATIENT ====================
// GET /api/secretariat/patient/:id/historique - Historique complet
router.get('/patient/:id/historique', secretariatController_1.getHistoriquePatient);
// GET /api/secretariat/patient/:id/factures-impayees - Factures impayées
router.get('/patient/:id/factures-impayees', secretariatController_1.getFacturesImpayeesPatient);
exports.default = router;
