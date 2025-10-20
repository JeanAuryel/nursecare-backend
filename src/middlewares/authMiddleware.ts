import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RoleEmploye } from "../models/employe";

export interface JwtPayload {
  idEmploye: number;
  mailEmploye: string;
  roleEmploye: RoleEmploye;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET as string;

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
    const cookieToken = (req as any).cookies?.accessToken as string | undefined;
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

    const payload = jwt.verify(token, getAccessSecret()) as JwtPayload;
    req.user = payload;
    console.log(`✅ [AUTH] Token valide pour ${req.path}:`, {
      userId: payload.idEmploye,
      role: payload.roleEmploye
    });
    next();
  } catch (error) {
    console.log(`❌ [AUTH] Token invalide pour ${req.path}:`, error instanceof Error ? error.message : error);
    return res.status(401).json({ message: "Jeton invalide ou expiré" });
  }
}

export function requireRole(roles: RoleEmploye[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log(`🔒 [ROLE] Vérification rôle pour ${req.path}:`, {
      requiredRoles: roles,
      userRole: req.user?.roleEmploye,
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
