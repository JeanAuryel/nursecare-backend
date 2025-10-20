import { Router } from 'express';
import {
  getAllEmployes,
  getEmployeByEmail,
  createEmploye,
  updateEmploye,
  getEmployesByRole,
} from '../controllers/employeController';
import { requireAuth, requireRole } from '../middlewares/authMiddleware';
import { RoleEmploye } from '../models/employe';

const router = Router();

// Toutes les routes employés nécessitent une authentification
router.use(requireAuth);

// GET /api/employes - Récupérer tous les employés (DIRECTEUR et SECRETAIRE)
router.get('/', requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE), getAllEmployes);

// GET /api/employes/role/:role - Récupérer les employés par rôle (DIRECTEUR et SECRETAIRE)
router.get('/role/:role', requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE), getEmployesByRole);

// GET /api/employes/:email - Récupérer un employé par email (tous les rôles authentifiés)
router.get('/:email', getEmployeByEmail);

// POST /api/employes - Créer un nouvel employé (DIRECTEUR et SECRETAIRE)
router.post('/', requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE), createEmploye);

// PUT /api/employes/:email - Mettre à jour un employé (DIRECTEUR et SECRETAIRE)
router.put('/:email', requireRole(RoleEmploye.DIRECTEUR, RoleEmploye.SECRETAIRE), updateEmploye);

export default router;
