"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEmployes = getAllEmployes;
exports.getEmployeByEmail = getEmployeByEmail;
exports.createEmploye = createEmploye;
exports.updateEmploye = updateEmploye;
exports.getEmployesByRole = getEmployesByRole;
const employe_1 = require("../models/employe");
// GET /api/employes - Récupérer tous les employés
async function getAllEmployes(req, res) {
    try {
        const employes = await employe_1.Employe.getAll();
        // Ne pas renvoyer les mots de passe
        const employesSafe = employes.map((emp) => ({
            idEmploye: emp.idEmploye,
            nomEmploye: emp.nomEmploye,
            prenomEmploye: emp.prenomEmploye,
            mailEmploye: emp.mailEmploye,
            roleEmploye: emp.roleEmploye,
        }));
        res.status(200).json(employesSafe);
    }
    catch (error) {
        console.error('Erreur récupération employés:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// GET /api/employes/:email - Récupérer un employé par email
async function getEmployeByEmail(req, res) {
    var _a, _b;
    try {
        const { email } = req.params;
        const employe = await employe_1.Employe.findByEmail(email);
        if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        // Les infirmiers ne peuvent voir que leurs propres informations
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.roleEmploye;
        const userEmail = (_b = req.user) === null || _b === void 0 ? void 0 : _b.mailEmploye;
        if (userRole === employe_1.RoleEmploye.INFIRMIER && userEmail !== email) {
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
    }
    catch (error) {
        console.error('Erreur récupération employé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// POST /api/employes - Créer un nouvel employé
async function createEmploye(req, res) {
    try {
        const { nomEmploye, prenomEmploye, mailEmploye, mdpEmploye, roleEmploye } = req.body;
        if (!nomEmploye || !prenomEmploye || !mailEmploye || !mdpEmploye || !roleEmploye) {
            return res.status(400).json({ message: 'Tous les champs sont requis' });
        }
        // Vérifier que le rôle est valide
        if (!Object.values(employe_1.RoleEmploye).includes(roleEmploye)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        // Vérifier si l'email existe déjà
        const existingEmploye = await employe_1.Employe.findByEmail(mailEmploye);
        if (existingEmploye) {
            return res.status(409).json({ message: 'Cet email est déjà utilisé' });
        }
        const email = await employe_1.Employe.create({
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
    }
    catch (error) {
        console.error('Erreur création employé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// PUT /api/employes/:email - Mettre à jour un employé
async function updateEmploye(req, res) {
    try {
        const { email } = req.params;
        const updates = req.body;
        // Vérifier que l'employé existe
        const employe = await employe_1.Employe.findByEmail(email);
        if (!employe) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        // Ne pas permettre de changer l'email ou le rôle via cette route
        delete updates.mailEmploye;
        delete updates.roleEmploye;
        delete updates.idEmploye;
        const success = await employe_1.Employe.update(email, updates);
        if (!success) {
            return res.status(400).json({ message: 'Aucune modification effectuée' });
        }
        res.status(200).json({ message: 'Employé mis à jour avec succès' });
    }
    catch (error) {
        console.error('Erreur mise à jour employé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// GET /api/employes/role/:role - Récupérer les employés par rôle
async function getEmployesByRole(req, res) {
    try {
        const { role } = req.params;
        // Vérifier que le rôle est valide
        if (!Object.values(employe_1.RoleEmploye).includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        const employes = await employe_1.Employe.getAll();
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
    }
    catch (error) {
        console.error('Erreur récupération employés par rôle:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
