import { Router } from 'express';
import {
  // Dashboard
  getDashboardSecretariat,

  // Agenda
  getRDVDuJour,
  getRDVDeLaSemaine,
  getRDVEmployeDuJour,
  getDisponibilites,

  // Rappels
  getRDVARappeler,

  // Paiements
  enregistrerPaiement,
  getFacturesEnAttente,
  getFacturesEnRetard,

  // Historique patient
  getHistoriquePatient,
  getFacturesImpayeesPatient,
} from '../controllers/secretariatController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { RoleEmploye } from '../models/employe';

const router = Router();

// Toutes les routes du secrétariat nécessitent une authentification
router.use(requireAuth);

// Toutes les routes sont accessibles aux DIRECTEUR et SECRETAIRE
router.use(requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE));

// ==================== DASHBOARD ====================
// GET /api/secretariat/dashboard - Vue d'ensemble opérationnelle
router.get('/dashboard', getDashboardSecretariat);

// ==================== AGENDA ====================
// GET /api/secretariat/agenda/jour?date=2025-01-15 - RDV du jour
router.get('/agenda/jour', getRDVDuJour);

// GET /api/secretariat/agenda/semaine?date=2025-01-15 - RDV de la semaine
router.get('/agenda/semaine', getRDVDeLaSemaine);

// GET /api/secretariat/agenda/employe/:id?date=2025-01-15 - RDV d'un employé
router.get('/agenda/employe/:id', getRDVEmployeDuJour);

// GET /api/secretariat/agenda/disponibilites?date=2025-01-15&idEmploye=1 - Créneaux disponibles
router.get('/agenda/disponibilites', getDisponibilites);

// ==================== RAPPELS ====================
// GET /api/secretariat/rappels/demain - RDV de demain à rappeler
router.get('/rappels/demain', getRDVARappeler);

// ==================== PAIEMENTS ====================
// POST /api/secretariat/paiement/:idFacture - Enregistrer un paiement
router.post('/paiement/:idFacture', enregistrerPaiement);

// GET /api/secretariat/factures/en-attente - Factures en attente
router.get('/factures/en-attente', getFacturesEnAttente);

// GET /api/secretariat/factures/en-retard - Factures en retard
router.get('/factures/en-retard', getFacturesEnRetard);

// ==================== HISTORIQUE PATIENT ====================
// GET /api/secretariat/patient/:id/historique - Historique complet
router.get('/patient/:id/historique', getHistoriquePatient);

// GET /api/secretariat/patient/:id/factures-impayees - Factures impayées
router.get('/patient/:id/factures-impayees', getFacturesImpayeesPatient);

export default router;
