import { Router } from 'express';
import {
  // Dashboard
  getDashboardStats,

  // Financier
  getFinancierGlobal,
  getCAMensuel,
  getCAParEmploye,

  // RDV
  getRDVGlobal,
  getRDVParJour,
  getRDVParMois,
  getRDVParEmploye,
  getRDVEmployeParJour,

  // Patients
  getPatientsGlobal,
  getNouveauxPatientsParMois,
  getTopPatients,

  // Prestations
  getPrestationsPopulaires,

  // Employés
  getPerformanceEmployes,
  getStatsEmployeDetaille,
} from '../controllers/statsController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { RoleEmploye } from '../models/employe';

const router = Router();

// Toutes les routes de statistiques nécessitent une authentification
router.use(requireAuth);

// Toutes les routes de statistiques sont réservées au DIRECTEUR
router.use(requireRole(RoleEmploye.DIRECTEUR));

// ==================== DASHBOARD ====================
// GET /api/stats/dashboard - Vue d'ensemble complète
router.get('/dashboard', getDashboardStats);

// ==================== STATISTIQUES FINANCIÈRES ====================
// GET /api/stats/financier/global - Stats financières globales
router.get('/financier/global', getFinancierGlobal);

// GET /api/stats/financier/mensuel?annee=2025 - CA mensuel
router.get('/financier/mensuel', getCAMensuel);

// GET /api/stats/financier/par-employe - CA par employé
router.get('/financier/par-employe', getCAParEmploye);

// ==================== STATISTIQUES RENDEZ-VOUS ====================
// GET /api/stats/rdv/global - Stats globales des RDV
router.get('/rdv/global', getRDVGlobal);

// GET /api/stats/rdv/par-jour?debut=2025-01-01&fin=2025-01-31 - RDV par jour
router.get('/rdv/par-jour', getRDVParJour);

// GET /api/stats/rdv/par-mois?annee=2025 - RDV par mois
router.get('/rdv/par-mois', getRDVParMois);

// GET /api/stats/rdv/par-employe?debut=2025-01-01&fin=2025-01-31 - RDV par employé
router.get('/rdv/par-employe', getRDVParEmploye);

// GET /api/stats/rdv/employe/:id/par-jour?debut=2025-01-01&fin=2025-01-31 - RDV d'un employé par jour
router.get('/rdv/employe/:id/par-jour', getRDVEmployeParJour);

// ==================== STATISTIQUES PATIENTS ====================
// GET /api/stats/patients/global - Stats globales des patients
router.get('/patients/global', getPatientsGlobal);

// GET /api/stats/patients/nouveaux?annee=2025 - Nouveaux patients par mois
router.get('/patients/nouveaux', getNouveauxPatientsParMois);

// GET /api/stats/patients/top?limit=10 - Top patients
router.get('/patients/top', getTopPatients);

// ==================== STATISTIQUES PRESTATIONS ====================
// GET /api/stats/prestations/populaires?limit=10 - Prestations les plus populaires
router.get('/prestations/populaires', getPrestationsPopulaires);

// ==================== STATISTIQUES EMPLOYÉS ====================
// GET /api/stats/employes/performance - Performance de tous les employés
router.get('/employes/performance', getPerformanceEmployes);

// GET /api/stats/employes/:id/detaille - Stats détaillées d'un employé
router.get('/employes/:id/detaille', getStatsEmployeDetaille);

export default router;
