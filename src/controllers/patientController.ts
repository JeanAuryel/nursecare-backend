import { Request, Response } from "express";
import { Patient, IPatient } from "../models/patient";

export async function createPatient(req: Request, res: Response) {
  try {
    const { nomPatient, prenomPatient, adressePatient, codePostalPatient, villePatient, telephonePatient, mailPatient, numSecuriteSociale } = req.body;

    if (!nomPatient || !prenomPatient || !adressePatient || !telephonePatient) {
      return res.status(400).json({
        message: "Les champs nom, prénom, adresse et téléphone sont requis."
      });
    }

    const patientData: Omit<IPatient, 'idPatient'> = {
      nomPatient,
      prenomPatient,
      adressePatient,
      codePostalPatient,
      villePatient,
      telephonePatient,
      mailPatient,
      numSecuriteSociale
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
    const { nomPatient, prenomPatient, adressePatient, codePostalPatient, villePatient, telephonePatient, mailPatient, numSecuriteSociale } = req.body;
    const idPatient = parseInt(id);

    if (isNaN(idPatient)) {
      return res.status(400).json({ message: "ID patient invalide." });
    }

    const patientData: Partial<IPatient> = {};
    if (nomPatient !== undefined) patientData.nomPatient = nomPatient;
    if (prenomPatient !== undefined) patientData.prenomPatient = prenomPatient;
    if (adressePatient !== undefined) patientData.adressePatient = adressePatient;
    if (codePostalPatient !== undefined) patientData.codePostalPatient = codePostalPatient;
    if (villePatient !== undefined) patientData.villePatient = villePatient;
    if (telephonePatient !== undefined) patientData.telephonePatient = telephonePatient;
    if (mailPatient !== undefined) patientData.mailPatient = mailPatient;
    if (numSecuriteSociale !== undefined) patientData.numSecuriteSociale = numSecuriteSociale;

    const success = await Patient.update(idPatient, patientData);

    if (!success) {
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

    const success = await Patient.delete(idPatient);

    if (!success) {
      return res.status(404).json({ message: "Patient non trouvé." });
    }

    res.status(200).json({ message: "Patient supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression patient:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}