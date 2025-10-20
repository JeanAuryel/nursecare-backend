"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEcole = createEcole;
exports.getAllEcoles = getAllEcoles;
exports.getEcoleById = getEcoleById;
exports.updateEcole = updateEcole;
exports.deleteEcole = deleteEcole;
const ecole_1 = require("../models/ecole");
async function createEcole(req, res) {
    try {
        const { nomEcole } = req.body;
        if (!nomEcole) {
            return res.status(400).json({ message: "Le nom de l'école est requis." });
        }
        const newEcole = await ecole_1.Ecole.create(nomEcole);
        res.status(201).json({
            message: "École créée avec succès",
            ecole: newEcole
        });
    }
    catch (error) {
        console.error("Erreur création école:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getAllEcoles(req, res) {
    try {
        const ecoles = await ecole_1.Ecole.getAll();
        res.status(200).json(ecoles);
    }
    catch (error) {
        console.error("Erreur récupération écoles:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getEcoleById(req, res) {
    try {
        const { id } = req.params;
        const idEcole = parseInt(id);
        if (isNaN(idEcole)) {
            return res.status(400).json({ message: "ID école invalide." });
        }
        const ecole = await ecole_1.Ecole.getOne(idEcole);
        if (!ecole) {
            return res.status(404).json({ message: "École non trouvée." });
        }
        res.status(200).json(ecole);
    }
    catch (error) {
        console.error("Erreur récupération école:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function updateEcole(req, res) {
    try {
        const { id } = req.params;
        const { nomEcole } = req.body;
        const idEcole = parseInt(id);
        if (isNaN(idEcole)) {
            return res.status(400).json({ message: "ID école invalide." });
        }
        if (!nomEcole) {
            return res.status(400).json({ message: "Le nom de l'école est requis." });
        }
        const updatedEcole = await ecole_1.Ecole.update(idEcole, nomEcole);
        if (!updatedEcole) {
            return res.status(404).json({ message: "École non trouvée." });
        }
        res.status(200).json({
            message: "École mise à jour avec succès",
            ecole: updatedEcole
        });
    }
    catch (error) {
        console.error("Erreur mise à jour école:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function deleteEcole(req, res) {
    try {
        const { id } = req.params;
        const idEcole = parseInt(id);
        if (isNaN(idEcole)) {
            return res.status(400).json({ message: "ID école invalide." });
        }
        const affectedRows = await ecole_1.Ecole.delete(idEcole);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "École non trouvée." });
        }
        res.status(200).json({ message: "École supprimée avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression école:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
