"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
async function login(req, res) {
    try {
        const { mailEmploye, mdpEmploye } = req.body;
        if (!mailEmploye || !mdpEmploye) {
            return res.status(400).json({ message: "Email et mot de passe requis." });
        }
        const [rows] = await dbconfig_1.default.execute("SELECT * FROM employe WHERE mailEmploye = ?", [mailEmploye]);
        const employes = rows;
        if (employes.length === 0) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }
        const employe = employes[0];
        const passwordMatch = await bcrypt_1.default.compare(mdpEmploye, employe.mdpEmploye);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Identifiants invalides." });
        }
        // Création des tokens directement ici
        const accessToken = jsonwebtoken_1.default.sign({
            idEmploye: employe.idEmploye,
            roleEmploye: employe.roleEmploye
        }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({
            idEmploye: employe.idEmploye,
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
