"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const employe_1 = require("../models/employe");
async function login(req, res) {
    try {
        const { mailEmploye, mdpEmploye } = req.body;
        if (!mailEmploye || !mdpEmploye) {
            return res.status(400).json({ message: "Email et mot de passe requis." });
        }
        const result = await dbconfig_1.default.query("SELECT * FROM Employe WHERE mailEmploye = $1", [mailEmploye]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }
        const employe = result.rows[0];
        // Utiliser la méthode verifyPassword qui gère les mots de passe en clair et les hache automatiquement
        const passwordMatch = await employe_1.Employe.verifyPassword(mailEmploye, mdpEmploye);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }
        // Création des tokens directement ici
        const accessToken = jsonwebtoken_1.default.sign({
            idEmploye: employe.idEmploye,
            mailEmploye: employe.mailEmploye,
            roleEmploye: employe.roleEmploye
        }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({
            idEmploye: employe.idEmploye,
            mailEmploye: employe.mailEmploye,
            roleEmploye: employe.roleEmploye
        }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' });
        res.status(200).json({
            message: "Connexion réussie",
            accessToken,
            refreshToken,
            employe: {
                id: employe.idEmploye,
                nom: employe.nomEmploye,
                prenom: employe.prenomEmploye,
                role: employe.roleEmploye
            }
        });
    }
    catch (error) {
        console.error("Erreur login:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
