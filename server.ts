// server.ts
import dotenv from "dotenv";
dotenv.config(); // Charge les variables .env au tout début

import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./src/routes/index";
import { errorHandler } from "./src/middlewares/errorMiddleware";

const app: Application = express();

// Configuration CORS pour développement et production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL || '']
  : ["http://localhost:5173", "http://localhost:5174"];

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true })); // autorise le frontend
app.use(express.json()); // parse le JSON
app.use(cookieParser()); // permet de lire les cookies

// Route racine
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 API NurseCare en marche !");
});

// Toutes les routes API
app.use("/api", routes);

// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorHandler);

// Lancement du serveur
// AlwaysData fournit PORT et IP via les variables d'environnement
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.IP || '::'; // IPv6 pour AlwaysData

app.listen(PORT, HOST, () => {
  console.log(`✅ Serveur démarré sur ${HOST}:${PORT}`);
  console.log(`📍 API disponible sur ${HOST}:${PORT}/api`);
  console.log(`🏥 Endpoints disponibles :`);
  console.log(`   - Auth:        /api/auth`);
  console.log(`   - Catégories:  /api/categories`);
  console.log(`   - Écoles:      /api/ecoles`);
  console.log(`   - Patients:    /api/patients`);
  console.log(`   - Prestations: /api/prestations`);
  console.log(`   - Stagiaires:  /api/stagiaires`);
  console.log(`   - RDV:         /api/rdv`);
  console.log(`   - Factures:    /api/factures`);
  console.log(`   - Employés:    /api/employes`);
  console.log(`   - Stats:       /api/stats`);
  console.log(`   - Secrétariat: /api/secretariat`);
  console.log(`   - Health:      /api/health`);
});
