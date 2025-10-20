import { Router } from "express";
import authRoute from "./authRoute";
import categorieRoute from "./categorieRoute";
import ecoleRoute from "./ecoleRoute";
import patientRoute from "./patientRoute";
import prestationRoute from "./prestationRoute";
import stagiaireRoute from "./stagiaireRoute";
import rdvRoute from "./rdvRoute";
import factureRoute from "./factureRoute";
import employeRoute from "./employeRoute";
import statsRoute from "./statsRoute";
import secretariatRoute from "./secretariatRoute";

const router = Router();

// Configuration des routes principales
router.use("/auth", authRoute);
router.use("/categories", categorieRoute);
router.use("/ecoles", ecoleRoute);
router.use("/patients", patientRoute);
router.use("/prestations", prestationRoute);
router.use("/stagiaires", stagiaireRoute);
router.use("/rdv", rdvRoute);
router.use("/factures", factureRoute);
router.use("/employes", employeRoute);
router.use("/stats", statsRoute);
router.use("/secretariat", secretariatRoute);

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

export default router;