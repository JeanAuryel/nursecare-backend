import { Request, Response } from "express";
import { Facture, StatutFacture, ModePaiement, IFacture, ILigneFacture } from "../models/facture";

/**
 * Récupérer toutes les factures
 */
export async function getAllFactures(req: Request, res: Response) {
  try {
    const factures = await Facture.getAll();
    res.status(200).json(factures);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupérer une facture par ID
 */
export async function getFactureById(req: Request, res: Response) {
  try {
    const idFacture = parseInt(req.params.id);
    const facture = await Facture.getById(idFacture);

    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    res.status(200).json(facture);
  } catch (error) {
    console.error("Erreur lors de la récupération de la facture:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupérer les factures par statut
 */
export async function getFacturesByStatut(req: Request, res: Response) {
  try {
    const { statut } = req.params;

    if (!Object.values(StatutFacture).includes(statut as StatutFacture)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const factures = await Facture.getByStatut(statut as StatutFacture);
    res.status(200).json(factures);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures par statut:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupérer les factures d'un patient
 */
export async function getFacturesByPatient(req: Request, res: Response) {
  try {
    const idPatient = parseInt(req.params.idPatient);
    const factures = await Facture.getByPatient(idPatient);
    res.status(200).json(factures);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures du patient:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Créer une nouvelle facture
 */
export async function createFacture(req: Request, res: Response) {
  try {
    const { facture, lignes } = req.body;

    // Validation
    if (!facture || !facture.idPatient) {
      return res.status(400).json({ message: "Données de facture invalides" });
    }

    // Créer la facture
    const idFacture = await Facture.create(facture);

    // Ajouter les lignes si fournies
    if (lignes && Array.isArray(lignes)) {
      for (const ligne of lignes) {
        await Facture.ajouterLigne({
          ...ligne,
          idFacture
        });
      }
    }

    // Récupérer la facture complète
    const nouvelleFacture = await Facture.getById(idFacture);

    res.status(201).json({
      message: "Facture créée avec succès",
      facture: nouvelleFacture
    });
  } catch (error) {
    console.error("Erreur lors de la création de la facture:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Ajouter une ligne à une facture existante
 */
export async function ajouterLigneFacture(req: Request, res: Response) {
  try {
    const idFacture = parseInt(req.params.id);
    const ligne: Omit<ILigneFacture, 'idLigne'> = {
      ...req.body,
      idFacture
    };

    const idLigne = await Facture.ajouterLigne(ligne);

    res.status(201).json({
      message: "Ligne ajoutée avec succès",
      idLigne
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la ligne:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Mettre à jour le statut d'une facture
 */
export async function updateStatutFacture(req: Request, res: Response) {
  try {
    const idFacture = parseInt(req.params.id);
    const { statutFacture, montantPaye, modePaiement, datePaiement } = req.body;

    if (!Object.values(StatutFacture).includes(statutFacture)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const success = await Facture.updateStatut(
      idFacture,
      statutFacture,
      montantPaye,
      modePaiement,
      datePaiement
    );

    if (!success) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    res.status(200).json({ message: "Statut mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Supprimer une facture
 */
export async function deleteFacture(req: Request, res: Response) {
  try {
    const idFacture = parseInt(req.params.id);
    const success = await Facture.delete(idFacture);

    if (!success) {
      return res.status(404).json({ message: "Facture non trouvée" });
    }

    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
