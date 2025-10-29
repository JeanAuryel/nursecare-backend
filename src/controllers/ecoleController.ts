import { Request, Response } from "express";
import { Ecole, IEcole } from "../models/ecole";

export async function createEcole(req: Request, res: Response) {
  try {
    const { nomEcole, adresseEcole, telephoneEcole, mailEcole } = req.body;

    if (!nomEcole) {
      return res.status(400).json({ message: "Le nom de l'école est requis." });
    }

    const ecoleData: Omit<IEcole, 'idEcole'> = {
      nomEcole,
      adresseEcole,
      telephoneEcole,
      mailEcole
    };

    const newEcole = await Ecole.create(ecoleData);
    res.status(201).json({
      message: "École créée avec succès",
      ecole: newEcole
    });
  } catch (error) {
    console.error("Erreur création école:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getAllEcoles(req: Request, res: Response) {
  try {
    const withStagiaires = req.query.withStagiaires === 'true';

    const ecoles = withStagiaires
      ? await Ecole.getAllWithStagiaires()
      : await Ecole.getAll();

    res.status(200).json(ecoles);
  } catch (error) {
    console.error("Erreur récupération écoles:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getEcoleById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idEcole = parseInt(id);

    if (isNaN(idEcole)) {
      return res.status(400).json({ message: "ID école invalide." });
    }

    const ecole = await Ecole.getOne(idEcole);

    if (!ecole) {
      return res.status(404).json({ message: "École non trouvée." });
    }

    res.status(200).json(ecole);
  } catch (error) {
    console.error("Erreur récupération école:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function updateEcole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nomEcole, adresseEcole, telephoneEcole, mailEcole } = req.body;
    const idEcole = parseInt(id);

    if (isNaN(idEcole)) {
      return res.status(400).json({ message: "ID école invalide." });
    }

    const ecoleData: Partial<IEcole> = {};
    if (nomEcole !== undefined) ecoleData.nomEcole = nomEcole;
    if (adresseEcole !== undefined) ecoleData.adresseEcole = adresseEcole;
    if (telephoneEcole !== undefined) ecoleData.telephoneEcole = telephoneEcole;
    if (mailEcole !== undefined) ecoleData.mailEcole = mailEcole;

    const updatedEcole = await Ecole.update(idEcole, ecoleData);

    if (!updatedEcole) {
      return res.status(404).json({ message: "École non trouvée." });
    }

    res.status(200).json({
      message: "École mise à jour avec succès",
      ecole: updatedEcole
    });
  } catch (error) {
    console.error("Erreur mise à jour école:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deleteEcole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idEcole = parseInt(id);

    if (isNaN(idEcole)) {
      return res.status(400).json({ message: "ID école invalide." });
    }

    const success = await Ecole.delete(idEcole);

    if (!success) {
      return res.status(404).json({ message: "École non trouvée." });
    }

    res.status(200).json({ message: "École supprimée avec succès" });
  } catch (error: any) {
    console.error("Erreur suppression école:", error);
    if (error.message?.includes('stagiaires actifs')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}