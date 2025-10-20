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
        if (!token)
            return res.status(401).json({ message: "Non authentifié" });
        const payload = jsonwebtoken_1.default.verify(token, getAccessSecret());
        req.user = payload;
        next();
    }
    catch (_b) {
        return res.status(401).json({ message: "Jeton invalide ou expiré" });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Non authentifié" });
        if (!roles.includes(req.user.roleEmploye)) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    };
}
