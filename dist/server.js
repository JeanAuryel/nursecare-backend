"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Charge les variables .env au tout début
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./src/routes/index"));
const errorMiddleware_1 = require("./src/middlewares/errorMiddleware");
const app = (0, express_1.default)();
// Configuration CORS pour développement et production
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL || '']
    : ["http://localhost:5173", "http://localhost:5174"];
// Middleware
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true })); // autorise le frontend
app.use(express_1.default.json()); // parse le JSON
app.use((0, cookie_parser_1.default)()); // permet de lire les cookies
// Route racine
app.get("/", (req, res) => {
    res.send("🚀 API NurseCare en marche !");
});
// Toutes les routes API
app.use("/api", index_1.default);
// Middleware de gestion d'erreurs (doit être en dernier)
app.use(errorMiddleware_1.errorHandler);
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
