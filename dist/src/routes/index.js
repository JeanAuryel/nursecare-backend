"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoute_1 = __importDefault(require("./authRoute"));
const categorieRoute_1 = __importDefault(require("./categorieRoute"));
const ecoleRoute_1 = __importDefault(require("./ecoleRoute"));
const patientRoute_1 = __importDefault(require("./patientRoute"));
const prestationRoute_1 = __importDefault(require("./prestationRoute"));
const stagiaireRoute_1 = __importDefault(require("./stagiaireRoute"));
const rdvRoute_1 = __importDefault(require("./rdvRoute"));
const factureRoute_1 = __importDefault(require("./factureRoute"));
const employeRoute_1 = __importDefault(require("./employeRoute"));
const statsRoute_1 = __importDefault(require("./statsRoute"));
const secretariatRoute_1 = __importDefault(require("./secretariatRoute"));
const router = (0, express_1.Router)();
// Configuration des routes principales
router.use("/auth", authRoute_1.default);
router.use("/categories", categorieRoute_1.default);
router.use("/ecoles", ecoleRoute_1.default);
router.use("/patients", patientRoute_1.default);
router.use("/prestations", prestationRoute_1.default);
router.use("/stagiaires", stagiaireRoute_1.default);
router.use("/rdv", rdvRoute_1.default);
router.use("/factures", factureRoute_1.default);
router.use("/employes", employeRoute_1.default);
router.use("/stats", statsRoute_1.default);
router.use("/secretariat", secretariatRoute_1.default);
// Route de santé de l'API
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "API NurseCare opérationnelle",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});
// Route par défaut
router.get("/", (req, res) => {
    res.status(200).json({
        message: "Bienvenue sur l'API NurseCare",
        version: "1.0.0",
        endpoints: {
            auth: "/api/auth",
            categories: "/api/categories",
            ecoles: "/api/ecoles",
            patients: "/api/patients",
            prestations: "/api/prestations",
            stagiaires: "/api/stagiaires",
            rdv: "/api/rdv",
            factures: "/api/factures",
            employes: "/api/employes",
            stats: "/api/stats",
            secretariat: "/api/secretariat",
            health: "/api/health"
        }
    });
});
exports.default = router;
