"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFactures = getAllFactures;
exports.getFactureById = getFactureById;
exports.getFacturesByStatut = getFacturesByStatut;
exports.getFacturesByPatient = getFacturesByPatient;
exports.createFacture = createFacture;
exports.ajouterLigneFacture = ajouterLigneFacture;
exports.updateStatutFacture = updateStatutFacture;
exports.deleteFacture = deleteFacture;
const facture_1 = require("../models/facture");
/**
 * Récupérer toutes les factures
 */
async function getAllFactures(req, res) {
    try {
        const factures = await facture_1.Facture.getAll();
        res.status(200).json(factures);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des factures:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Récupérer une facture par ID
 */
async function getFactureById(req, res) {
    try {
        const idFacture = parseInt(req.params.id);
        const facture = await facture_1.Facture.getById(idFacture);
        if (!facture) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json(facture);
    }
    catch (error) {
        console.error("Erreur lors de la récupération de la facture:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Récupérer les factures par statut
 */
async function getFacturesByStatut(req, res) {
    try {
        const { statut } = req.params;
        if (!Object.values(facture_1.StatutFacture).includes(statut)) {
            return res.status(400).json({ message: "Statut invalide" });
        }
        const factures = await facture_1.Facture.getByStatut(statut);
        res.status(200).json(factures);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des factures par statut:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Récupérer les factures d'un patient
 */
async function getFacturesByPatient(req, res) {
    try {
        const idPatient = parseInt(req.params.idPatient);
        const factures = await facture_1.Facture.getByPatient(idPatient);
        res.status(200).json(factures);
    }
    catch (error) {
        console.error("Erreur lors de la récupération des factures du patient:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Créer une nouvelle facture
 */
async function createFacture(req, res) {
    try {
        const { facture, lignes } = req.body;
        // Validation
        if (!facture || !facture.idPatient) {
            return res.status(400).json({ message: "Données de facture invalides" });
        }
        // Créer la facture
        const idFacture = await facture_1.Facture.create(facture);
        // Ajouter les lignes si fournies
        if (lignes && Array.isArray(lignes)) {
            for (const ligne of lignes) {
                await facture_1.Facture.ajouterLigne({
                    ...ligne,
                    idFacture
                });
            }
        }
        // Récupérer la facture complète
        const nouvelleFacture = await facture_1.Facture.getById(idFacture);
        res.status(201).json({
            message: "Facture créée avec succès",
            facture: nouvelleFacture
        });
    }
    catch (error) {
        console.error("Erreur lors de la création de la facture:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Ajouter une ligne à une facture existante
 */
async function ajouterLigneFacture(req, res) {
    try {
        const idFacture = parseInt(req.params.id);
        const ligne = {
            ...req.body,
            idFacture
        };
        const idLigne = await facture_1.Facture.ajouterLigne(ligne);
        res.status(201).json({
            message: "Ligne ajoutée avec succès",
            idLigne
        });
    }
    catch (error) {
        console.error("Erreur lors de l'ajout de la ligne:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Mettre à jour le statut d'une facture
 */
async function updateStatutFacture(req, res) {
    try {
        const idFacture = parseInt(req.params.id);
        const { statutFacture, montantPaye, modePaiement, datePaiement } = req.body;
        if (!Object.values(facture_1.StatutFacture).includes(statutFacture)) {
            return res.status(400).json({ message: "Statut invalide" });
        }
        const success = await facture_1.Facture.updateStatut(idFacture, statutFacture, montantPaye, modePaiement, datePaiement);
        if (!success) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json({ message: "Statut mis à jour avec succès" });
    }
    catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Supprimer une facture
 */
async function deleteFacture(req, res) {
    try {
        const idFacture = parseInt(req.params.id);
        const success = await facture_1.Facture.delete(idFacture);
        if (!success) {
            return res.status(404).json({ message: "Facture non trouvée" });
        }
        res.status(200).json({ message: "Facture supprimée avec succès" });
    }
    catch (error) {
        console.error("Erreur lors de la suppression de la facture:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
