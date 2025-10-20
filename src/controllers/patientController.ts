import { Request, Response } from "express";
import { Patient, IPatient } from "../models/patient";

export async function createPatient(req: Request, res: Response) {
  try {
    const { nomPatient, prenomPatient, adressePatient, numPatient, mailPatient } = req.body;

    if (!nomPatient || !prenomPatient || !adressePatient || !numPatient || !mailPatient) {
      return res.status(400).json({
        message: "Tous les champs sont requis (nom, prénom, adresse, numéro, email)."
      });
    }

    const patientData: IPatient = {
      nomPatient,
      prenomPatient,
      adressePatient,
      numPatient,
      mailPatient
    };

    const newPatientId = await Patient.create(patientData);
    res.status(201).json({
      message: "Patient créé avec succès",
      idPatient: newPatientId
    });
  } catch (error) {
    console.error("Erreur création patient:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getAllPatients(req: Request, res: Response) {
  try {
    const patients = await Patient.getAll();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Erreur récupération patients:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getPatientById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idPatient = parseInt(id);

    if (isNaN(idPatient)) {
      return res.status(400).json({ message: "ID patient invalide." });
    }

    const patient = await Patient.getOne(idPatient);

    if (!patient) {
      return res.status(404).json({ message: "Patient non trouvé." });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("Erreur récupération patient:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function updatePatient(req: Request, res: Response) {
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

    const patientData: IPatient = {
      nomPatient,
      prenomPatient,
      adressePatient,
      numPatient,
      mailPatient
    };

    const affectedRows = await Patient.update(idPatient, patientData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Patient non trouvé." });
    }

    res.status(200).json({ message: "Patient mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour patient:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deletePatient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idPatient = parseInt(id);

    if (isNaN(idPatient)) {
      return res.status(400).json({ message: "ID patient invalide." });
    }

    const affectedRows = await Patient.delete(idPatient);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Patient non trouvé." });
    }

    res.status(200).json({ message: "Patient supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression patient:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}