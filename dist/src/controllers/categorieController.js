"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorie = createCategorie;
exports.getAllCategories = getAllCategories;
exports.getCategorieById = getCategorieById;
exports.updateCategorie = updateCategorie;
exports.deleteCategorie = deleteCategorie;
const categorie_1 = require("../models/categorie");
async function createCategorie(req, res) {
    try {
        const { nomCategorie } = req.body;
        if (!nomCategorie) {
            return res.status(400).json({ message: "Le nom de la catégorie est requis." });
        }
        const newCategorieId = await categorie_1.Categorie.create({ nomCategorie });
        res.status(201).json({
            message: "Catégorie créée avec succès",
            idCategorie: newCategorieId
        });
    }
    catch (error) {
        console.error("Erreur création catégorie:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getAllCategories(req, res) {
    try {
        const categories = await categorie_1.Categorie.findAll();
        res.status(200).json(categories);
    }
    catch (error) {
        console.error("Erreur récupération catégories:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getCategorieById(req, res) {
    try {
        const { id } = req.params;
        const idCategorie = parseInt(id);
        if (isNaN(idCategorie)) {
            return res.status(400).json({ message: "ID catégorie invalide." });
        }
        const categorie = await categorie_1.Categorie.findById(idCategorie);
        if (!categorie) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        res.status(200).json(categorie);
    }
    catch (error) {
        console.error("Erreur récupération catégorie:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function updateCategorie(req, res) {
    try {
        const { id } = req.params;
        const { nomCategorie } = req.body;
        const idCategorie = parseInt(id);
        if (isNaN(idCategorie)) {
            return res.status(400).json({ message: "ID catégorie invalide." });
        }
        if (!nomCategorie) {
            return res.status(400).json({ message: "Le nom de la catégorie est requis." });
        }
        const categorieData = { idCategorie, nomCategorie };
        const affectedRows = await categorie_1.Categorie.update(categorieData);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        res.status(200).json({ message: "Catégorie mise à jour avec succès" });
    }
    catch (error) {
        console.error("Erreur mise à jour catégorie:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function deleteCategorie(req, res) {
    try {
        const { id } = req.params;
        const idCategorie = parseInt(id);
        if (isNaN(idCategorie)) {
            return res.status(400).json({ message: "ID catégorie invalide." });
        }
        const affectedRows = await categorie_1.Categorie.delete(idCategorie);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Catégorie non trouvée." });
        }
        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression catégorie:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
