import { Request, Response } from "express";
import { Categorie, ICategorie } from "../models/categorie";

export async function createCategorie(req: Request, res: Response) {
  try {
    const { nomCategorie } = req.body;

    if (!nomCategorie) {
      return res.status(400).json({ message: "Le nom de la catégorie est requis." });
    }

    const newCategorieId = await Categorie.create({ nomCategorie });
    res.status(201).json({
      message: "Catégorie créée avec succès",
      idCategorie: newCategorieId
    });
  } catch (error) {
    console.error("Erreur création catégorie:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getAllCategories(req: Request, res: Response) {
  try {
    const categories = await Categorie.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erreur récupération catégories:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getCategorieById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idCategorie = parseInt(id);

    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: "ID catégorie invalide." });
    }

    const categorie = await Categorie.findById(idCategorie);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.status(200).json(categorie);
  } catch (error) {
    console.error("Erreur récupération catégorie:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function updateCategorie(req: Request, res: Response) {
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

    const categorieData: ICategorie = { idCategorie, nomCategorie };
    const affectedRows = await Categorie.update(categorieData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.status(200).json({ message: "Catégorie mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour catégorie:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deleteCategorie(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const idCategorie = parseInt(id);

    if (isNaN(idCategorie)) {
      return res.status(400).json({ message: "ID catégorie invalide." });
    }

    const affectedRows = await Categorie.delete(idCategorie);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Catégorie non trouvée." });
    }

    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    console.error("Erreur suppression catégorie:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}