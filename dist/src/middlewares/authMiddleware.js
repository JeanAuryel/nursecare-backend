"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAccessSecret = () => process.env.JWT_ACCESS_SECRET;
function requireAuth(req, res, next) {
    var _a;
    try {
        const auth = req.headers.authorization;
        const bearer = (auth === null || auth === void 0 ? void 0 : auth.startsWith("Bearer ")) ? auth.slice(7) : undefined;
        const cookieToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        const token = bearer || cookieToken;
        console.log(`🔐 [AUTH] ${req.method} ${req.path}`, {
            hasAuthHeader: !!auth,
            hasBearer: !!bearer,
            hasCookieToken: !!cookieToken,
            hasToken: !!token
        });
        if (!token) {
            console.log(`❌ [AUTH] Pas de token pour ${req.path}`);
            return res.status(401).json({ message: "Non authentifié" });
        }
        const payload = jsonwebtoken_1.default.verify(token, getAccessSecret());
        req.user = payload;
        console.log(`✅ [AUTH] Token valide pour ${req.path}:`, {
            userId: payload.idEmploye,
            role: payload.roleEmploye
        });
        next();
    }
    catch (error) {
        console.log(`❌ [AUTH] Token invalide pour ${req.path}:`, error instanceof Error ? error.message : error);
        return res.status(401).json({ message: "Jeton invalide ou expiré" });
    }
}
function requireRole(roles) {
    return (req, res, next) => {
        var _a;
        console.log(`🔒 [ROLE] Vérification rôle pour ${req.path}:`, {
            requiredRoles: roles,
            userRole: (_a = req.user) === null || _a === void 0 ? void 0 : _a.roleEmploye,
            hasAccess: req.user ? roles.includes(req.user.roleEmploye) : false
        });
        if (!req.user) {
            console.log(`❌ [ROLE] Pas d'utilisateur authentifié pour ${req.path}`);
            return res.status(401).json({ message: "Non authentifié" });
        }
        if (!roles.includes(req.user.roleEmploye)) {
            console.log(`❌ [ROLE] Accès refusé pour ${req.path}: rôle ${req.user.roleEmploye} non autorisé`);
            return res.status(403).json({ message: "Accès refusé" });
        }
        console.log(`✅ [ROLE] Accès autorisé pour ${req.path}`);
        next();
    };
}
