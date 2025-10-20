"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controllers/patientController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const employe_1 = require("../models/employe");
const router = (0, express_1.Router)();
// Validation rules
const patientValidation = [
    { field: 'nomPatient', required: true, type: 'string', minLength: 2, maxLength: 50 },
    { field: 'prenomPatient', required: true, type: 'string', minLength: 2, maxLength: 50 },
    { field: 'adressePatient', required: true, type: 'string', minLength: 5, maxLength: 200 },
    { field: 'numPatient', required: true, type: 'string', minLength: 10, maxLength: 15 },
    { field: 'mailPatient', required: true, type: 'email', maxLength: 100 }
];
const idValidation = [
    { field: 'id', required: true, type: 'number' }
];
// Toutes les routes patients nécessitent une authentification
router.use(authMiddleware_1.requireAuth);
// Routes de lecture (tous les rôles authentifiés)
router.get("/", patientController_1.getAllPatients);
router.get("/:id", (0, validationMiddleware_1.validateParams)(idValidation), patientController_1.getPatientById);
// Routes de modification (DIRECTEUR, SECRETAIRE et INFIRMIER)
router.post("/", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE, employe_1.RoleEmploye.INFIRMIER]), (0, validationMiddleware_1.validateBody)(patientValidation), patientController_1.createPatient);
router.put("/:id", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR, employe_1.RoleEmploye.SECRETAIRE, employe_1.RoleEmploye.INFIRMIER]), (0, validationMiddleware_1.validateParams)(idValidation), (0, validationMiddleware_1.validateBody)(patientValidation), patientController_1.updatePatient);
// Routes de suppression (DIRECTEUR seulement)
router.delete("/:id", (0, authMiddleware_1.requireRole)([employe_1.RoleEmploye.DIRECTEUR]), (0, validationMiddleware_1.validateParams)(idValidation), patientController_1.deletePatient);
exports.default = router;
