import { Request, Response } from "express";
import { Rdv, IRdv } from "../models/rdv";

export async function createRdv(req: Request, res: Response) {
  try {
    const {
      idEmploye,
      idPrestation,
      idPatient,
      idStagiaire,
      timestamp_RDV_prevu,
      timestamp_RDV_reel,
      timestamp_RDV_facture,
      timestamp_RDV_integrePGI,
      noteStagiaire,
      commentaireStagiaire
    } = req.body;

    if (!idEmploye || !idPrestation || !idPatient || !idStagiaire || !timestamp_RDV_prevu) {
      return res.status(400).json({
        message: "Les champs requis sont : employé, prestation, patient, stagiaire et date prévue."
      });
    }

    const rdvData: IRdv = {
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

    await Rdv.create(rdvData);
    res.status(201).json({
      message: "Rendez-vous créé avec succès"
    });
  } catch (error) {
    console.error("Erreur création rdv:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getAllRdv(req: Request, res: Response) {
  try {
    const rdvs = await Rdv.getAll();
    res.status(200).json(rdvs);
  } catch (error) {
    console.error("Erreur récupération rdv:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function getRdvById(req: Request, res: Response) {
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

    const rdv = await Rdv.getOne(
      parsedIds.idEmploye,
      parsedIds.idPrestation,
      parsedIds.idPatient,
      parsedIds.idStagiaire
    );

    if (!rdv) {
      return res.status(404).json({ message: "Rendez-vous non trouvé." });
    }

    res.status(200).json(rdv);
  } catch (error) {
    console.error("Erreur récupération rdv:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function updateRdv(req: Request, res: Response) {
  try {
    const { idEmploye, idPrestation, idPatient, idStagiaire } = req.params;
    const {
      timestamp_RDV_prevu,
      timestamp_RDV_reel,
      timestamp_RDV_facture,
      timestamp_RDV_integrePGI,
      noteStagiaire,
      commentaireStagiaire
    } = req.body;

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

    const rdvData: IRdv = {
      ...parsedIds,
      timestamp_RDV_prevu: new Date(timestamp_RDV_prevu),
      timestamp_RDV_reel: timestamp_RDV_reel ? new Date(timestamp_RDV_reel) : null,
      timestamp_RDV_facture: timestamp_RDV_facture ? new Date(timestamp_RDV_facture) : null,
      timestamp_RDV_integrePGI: timestamp_RDV_integrePGI ? new Date(timestamp_RDV_integrePGI) : null,
      noteStagiaire: noteStagiaire ? parseInt(noteStagiaire) : null,
      commentaireStagiaire: commentaireStagiaire || null
    };

    const affectedRows = await Rdv.update(rdvData);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Rendez-vous non trouvé." });
    }

    res.status(200).json({ message: "Rendez-vous mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur mise à jour rdv:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deleteRdv(req: Request, res: Response) {
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

    const affectedRows = await Rdv.delete(
      parsedIds.idEmploye,
      parsedIds.idPrestation,
      parsedIds.idPatient,
      parsedIds.idStagiaire
    );

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Rendez-vous non trouvé." });
    }

    res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression rdv:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

/**
 * Récupérer toutes les prestations réalisées
 */
export async function getPrestationsRealisees(req: Request, res: Response) {
  try {
    const prestations = await Rdv.getPrestationsRealisees();
    res.status(200).json(prestations);
  } catch (error) {
    console.error("Erreur récupération prestations réalisées:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupérer les prestations à facturer
 */
export async function getPrestationsAFacturer(req: Request, res: Response) {
  try {
    const prestations = await Rdv.getPrestationsAFacturer();
    res.status(200).json(prestations);
  } catch (error) {
    console.error("Erreur récupération prestations à facturer:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupérer les prestations facturées
 */
export async function getPrestationsFacturees(req: Request, res: Response) {
  try {
    const prestations = await Rdv.getPrestationsFacturees();
    res.status(200).json(prestations);
  } catch (error) {
    console.error("Erreur récupération prestations facturées:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Marquer une prestation comme facturée
 */
export async function marquerPrestationFacturee(req: Request, res: Response) {
  try {
    const idRdv = parseInt(req.params.id);

    if (isNaN(idRdv)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const success = await Rdv.marquerFacturee(idRdv);

    if (!success) {
      return res.status(404).json({ message: "Prestation non trouvée" });
    }

    res.status(200).json({ message: "Prestation marquée comme facturée" });
  } catch (error) {
    console.error("Erreur marquage facturée:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Marquer une prestation comme intégrée au PGI
 */
export async function marquerPrestationIntegrePGI(req: Request, res: Response) {
  try {
    const idRdv = parseInt(req.params.id);

    if (isNaN(idRdv)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const success = await Rdv.marquerIntegrePGI(idRdv);

    if (!success) {
      return res.status(404).json({ message: "Prestation non trouvée" });
    }

    res.status(200).json({ message: "Prestation marquée comme intégrée au PGI" });
  } catch (error) {
    console.error("Erreur marquage intégré PGI:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

/**
 * Récupérer une prestation par ID
 */
export async function getPrestationById(req: Request, res: Response) {
  try {
    const idRdv = parseInt(req.params.id);

    if (isNaN(idRdv)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const prestation = await Rdv.getById(idRdv);

    if (!prestation) {
      return res.status(404).json({ message: "Prestation non trouvée" });
    }

    res.status(200).json(prestation);
  } catch (error) {
    console.error("Erreur récupération prestation:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}