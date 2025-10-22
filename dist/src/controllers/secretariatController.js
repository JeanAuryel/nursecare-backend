"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSecretariat = getDashboardSecretariat;
exports.getRDVDuJour = getRDVDuJour;
exports.getRDVDeLaSemaine = getRDVDeLaSemaine;
exports.getRDVEmployeDuJour = getRDVEmployeDuJour;
exports.getDisponibilites = getDisponibilites;
exports.getRDVARappeler = getRDVARappeler;
exports.enregistrerPaiement = enregistrerPaiement;
exports.getFacturesEnAttente = getFacturesEnAttente;
exports.getFacturesEnRetard = getFacturesEnRetard;
exports.getHistoriquePatient = getHistoriquePatient;
exports.getFacturesImpayeesPatient = getFacturesImpayeesPatient;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const facture_1 = require("../models/facture");
// ==================== TABLEAU DE BORD SECRÉTARIAT ====================
/**
 * GET /api/secretariat/dashboard - Vue d'ensemble opérationnelle pour le secrétariat
 */
async function getDashboardSecretariat(req, res) {
    try {
        // RDV du jour
        const [rdvDuJour] = await dbconfig_1.default.query(`SELECT COUNT(*) as total
       FROM RDV
       WHERE DATE(timestamp_RDV_prevu) = CURDATE()
       AND timestamp_RDV_reel IS NULL`);
        // RDV de demain (pour rappels)
        const [rdvDemain] = await dbconfig_1.default.query(`SELECT COUNT(*) as total
       FROM RDV
       WHERE DATE(timestamp_RDV_prevu) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
       AND timestamp_RDV_reel IS NULL`);
        // Factures en attente de paiement
        const [facturesEnAttente] = await dbconfig_1.default.query(`SELECT COUNT(*) as total, COALESCE(SUM(montantTTC - COALESCE(montantPaye, 0)), 0) as montantTotal
       FROM Facture
       WHERE statutFacture IN ('ENVOYEE', 'PARTIELLE', 'IMPAYEE')`);
        // Factures impayées (en retard)
        const [facturesEnRetard] = await dbconfig_1.default.query(`SELECT COUNT(*) as total, COALESCE(SUM(montantTTC), 0) as montantTotal
       FROM Facture
       WHERE statutFacture = 'IMPAYEE'
       AND dateEcheance < CURDATE()`);
        // Prestations à facturer
        const [prestationsAFacturer] = await dbconfig_1.default.query(`SELECT COUNT(*) as total
       FROM RDV
       WHERE timestamp_RDV_reel IS NOT NULL
       AND timestamp_RDV_facture IS NULL`);
        // Patients vus cette semaine
        const [patientsSemaine] = await dbconfig_1.default.query(`SELECT COUNT(DISTINCT idPatient) as total
       FROM RDV
       WHERE timestamp_RDV_reel IS NOT NULL
       AND YEARWEEK(timestamp_RDV_reel, 1) = YEARWEEK(CURDATE(), 1)`);
        res.status(200).json({
            rdvDuJour: rdvDuJour[0].total,
            rdvDemain: rdvDemain[0].total,
            facturesEnAttente: {
                nombre: facturesEnAttente[0].total,
                montant: facturesEnAttente[0].montantTotal,
            },
            facturesEnRetard: {
                nombre: facturesEnRetard[0].total,
                montant: facturesEnRetard[0].montantTotal,
            },
            prestationsAFacturer: prestationsAFacturer[0].total,
            patientsSemaine: patientsSemaine[0].total,
        });
    }
    catch (error) {
        console.error('Erreur récupération dashboard secrétariat:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== GESTION AGENDA ====================
/**
 * GET /api/secretariat/agenda/jour?date=2025-01-15 - RDV d'un jour spécifique
 */
async function getRDVDuJour(req, res) {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const [rdv] = await dbconfig_1.default.query(`SELECT
        r.idRdv,
        r.timestamp_RDV_prevu,
        r.timestamp_RDV_reel,
        r.idEmploye,
        r.idPatient,
        e.nomEmploye,
        e.prenomEmploye,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        pr.nomPrestation,
        pr.prix_TTC,
        s.nomStagiaire,
        s.prenomStagiaire
       FROM RDV r
       INNER JOIN Employe e ON r.idEmploye = e.idEmploye
       INNER JOIN Patient p ON r.idPatient = p.idPatient
       INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
       LEFT JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
       WHERE DATE(r.timestamp_RDV_prevu) = ?
       ORDER BY r.timestamp_RDV_prevu`, [date]);
        res.status(200).json(rdv);
    }
    catch (error) {
        console.error('Erreur récupération RDV du jour:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/secretariat/agenda/semaine?date=2025-01-15 - RDV de la semaine
 */
async function getRDVDeLaSemaine(req, res) {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const [rdv] = await dbconfig_1.default.query(`SELECT
        r.idRdv,
        r.timestamp_RDV_prevu,
        r.timestamp_RDV_reel,
        r.idEmploye,
        e.nomEmploye,
        e.prenomEmploye,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        pr.nomPrestation,
        pr.prix_TTC
       FROM RDV r
       INNER JOIN Employe e ON r.idEmploye = e.idEmploye
       INNER JOIN Patient p ON r.idPatient = p.idPatient
       INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
       WHERE YEARWEEK(r.timestamp_RDV_prevu, 1) = YEARWEEK(?, 1)
       ORDER BY r.timestamp_RDV_prevu`, [date]);
        res.status(200).json(rdv);
    }
    catch (error) {
        console.error('Erreur récupération RDV de la semaine:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/secretariat/agenda/employe/:id?date=2025-01-15 - RDV d'un employé pour un jour
 */
async function getRDVEmployeDuJour(req, res) {
    try {
        const { id } = req.params;
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const [rdv] = await dbconfig_1.default.query(`SELECT
        r.idRdv,
        r.timestamp_RDV_prevu,
        r.timestamp_RDV_reel,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        p.adressePatient,
        pr.nomPrestation,
        pr.prix_TTC
       FROM RDV r
       INNER JOIN Patient p ON r.idPatient = p.idPatient
       INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
       WHERE r.idEmploye = ?
       AND DATE(r.timestamp_RDV_prevu) = ?
       ORDER BY r.timestamp_RDV_prevu`, [id, date]);
        res.status(200).json(rdv);
    }
    catch (error) {
        console.error('Erreur récupération RDV employé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/secretariat/agenda/disponibilites?date=2025-01-15&idEmploye=1 - Créneaux disponibles
 */
async function getDisponibilites(req, res) {
    try {
        const { date, idEmploye } = req.query;
        if (!date) {
            return res.status(400).json({ message: 'Date requise' });
        }
        // Récupérer tous les RDV de l'employé ce jour-là
        let query = `
      SELECT timestamp_RDV_prevu
      FROM RDV
      WHERE DATE(timestamp_RDV_prevu) = ?
    `;
        const params = [date];
        if (idEmploye) {
            query += ` AND idEmploye = $1`;
            params.push(idEmploye);
        }
        query += ` ORDER BY timestamp_RDV_prevu`;
        const [rdvExistants] = await dbconfig_1.default.query(query, params);
        // Générer les créneaux de 8h à 18h par tranches de 30 minutes
        const creneaux = [];
        const dateStr = date;
        for (let heure = 8; heure < 18; heure++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const heureStr = heure.toString().padStart(2, '0');
                const minuteStr = minute.toString().padStart(2, '0');
                const creneau = `${dateStr} ${heureStr}:${minuteStr}:00`;
                // Vérifier si le créneau est déjà pris
                const estPris = rdvExistants.some((rdv) => {
                    const rdvDate = new Date(rdv.timestamp_RDV_prevu);
                    const creneauDate = new Date(creneau);
                    return Math.abs(rdvDate.getTime() - creneauDate.getTime()) < 30 * 60 * 1000; // moins de 30 min de différence
                });
                creneaux.push({
                    creneau,
                    disponible: !estPris,
                });
            }
        }
        res.status(200).json(creneaux);
    }
    catch (error) {
        console.error('Erreur récupération disponibilités:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== RAPPELS ET CONFIRMATIONS ====================
/**
 * GET /api/secretariat/rappels/demain - RDV de demain à rappeler
 */
async function getRDVARappeler(req, res) {
    try {
        const [rdv] = await dbconfig_1.default.query(`SELECT
        r.idRdv,
        r.timestamp_RDV_prevu,
        p.idPatient,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        p.mailPatient,
        e.nomEmploye,
        e.prenomEmploye,
        pr.nomPrestation
       FROM RDV r
       INNER JOIN Patient p ON r.idPatient = p.idPatient
       INNER JOIN Employe e ON r.idEmploye = e.idEmploye
       INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
       WHERE DATE(r.timestamp_RDV_prevu) = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
       AND r.timestamp_RDV_reel IS NULL
       ORDER BY r.timestamp_RDV_prevu`);
        res.status(200).json(rdv);
    }
    catch (error) {
        console.error('Erreur récupération RDV à rappeler:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== GESTION PAIEMENTS ====================
/**
 * POST /api/secretariat/paiement/:idFacture - Enregistrer un paiement
 */
async function enregistrerPaiement(req, res) {
    try {
        const { idFacture } = req.params;
        const { montantPaye, modePaiement, datePaiement } = req.body;
        if (!montantPaye || !modePaiement) {
            return res.status(400).json({ message: 'Montant et mode de paiement requis' });
        }
        // Récupérer la facture
        const [factures] = await dbconfig_1.default.query('SELECT * FROM Facture WHERE idFacture = ?', [idFacture]);
        if (factures.length === 0) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }
        const facture = factures[0];
        const montantTotal = facture.montantTTC;
        const montantDejaRegie = facture.montantPaye || 0;
        const nouveauMontantPaye = montantDejaRegie + parseFloat(montantPaye);
        // Déterminer le nouveau statut
        let nouveauStatut;
        if (nouveauMontantPaye >= montantTotal) {
            nouveauStatut = facture_1.StatutFacture.PAYEE;
        }
        else if (nouveauMontantPaye > 0) {
            nouveauStatut = facture_1.StatutFacture.PARTIELLE;
        }
        else {
            nouveauStatut = facture.statutFacture;
        }
        // Mettre à jour la facture
        await dbconfig_1.default.query(`UPDATE Facture
       SET montantPaye = ?,
           statutFacture = ?,
           modePaiement = ?,
           datePaiement = ?,
           updatedAt = NOW()
       WHERE idFacture = ?`, [nouveauMontantPaye, nouveauStatut, modePaiement, datePaiement || new Date(), idFacture]);
        res.status(200).json({
            message: 'Paiement enregistré avec succès',
            montantPaye: nouveauMontantPaye,
            statutFacture: nouveauStatut,
        });
    }
    catch (error) {
        console.error('Erreur enregistrement paiement:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/secretariat/factures/en-attente - Factures en attente de paiement
 */
async function getFacturesEnAttente(req, res) {
    try {
        const [factures] = await dbconfig_1.default.query(`SELECT
        f.idFacture,
        f.numeroFacture,
        f.dateFacture,
        f.dateEcheance,
        f.montantTTC,
        f.montantPaye,
        f.statutFacture,
        f.modePaiement,
        p.idPatient,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        p.mailPatient,
        DATEDIFF(CURDATE(), f.dateEcheance) as joursRetard
       FROM Facture f
       INNER JOIN Patient p ON f.idPatient = p.idPatient
       WHERE f.statutFacture IN ('ENVOYEE', 'PARTIELLE', 'IMPAYEE')
       ORDER BY f.dateEcheance ASC`);
        res.status(200).json(factures);
    }
    catch (error) {
        console.error('Erreur récupération factures en attente:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/secretariat/factures/en-retard - Factures en retard (échéance dépassée)
 */
async function getFacturesEnRetard(req, res) {
    try {
        const [factures] = await dbconfig_1.default.query(`SELECT
        f.idFacture,
        f.numeroFacture,
        f.dateFacture,
        f.dateEcheance,
        f.montantTTC,
        f.montantPaye,
        f.statutFacture,
        p.idPatient,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        p.mailPatient,
        DATEDIFF(CURDATE(), f.dateEcheance) as joursRetard
       FROM Facture f
       INNER JOIN Patient p ON f.idPatient = p.idPatient
       WHERE f.statutFacture IN ('ENVOYEE', 'PARTIELLE', 'IMPAYEE')
       AND f.dateEcheance < CURDATE()
       ORDER BY f.dateEcheance ASC`);
        res.status(200).json(factures);
    }
    catch (error) {
        console.error('Erreur récupération factures en retard:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== HISTORIQUE PATIENT ====================
/**
 * GET /api/secretariat/patient/:id/historique - Historique complet d'un patient
 */
async function getHistoriquePatient(req, res) {
    try {
        const { id } = req.params;
        // Informations du patient
        const [patient] = await dbconfig_1.default.query('SELECT * FROM Patient WHERE idPatient = ?', [id]);
        if (patient.length === 0) {
            return res.status(404).json({ message: 'Patient non trouvé' });
        }
        // Historique des RDV
        const [rdv] = await dbconfig_1.default.query(`SELECT
        r.idRdv,
        r.timestamp_RDV_prevu,
        r.timestamp_RDV_reel,
        r.timestamp_RDV_facture,
        e.nomEmploye,
        e.prenomEmploye,
        pr.nomPrestation,
        pr.prix_TTC,
        s.nomStagiaire,
        s.prenomStagiaire,
        r.noteStagiaire
       FROM RDV r
       INNER JOIN Employe e ON r.idEmploye = e.idEmploye
       INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
       LEFT JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
       WHERE r.idPatient = ?
       ORDER BY r.timestamp_RDV_prevu DESC`, [id]);
        // Historique des factures
        const [factures] = await dbconfig_1.default.query(`SELECT
        f.idFacture,
        f.numeroFacture,
        f.dateFacture,
        f.dateEcheance,
        f.montantTTC,
        f.montantPaye,
        f.statutFacture,
        f.modePaiement,
        f.datePaiement
       FROM Facture f
       WHERE f.idPatient = ?
       ORDER BY f.dateFacture DESC`, [id]);
        // Statistiques
        const [stats] = await dbconfig_1.default.query(`SELECT
        COUNT(DISTINCT r.idRdv) as nombreRDV,
        COUNT(DISTINCT CASE WHEN r.timestamp_RDV_reel IS NOT NULL THEN r.idRdv END) as nombreRDVRealises,
        COUNT(DISTINCT f.idFacture) as nombreFactures,
        COALESCE(SUM(f.montantTTC), 0) as montantTotalFacture,
        COALESCE(SUM(f.montantPaye), 0) as montantTotalPaye
       FROM RDV r
       LEFT JOIN Facture f ON r.idPatient = f.idPatient
       WHERE r.idPatient = ?`, [id]);
        res.status(200).json({
            patient: patient[0],
            rdv,
            factures,
            statistiques: stats[0],
        });
    }
    catch (error) {
        console.error('Erreur récupération historique patient:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/secretariat/patient/:id/factures-impayees - Factures impayées d'un patient
 */
async function getFacturesImpayeesPatient(req, res) {
    try {
        const { id } = req.params;
        const [factures] = await dbconfig_1.default.query(`SELECT
        f.idFacture,
        f.numeroFacture,
        f.dateFacture,
        f.dateEcheance,
        f.montantTTC,
        f.montantPaye,
        f.statutFacture,
        DATEDIFF(CURDATE(), f.dateEcheance) as joursRetard
       FROM Facture f
       WHERE f.idPatient = ?
       AND f.statutFacture IN ('ENVOYEE', 'PARTIELLE', 'IMPAYEE')
       ORDER BY f.dateEcheance ASC`, [id]);
        res.status(200).json(factures);
    }
    catch (error) {
        console.error('Erreur récupération factures impayées patient:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
