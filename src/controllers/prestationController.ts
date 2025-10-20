import { Request, Response } from "express";
import { Prestation, IPrestation } from "../models/prestation";

export async function createPrestation(req: Request, res: Response) {
  try {
    const { nomPrestation, prix_TTC, idCategorie } = req.body;

    if (!nomPrestation || prix_TTC === undefined || !idCategorie) {
      return res.status(400).json({
        message: "Tous les champs sont requis (nom, prix TTC, catégorie)."
      });
    }

    if (isNaN(prix_TTC) || prix_TTC < 0) {
      return res.status(400).json({ message: "Le prix TTC doit être un nombre positif." });
    }

    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: "ID catégorie invalide." });
    }

    const prestationData: IPrestation = {
      nomPrestation,
      prix_TTC: parseFloat(prix_TTC),
      idCategorie: parseInt(idCategorie)
    };

    const newPrestationId = await Prestation.create(prestationData);
    res.status(201).json({
      message: "Prestation créée avec succès",
      idPrestation: newPrestationId
    });
  } catch (error) {
    console.error("Erreur création prestation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getAllPrestations(req: Request, res: Response) {
  try {
    const prestations = await Prestation.getAll();
    res.status(200).json(prestations);
  } catch (error) {
    console.error("Erreur récupération prestations:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getPrestationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idPrestation = parseInt(id);

    if (isNaN(idPrestation)) {
      return res.status(400).json({ message: "ID prestation invalide." });
    }

    const prestation = await Prestation.getOne(idPrestation);

    if (!prestation) {
      return res.status(404).json({ message: "Prestation non trouvée." });
    }

    res.status(200).json(prestation);
  } catch (error) {
    console.error("Erreur récupération prestation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function updatePrestation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { nomPrestation, prix_TTC, idCategorie } = req.body;
    const idPrestation = parseInt(id);

    if (isNaN(idPrestation)) {
      return res.status(400).json({ message: "ID prestation invalide." });
    }

    if (!nomPrestation || prix_TTC === undefined || !idCategorie) {
      return res.status(400).json({
        message: "Tous les champs sont requis (nom, prix TTC, catégorie)."
      });
    }

    if (isNaN(prix_TTC) || prix_TTC < 0) {
      return res.status(400).json({ message: "Le prix TTC doit être un nombre positif." });
    }

    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: "ID catégorie invalide." });
    }

    const prestationData: IPrestation = {
      nomPrestation,
      prix_TTC: parseFloat(prix_TTC),
      idCategorie: parseInt(idCategorie)
    };

    const affectedRows = await Prestation.update(idPrestation, prestationData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Prestation non trouvée." });
    }

    res.status(200).json({ message: "Prestation mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour prestation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deletePrestation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idPrestation = parseInt(id);

    if (isNaN(idPrestation)) {
      return res.status(400).json({ message: "ID prestation invalide." });
    }

    const affectedRows = await Prestation.delete(idPrestation);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Prestation non trouvée." });
    }

    res.status(200).json({ message: "Prestation supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression prestation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}