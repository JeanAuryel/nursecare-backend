"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStagiaire = createStagiaire;
exports.getAllStagiaires = getAllStagiaires;
exports.getStagiaireById = getStagiaireById;
exports.updateStagiaire = updateStagiaire;
exports.deleteStagiaire = deleteStagiaire;
const stagiaire_1 = require("../models/stagiaire");
async function createStagiaire(req, res) {
    try {
        const { nomStagiaire, prenomStagiaire, idEcole } = req.body;
        if (!nomStagiaire || !prenomStagiaire || !idEcole) {
            return res.status(400).json({
                message: "Tous les champs sont requis (nom, prénom, école)."
            });
        }
        if (isNaN(idEcole)) {
            return res.status(400).json({ message: "ID école invalide." });
        }
        const stagiaireData = {
            nomStagiaire,
            prenomStagiaire,
            idEcole: parseInt(idEcole)
        };
        const newStagiaireId = await stagiaire_1.Stagiaire.create(stagiaireData);
        res.status(201).json({
            message: "Stagiaire créé avec succès",
            idStagiaire: newStagiaireId
        });
    }
    catch (error) {
        console.error("Erreur création stagiaire:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getAllStagiaires(req, res) {
    try {
        const stagiaires = await stagiaire_1.Stagiaire.getAll();
        res.status(200).json(stagiaires);
    }
    catch (error) {
        console.error("Erreur récupération stagiaires:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getStagiaireById(req, res) {
    try {
        const { id } = req.params;
        const idStagiaire = parseInt(id);
        if (isNaN(idStagiaire)) {
            return res.status(400).json({ message: "ID stagiaire invalide." });
        }
        const stagiaire = await stagiaire_1.Stagiaire.getOne(idStagiaire);
        if (!stagiaire) {
            return res.status(404).json({ message: "Stagiaire non trouvé." });
        }
        res.status(200).json(stagiaire);
    }
    catch (error) {
        console.error("Erreur récupération stagiaire:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function updateStagiaire(req, res) {
    try {
        const { id } = req.params;
        const { nomStagiaire, prenomStagiaire, idEcole } = req.body;
        const idStagiaire = parseInt(id);
        if (isNaN(idStagiaire)) {
            return res.status(400).json({ message: "ID stagiaire invalide." });
        }
        if (!nomStagiaire || !prenomStagiaire || !idEcole) {
            return res.status(400).json({
                message: "Tous les champs sont requis (nom, prénom, école)."
            });
        }
        if (isNaN(idEcole)) {
            return res.status(400).json({ message: "ID école invalide." });
        }
        const stagiaireData = {
            nomStagiaire,
            prenomStagiaire,
            idEcole: parseInt(idEcole)
        };
        const affectedRows = await stagiaire_1.Stagiaire.update(idStagiaire, stagiaireData);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Stagiaire non trouvé." });
        }
        res.status(200).json({ message: "Stagiaire mis à jour avec succès" });
    }
    catch (error) {
        console.error("Erreur mise à jour stagiaire:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function deleteStagiaire(req, res) {
    try {
        const { id } = req.params;
        const idStagiaire = parseInt(id);
        if (isNaN(idStagiaire)) {
            return res.status(400).json({ message: "ID stagiaire invalide." });
        }
        const affectedRows = await stagiaire_1.Stagiaire.delete(idStagiaire);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Stagiaire non trouvé." });
        }
        res.status(200).json({ message: "Stagiaire supprimé avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression stagiaire:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
