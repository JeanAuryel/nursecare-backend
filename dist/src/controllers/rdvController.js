"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRdv = createRdv;
exports.getAllRdv = getAllRdv;
exports.getRdvById = getRdvById;
exports.updateRdv = updateRdv;
exports.deleteRdv = deleteRdv;
exports.getPrestationsRealisees = getPrestationsRealisees;
exports.getPrestationsAFacturer = getPrestationsAFacturer;
exports.getPrestationsFacturees = getPrestationsFacturees;
exports.marquerPrestationFacturee = marquerPrestationFacturee;
exports.marquerPrestationIntegrePGI = marquerPrestationIntegrePGI;
exports.getPrestationById = getPrestationById;
const rdv_1 = require("../models/rdv");
async function createRdv(req, res) {
    try {
        const { idEmploye, idPrestation, idPatient, idStagiaire, timestamp_RDV_prevu, timestamp_RDV_reel, timestamp_RDV_facture, timestamp_RDV_integrePGI, noteStagiaire, commentaireStagiaire } = req.body;
        if (!idEmploye || !idPrestation || !idPatient || !idStagiaire || !timestamp_RDV_prevu) {
            return res.status(400).json({
                message: "Les champs requis sont : employé, prestation, patient, stagiaire et date prévue."
            });
        }
        const rdvData = {
            idEmploye: parseInt(idEmploye),
            idPrestation: parseInt(idPrestation),
            idPatient: parseInt(idPatient),
            idStagiaire: parseInt(idStagiaire),
            timestamp_RDV_prevu: new Date(timestamp_RDV_prevu),
            timestamp_RDV_reel: timestamp_RDV_reel ? new Date(timestamp_RDV_reel) : null,
            timestamp_RDV_facture: timestamp_RDV_facture ? new Date(timestamp_RDV_facture) : null,
            timestamp_RDV_integrePGI: timestamp_RDV_integrePGI ? new Date(timestamp_RDV_integrePGI) : null,
            noteStagiaire: noteStagiaire ? parseInt(noteStagiaire) : null,
            commentaireStagiaire: commentaireStagiaire || null
        };
        await rdv_1.Rdv.create(rdvData);
        res.status(201).json({
            message: "Rendez-vous créé avec succès"
        });
    }
    catch (error) {
        console.error("Erreur création rdv:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getAllRdv(req, res) {
    try {
        const rdvs = await rdv_1.Rdv.getAll();
        res.status(200).json(rdvs);
    }
    catch (error) {
        console.error("Erreur récupération rdv:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getRdvById(req, res) {
    try {
        const { idEmploye, idPrestation, idPatient, idStagiaire } = req.params;
        const parsedIds = {
            idEmploye: parseInt(idEmploye),
            idPrestation: parseInt(idPrestation),
            idPatient: parseInt(idPatient),
            idStagiaire: parseInt(idStagiaire)
        };
        if (Object.values(parsedIds).some(id => isNaN(id))) {
            return res.status(400).json({ message: "IDs invalides." });
        }
        const rdv = await rdv_1.Rdv.getOne(parsedIds.idEmploye, parsedIds.idPrestation, parsedIds.idPatient, parsedIds.idStagiaire);
        if (!rdv) {
            return res.status(404).json({ message: "Rendez-vous non trouvé." });
        }
        res.status(200).json(rdv);
    }
    catch (error) {
        console.error("Erreur récupération rdv:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function updateRdv(req, res) {
    try {
        const { idEmploye, idPrestation, idPatient, idStagiaire } = req.params;
        const { timestamp_RDV_prevu, timestamp_RDV_reel, timestamp_RDV_facture, timestamp_RDV_integrePGI, noteStagiaire, commentaireStagiaire } = req.body;
        const parsedIds = {
            idEmploye: parseInt(idEmploye),
            idPrestation: parseInt(idPrestation),
            idPatient: parseInt(idPatient),
            idStagiaire: parseInt(idStagiaire)
        };
        if (Object.values(parsedIds).some(id => isNaN(id))) {
            return res.status(400).json({ message: "IDs invalides." });
        }
        if (!timestamp_RDV_prevu) {
            return res.status(400).json({ message: "La date prévue est requise." });
        }
        const rdvData = {
            ...parsedIds,
            timestamp_RDV_prevu: new Date(timestamp_RDV_prevu),
            timestamp_RDV_reel: timestamp_RDV_reel ? new Date(timestamp_RDV_reel) : null,
            timestamp_RDV_facture: timestamp_RDV_facture ? new Date(timestamp_RDV_facture) : null,
            timestamp_RDV_integrePGI: timestamp_RDV_integrePGI ? new Date(timestamp_RDV_integrePGI) : null,
            noteStagiaire: noteStagiaire ? parseInt(noteStagiaire) : null,
            commentaireStagiaire: commentaireStagiaire || null
        };
        const affectedRows = await rdv_1.Rdv.update(rdvData);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Rendez-vous non trouvé." });
        }
        res.status(200).json({ message: "Rendez-vous mis à jour avec succès" });
    }
    catch (error) {
        console.error("Erreur mise à jour rdv:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function deleteRdv(req, res) {
    try {
        const { idEmploye, idPrestation, idPatient, idStagiaire } = req.params;
        const parsedIds = {
            idEmploye: parseInt(idEmploye),
            idPrestation: parseInt(idPrestation),
            idPatient: parseInt(idPatient),
            idStagiaire: parseInt(idStagiaire)
        };
        if (Object.values(parsedIds).some(id => isNaN(id))) {
            return res.status(400).json({ message: "IDs invalides." });
        }
        const affectedRows = await rdv_1.Rdv.delete(parsedIds.idEmploye, parsedIds.idPrestation, parsedIds.idPatient, parsedIds.idStagiaire);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Rendez-vous non trouvé." });
        }
        res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression rdv:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
/**
 * Récupérer toutes les prestations réalisées
 */
async function getPrestationsRealisees(req, res) {
    try {
        const prestations = await rdv_1.Rdv.getPrestationsRealisees();
        res.status(200).json(prestations);
    }
    catch (error) {
        console.error("Erreur récupération prestations réalisées:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Récupérer les prestations à facturer
 */
async function getPrestationsAFacturer(req, res) {
    try {
        const prestations = await rdv_1.Rdv.getPrestationsAFacturer();
        res.status(200).json(prestations);
    }
    catch (error) {
        console.error("Erreur récupération prestations à facturer:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Récupérer les prestations facturées
 */
async function getPrestationsFacturees(req, res) {
    try {
        const prestations = await rdv_1.Rdv.getPrestationsFacturees();
        res.status(200).json(prestations);
    }
    catch (error) {
        console.error("Erreur récupération prestations facturées:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Marquer une prestation comme facturée
 */
async function marquerPrestationFacturee(req, res) {
    try {
        const idRdv = parseInt(req.params.id);
        if (isNaN(idRdv)) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const success = await rdv_1.Rdv.marquerFacturee(idRdv);
        if (!success) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }
        res.status(200).json({ message: "Prestation marquée comme facturée" });
    }
    catch (error) {
        console.error("Erreur marquage facturée:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Marquer une prestation comme intégrée au PGI
 */
async function marquerPrestationIntegrePGI(req, res) {
    try {
        const idRdv = parseInt(req.params.id);
        if (isNaN(idRdv)) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const success = await rdv_1.Rdv.marquerIntegrePGI(idRdv);
        if (!success) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }
        res.status(200).json({ message: "Prestation marquée comme intégrée au PGI" });
    }
    catch (error) {
        console.error("Erreur marquage intégré PGI:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
/**
 * Récupérer une prestation par ID
 */
async function getPrestationById(req, res) {
    try {
        const idRdv = parseInt(req.params.id);
        if (isNaN(idRdv)) {
            return res.status(400).json({ message: "ID invalide" });
        }
        const prestation = await rdv_1.Rdv.getById(idRdv);
        if (!prestation) {
            return res.status(404).json({ message: "Prestation non trouvée" });
        }
        res.status(200).json(prestation);
    }
    catch (error) {
        console.error("Erreur récupération prestation:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}
