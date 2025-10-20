import { Request, Response } from "express";
import { Stagiaire, IStagiaire, IStagiaireDetailed } from "../models/stagiaire";

export async function createStagiaire(req: Request, res: Response) {
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

    const stagiaireData: IStagiaire = {
      nomStagiaire,
      prenomStagiaire,
      idEcole: parseInt(idEcole)
    };

    const newStagiaireId = await Stagiaire.create(stagiaireData);
    res.status(201).json({
      message: "Stagiaire créé avec succès",
      idStagiaire: newStagiaireId
    });
  } catch (error) {
    console.error("Erreur création stagiaire:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getAllStagiaires(req: Request, res: Response) {
  try {
    const stagiaires = await Stagiaire.getAll();
    res.status(200).json(stagiaires);
  } catch (error) {
    console.error("Erreur récupération stagiaires:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getStagiaireById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const detailed = req.query.detailed === 'true';
    const idStagiaire = parseInt(id);

    if (isNaN(idStagiaire)) {
      return res.status(400).json({ message: "ID stagiaire invalide." });
    }

    const stagiaire = detailed
      ? await Stagiaire.getOneDetailed(idStagiaire)
      : await Stagiaire.getOne(idStagiaire);

    if (!stagiaire) {
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    }

    res.status(200).json(stagiaire);
  } catch (error) {
    console.error("Erreur récupération stagiaire:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function updateStagiaire(req: Request, res: Response) {
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

    const stagiaireData: IStagiaire = {
      nomStagiaire,
      prenomStagiaire,
      idEcole: parseInt(idEcole)
    };

    const affectedRows = await Stagiaire.update(idStagiaire, stagiaireData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    }

    res.status(200).json({ message: "Stagiaire mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour stagiaire:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deleteStagiaire(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idStagiaire = parseInt(id);

    if (isNaN(idStagiaire)) {
      return res.status(400).json({ message: "ID stagiaire invalide." });
    }

    const affectedRows = await Stagiaire.delete(idStagiaire);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Stagiaire non trouvé." });
    }

    res.status(200).json({ message: "Stagiaire supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression stagiaire:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}