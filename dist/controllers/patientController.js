"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPatient = createPatient;
exports.getAllPatients = getAllPatients;
exports.getPatientById = getPatientById;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;
const patient_1 = require("../models/patient");
async function createPatient(req, res) {
    try {
        const { nomPatient, prenomPatient, adressePatient, numPatient, mailPatient } = req.body;
        if (!nomPatient || !prenomPatient || !adressePatient || !numPatient || !mailPatient) {
            return res.status(400).json({
                message: "Tous les champs sont requis (nom, prénom, adresse, numéro, email)."
            });
        }
        const patientData = {
            nomPatient,
            prenomPatient,
            adressePatient,
            numPatient,
            mailPatient
        };
        const newPatientId = await patient_1.Patient.create(patientData);
        res.status(201).json({
            message: "Patient créé avec succès",
            idPatient: newPatientId
        });
    }
    catch (error) {
        console.error("Erreur création patient:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getAllPatients(req, res) {
    try {
        const patients = await patient_1.Patient.getAll();
        res.status(200).json(patients);
    }
    catch (error) {
        console.error("Erreur récupération patients:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function getPatientById(req, res) {
    try {
        const { id } = req.params;
        const idPatient = parseInt(id);
        if (isNaN(idPatient)) {
            return res.status(400).json({ message: "ID patient invalide." });
        }
        const patient = await patient_1.Patient.getOne(idPatient);
        if (!patient) {
            return res.status(404).json({ message: "Patient non trouvé." });
        }
        res.status(200).json(patient);
    }
    catch (error) {
        console.error("Erreur récupération patient:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function updatePatient(req, res) {
    try {
        const { id } = req.params;
        const { nomPatient, prenomPatient, adressePatient, numPatient, mailPatient } = req.body;
        const idPatient = parseInt(id);
        if (isNaN(idPatient)) {
            return res.status(400).json({ message: "ID patient invalide." });
        }
        if (!nomPatient || !prenomPatient || !adressePatient || !numPatient || !mailPatient) {
            return res.status(400).json({
                message: "Tous les champs sont requis (nom, prénom, adresse, numéro, email)."
            });
        }
        const patientData = {
            nomPatient,
            prenomPatient,
            adressePatient,
            numPatient,
            mailPatient
        };
        const affectedRows = await patient_1.Patient.update(idPatient, patientData);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Patient non trouvé." });
        }
        res.status(200).json({ message: "Patient mis à jour avec succès" });
    }
    catch (error) {
        console.error("Erreur mise à jour patient:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
async function deletePatient(req, res) {
    try {
        const { id } = req.params;
        const idPatient = parseInt(id);
        if (isNaN(idPatient)) {
            return res.status(400).json({ message: "ID patient invalide." });
        }
        const affectedRows = await patient_1.Patient.delete(idPatient);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Patient non trouvé." });
        }
        res.status(200).json({ message: "Patient supprimé avec succès" });
    }
    catch (error) {
        console.error("Erreur suppression patient:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
