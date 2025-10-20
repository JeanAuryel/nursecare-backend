import { Request, Response } from 'express';
import { Employe, IEmploye, RoleEmploye } from '../models/employe';
import { AuthRequest } from '../middlewares/authMiddleware';

// GET /api/employes - Récupérer tous les employés
export async function getAllEmployes(req: Request, res: Response) {
  try {
    const employes = await Employe.getAll();

    // Ne pas renvoyer les mots de passe
    const employesSafe = employes.map((emp) => ({
      idEmploye: emp.idEmploye,
      nomEmploye: emp.nomEmploye,
      prenomEmploye: emp.prenomEmploye,
      mailEmploye: emp.mailEmploye,
      roleEmploye: emp.roleEmploye,
    }));

    res.status(200).json(employesSafe);
  } catch (error) {
    console.error('Erreur récupération employés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// GET /api/employes/:email - Récupérer un employé par email
export async function getEmployeByEmail(req: AuthRequest, res: Response) {
  try {
    const { email } = req.params;
    const employe = await Employe.findByEmail(email);

    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Les infirmiers ne peuvent voir que leurs propres informations
    const userRole = req.user?.roleEmploye;
    const userEmail = req.user?.mailEmploye;

    if (userRole === RoleEmploye.INFIRMIER && userEmail !== email) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Ne pas renvoyer le mot de passe
    const employeSafe = {
      idEmploye: employe.idEmploye,
      nomEmploye: employe.nomEmploye,
      prenomEmploye: employe.prenomEmploye,
      mailEmploye: employe.mailEmploye,
      roleEmploye: employe.roleEmploye,
    };

    res.status(200).json(employeSafe);
  } catch (error) {
    console.error('Erreur récupération employé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// POST /api/employes - Créer un nouvel employé
export async function createEmploye(req: Request, res: Response) {
  try {
    const { nomEmploye, prenomEmploye, mailEmploye, mdpEmploye, roleEmploye } = req.body;

    if (!nomEmploye || !prenomEmploye || !mailEmploye || !mdpEmploye || !roleEmploye) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier que le rôle est valide
    if (!Object.values(RoleEmploye).includes(roleEmploye)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    // Vérifier si l'email existe déjà
    const existingEmploye = await Employe.findByEmail(mailEmploye);
    if (existingEmploye) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const email = await Employe.create({
      nomEmploye,
      prenomEmploye,
      mailEmploye,
      mdpEmploye,
      roleEmploye,
    });

    res.status(201).json({
      message: 'Employé créé avec succès',
      mailEmploye: email,
    });
  } catch (error) {
    console.error('Erreur création employé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// PUT /api/employes/:email - Mettre à jour un employé
export async function updateEmploye(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const updates: Partial<IEmploye> = req.body;

    // Vérifier que l'employé existe
    const employe = await Employe.findByEmail(email);
    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    // Ne pas permettre de changer l'email ou le rôle via cette route
    delete (updates as any).mailEmploye;
    delete (updates as any).roleEmploye;
    delete (updates as any).idEmploye;

    const success = await Employe.update(email, updates);

    if (!success) {
      return res.status(400).json({ message: 'Aucune modification effectuée' });
    }

    res.status(200).json({ message: 'Employé mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur mise à jour employé:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

// GET /api/employes/role/:role - Récupérer les employés par rôle
export async function getEmployesByRole(req: Request, res: Response) {
  try {
    const { role } = req.params;

    // Vérifier que le rôle est valide
    if (!Object.values(RoleEmploye).includes(role as RoleEmploye)) {
      return res.status(400).json({ message: 'Rôle invalide' });
    }

    const employes = await Employe.getAll();
    const employesByRole = employes.filter((emp) => emp.roleEmploye === role);

    // Ne pas renvoyer les mots de passe
    const employesSafe = employesByRole.map((emp) => ({
      idEmploye: emp.idEmploye,
      nomEmploye: emp.nomEmploye,
      prenomEmploye: emp.prenomEmploye,
      mailEmploye: emp.mailEmploye,
      roleEmploye: emp.roleEmploye,
    }));

    res.status(200).json(employesSafe);
  } catch (error) {
    console.error('Erreur récupération employés par rôle:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
