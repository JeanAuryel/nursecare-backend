import { Router } from "express";
import { login } from "../controllers/authController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";
import { RoleEmploye } from "../models/employe";

const router = Router();

router.post("/login", login);

// Exemple de route protégée par rôle
router.get("/admin-only", requireAuth, requireRole(RoleEmploye.DIRECTEUR), (req, res) => {
  res.json({ message: "Bienvenue Directeur 👋" });
});

export default router;
