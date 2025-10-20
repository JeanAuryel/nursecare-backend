"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statsController_1 = require("../controllers/statsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Toutes les routes de statistiques nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// Toutes les routes de statistiques sont réservées au DIRECTEUR
router.use((0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR));
// ==================== DASHBOARD ====================
// GET /api/stats/dashboard - Vue d'ensemble complète
router.get('/dashboard', statsController_1.getDashboardStats);
// ==================== STATISTIQUES FINANCIÈRES ====================
// GET /api/stats/financier/global - Stats financières globales
router.get('/financier/global', statsController_1.getFinancierGlobal);
// GET /api/stats/financier/mensuel?annee=2025 - CA mensuel
router.get('/financier/mensuel', statsController_1.getCAMensuel);
// GET /api/stats/financier/par-employe - CA par employé
router.get('/financier/par-employe', statsController_1.getCAParEmploye);
// ==================== STATISTIQUES RENDEZ-VOUS ====================
// GET /api/stats/rdv/global - Stats globales des RDV
router.get('/rdv/global', statsController_1.getRDVGlobal);
// GET /api/stats/rdv/par-jour?debut=2025-01-01&fin=2025-01-31 - RDV par jour
router.get('/rdv/par-jour', statsController_1.getRDVParJour);
// GET /api/stats/rdv/par-mois?annee=2025 - RDV par mois
router.get('/rdv/par-mois', statsController_1.getRDVParMois);
// GET /api/stats/rdv/par-employe?debut=2025-01-01&fin=2025-01-31 - RDV par employé
router.get('/rdv/par-employe', statsController_1.getRDVParEmploye);
// GET /api/stats/rdv/employe/:id/par-jour?debut=2025-01-01&fin=2025-01-31 - RDV d'un employé par jour
router.get('/rdv/employe/:id/par-jour', statsController_1.getRDVEmployeParJour);
// ==================== STATISTIQUES PATIENTS ====================
// GET /api/stats/patients/global - Stats globales des patients
router.get('/patients/global', statsController_1.getPatientsGlobal);
// GET /api/stats/patients/nouveaux?annee=2025 - Nouveaux patients par mois
router.get('/patients/nouveaux', statsController_1.getNouveauxPatientsParMois);
// GET /api/stats/patients/top?limit=10 - Top patients
router.get('/patients/top', statsController_1.getTopPatients);
// ==================== STATISTIQUES PRESTATIONS ====================
// GET /api/stats/prestations/populaires?limit=10 - Prestations les plus populaires
router.get('/prestations/populaires', statsController_1.getPrestationsPopulaires);
// ==================== STATISTIQUES EMPLOYÉS ====================
// GET /api/stats/employes/performance - Performance de tous les employés
router.get('/employes/performance', statsController_1.getPerformanceEmployes);
// GET /api/stats/employes/:id/detaille - Stats détaillées d'un employé
router.get('/employes/:id/detaille', statsController_1.getStatsEmployeDetaille);
exports.default = router;
