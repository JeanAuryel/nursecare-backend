"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
router.post("/login", authController_1.login);
// Exemple de route protégée par rôle
router.get("/admin-only", authMiddleware_1.requireAuth, (0, authMiddleware_1.requireRole)(employe_1.RoleEmploye.DIRECTEUR), (req, res) => {
    res.json({ message: "Bienvenue Directeur 👋" });
});
exports.default = router;
