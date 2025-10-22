"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
exports.getFinancierGlobal = getFinancierGlobal;
exports.getCAMensuel = getCAMensuel;
exports.getCAParEmploye = getCAParEmploye;
exports.getRDVGlobal = getRDVGlobal;
exports.getRDVParJour = getRDVParJour;
exports.getRDVParMois = getRDVParMois;
exports.getRDVParEmploye = getRDVParEmploye;
exports.getRDVEmployeParJour = getRDVEmployeParJour;
exports.getPatientsGlobal = getPatientsGlobal;
exports.getNouveauxPatientsParMois = getNouveauxPatientsParMois;
exports.getTopPatients = getTopPatients;
exports.getPrestationsPopulaires = getPrestationsPopulaires;
exports.getPerformanceEmployes = getPerformanceEmployes;
exports.getStatsEmployeDetaille = getStatsEmployeDetaille;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
// ==================== STATISTIQUES GLOBALES ====================
/**
 * GET /api/stats/dashboard - Vue d'ensemble du tableau de bord
 * Statistiques générales pour le directeur
 */
async function getDashboardStats(req, res) {
    try {
        // Nombre total d'employés
        const [employeCount] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM Employe');
        // Nombre total de patients
        const [patientCount] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM Patient');
        // Nombre total de prestations réalisées
        const [prestationsRealisees] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM RDV WHERE timestamp_RDV_reel IS NOT NULL');
        // Nombre de RDV prévus (à venir)
        const [rdvPrevus] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM RDV WHERE timestamp_RDV_reel IS NULL AND timestamp_RDV_prevu > NOW()');
        // Chiffre d'affaires total (factures payées)
        const [caTotal] = await dbconfig_1.default.query(`SELECT COALESCE(SUM(montantTTC), 0) as total
       FROM Facture
       WHERE statutFacture IN ('PAYEE', 'PARTIELLE')`);
        // Chiffre d'affaires en attente (factures envoyées non payées)
        const [caEnAttente] = await dbconfig_1.default.query(`SELECT COALESCE(SUM(montantTTC - COALESCE(montantPaye, 0)), 0) as total
       FROM Facture
       WHERE statutFacture IN ('ENVOYEE', 'PARTIELLE', 'IMPAYEE')`);
        // Nombre de factures impayées
        const [facturesImpayees] = await dbconfig_1.default.query(`SELECT COUNT(*) as count FROM Facture WHERE statutFacture = 'IMPAYEE'`);
        res.status(200).json({
            employes: employeCount[0].total,
            patients: patientCount[0].total,
            prestationsRealisees: prestationsRealisees[0].total,
            rdvPrevus: rdvPrevus[0].total,
            chiffreAffairesTotal: caTotal[0].total,
            chiffreAffairesEnAttente: caEnAttente[0].total,
            facturesImpayees: facturesImpayees[0].count,
        });
    }
    catch (error) {
        console.error('Erreur récupération dashboard:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== STATISTIQUES FINANCIÈRES ====================
/**
 * GET /api/stats/financier/global - Statistiques financières globales
 */
async function getFinancierGlobal(req, res) {
    try {
        // Chiffre d'affaires total par statut
        const [caParStatut] = await dbconfig_1.default.query(`SELECT
        statutFacture,
        COUNT(*) as nombreFactures,
        COALESCE(SUM(montantTTC), 0) as montantTotal,
        COALESCE(SUM(montantPaye), 0) as montantPaye
       FROM Facture
       GROUP BY statutFacture`);
        // Chiffre d'affaires par mode de paiement
        const [caParModePaiement] = await dbconfig_1.default.query(`SELECT
        modePaiement,
        COUNT(*) as nombreFactures,
        COALESCE(SUM(montantTTC), 0) as montantTotal
       FROM Facture
       WHERE statutFacture IN ('PAYEE', 'PARTIELLE')
       GROUP BY modePaiement`);
        // Montant moyen des factures
        const [montantMoyen] = await dbconfig_1.default.query(`SELECT
        AVG(montantTTC) as montantMoyen,
        MIN(montantTTC) as montantMin,
        MAX(montantTTC) as montantMax
       FROM Facture`);
        // Taux de recouvrement
        const [tauxRecouvrement] = await dbconfig_1.default.query(`SELECT
        COALESCE(SUM(CASE WHEN statutFacture IN ('PAYEE', 'PARTIELLE') THEN montantPaye ELSE 0 END), 0) as montantRecouvre,
        COALESCE(SUM(montantTTC), 0) as montantTotal
       FROM Facture
       WHERE statutFacture != 'ANNULEE'`);
        const taux = tauxRecouvrement[0].montantTotal > 0
            ? (tauxRecouvrement[0].montantRecouvre / tauxRecouvrement[0].montantTotal * 100).toFixed(2)
            : 0;
        res.status(200).json({
            caParStatut,
            caParModePaiement,
            montantMoyen: {
                moyen: montantMoyen[0].montantMoyen,
                min: montantMoyen[0].montantMin,
                max: montantMoyen[0].montantMax,
            },
            tauxRecouvrement: {
                pourcentage: parseFloat(taux),
                montantRecouvre: tauxRecouvrement[0].montantRecouvre,
                montantTotal: tauxRecouvrement[0].montantTotal,
            }
        });
    }
    catch (error) {
        console.error('Erreur récupération stats financières:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/financier/mensuel?annee=2025 - CA mensuel pour une année
 */
async function getCAMensuel(req, res) {
    try {
        const annee = req.query.annee || new Date().getFullYear();
        const [caMensuel] = await dbconfig_1.default.query(`SELECT
        MONTH(dateFacture) as mois,
        MONTHNAME(dateFacture) as nomMois,
        COUNT(*) as nombreFactures,
        COALESCE(SUM(montantTTC), 0) as montantTotal,
        COALESCE(SUM(montantPaye), 0) as montantPaye,
        COALESCE(SUM(CASE WHEN statutFacture IN ('PAYEE', 'PARTIELLE') THEN montantPaye ELSE 0 END), 0) as caRealise
       FROM Facture
       WHERE YEAR(dateFacture) = ?
       GROUP BY MONTH(dateFacture), MONTHNAME(dateFacture)
       ORDER BY MONTH(dateFacture)`, [annee]);
        res.status(200).json(caMensuel);
    }
    catch (error) {
        console.error('Erreur récupération CA mensuel:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/financier/par-employe - CA par employé
 */
async function getCAParEmploye(req, res) {
    try {
        const [caParEmploye] = await dbconfig_1.default.query(`SELECT
        e.idEmploye,
        e.nomEmploye,
        e.prenomEmploye,
        e.roleEmploye,
        COUNT(DISTINCT f.idFacture) as nombreFactures,
        COALESCE(SUM(f.montantTTC), 0) as montantTotalFacture,
        COUNT(DISTINCT r.idRdv) as nombrePrestations,
        COALESCE(SUM(p.prix_TTC), 0) as caPrestationsRealisees
       FROM Employe e
       LEFT JOIN RDV r ON e.idEmploye = r.idEmploye AND r.timestamp_RDV_reel IS NOT NULL
       LEFT JOIN Prestation p ON r.idPrestation = p.idPrestation
       LEFT JOIN LigneFacture lf ON r.idRdv = lf.idRdv
       LEFT JOIN Facture f ON lf.idFacture = f.idFacture
       GROUP BY e.idEmploye, e.nomEmploye, e.prenomEmploye, e.roleEmploye
       ORDER BY caPrestationsRealisees DESC`);
        res.status(200).json(caParEmploye);
    }
    catch (error) {
        console.error('Erreur récupération CA par employé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== STATISTIQUES RENDEZ-VOUS ====================
/**
 * GET /api/stats/rdv/global - Statistiques globales des RDV
 */
async function getRDVGlobal(req, res) {
    try {
        // Nombre total de RDV
        const [totalRdv] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM RDV');
        // RDV réalisés
        const [rdvRealises] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM RDV WHERE timestamp_RDV_reel IS NOT NULL');
        // RDV prévus (à venir)
        const [rdvPrevus] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM RDV WHERE timestamp_RDV_reel IS NULL AND timestamp_RDV_prevu > NOW()');
        // RDV manqués (prévus dans le passé mais non réalisés)
        const [rdvManques] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM RDV WHERE timestamp_RDV_reel IS NULL AND timestamp_RDV_prevu < NOW()');
        // Taux de réalisation
        const tauxRealisation = totalRdv[0].total > 0
            ? ((rdvRealises[0].total / totalRdv[0].total) * 100).toFixed(2)
            : 0;
        res.status(200).json({
            total: totalRdv[0].total,
            realises: rdvRealises[0].total,
            prevus: rdvPrevus[0].total,
            manques: rdvManques[0].total,
            tauxRealisation: parseFloat(tauxRealisation),
        });
    }
    catch (error) {
        console.error('Erreur récupération stats RDV global:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/rdv/par-jour?debut=2025-01-01&fin=2025-01-31 - RDV par jour sur une période
 */
async function getRDVParJour(req, res) {
    try {
        const { debut, fin } = req.query;
        if (!debut || !fin) {
            return res.status(400).json({ message: 'Les paramètres debut et fin sont requis' });
        }
        const [rdvParJour] = await dbconfig_1.default.query(`SELECT
        DATE(timestamp_RDV_reel) as jour,
        COUNT(*) as nombreRDV,
        COUNT(DISTINCT idPatient) as nombrePatients,
        COUNT(DISTINCT idEmploye) as nombreEmployes
       FROM RDV
       WHERE timestamp_RDV_reel IS NOT NULL
       AND DATE(timestamp_RDV_reel) BETWEEN ? AND ?
       GROUP BY DATE(timestamp_RDV_reel)
       ORDER BY jour`, [debut, fin]);
        res.status(200).json(rdvParJour);
    }
    catch (error) {
        console.error('Erreur récupération RDV par jour:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/rdv/par-mois?annee=2025 - RDV par mois pour une année
 */
async function getRDVParMois(req, res) {
    try {
        const annee = req.query.annee || new Date().getFullYear();
        const [rdvParMois] = await dbconfig_1.default.query(`SELECT
        MONTH(timestamp_RDV_reel) as mois,
        MONTHNAME(timestamp_RDV_reel) as nomMois,
        COUNT(*) as nombreRDV,
        COUNT(DISTINCT idPatient) as nombrePatients
       FROM RDV
       WHERE timestamp_RDV_reel IS NOT NULL
       AND YEAR(timestamp_RDV_reel) = ?
       GROUP BY MONTH(timestamp_RDV_reel), MONTHNAME(timestamp_RDV_reel)
       ORDER BY MONTH(timestamp_RDV_reel)`, [annee]);
        res.status(200).json(rdvParMois);
    }
    catch (error) {
        console.error('Erreur récupération RDV par mois:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/rdv/par-employe?debut=2025-01-01&fin=2025-01-31 - RDV par employé sur une période
 */
async function getRDVParEmploye(req, res) {
    try {
        const { debut, fin } = req.query;
        let query = `
      SELECT
        e.idEmploye,
        e.nomEmploye,
        e.prenomEmploye,
        e.roleEmploye,
        COUNT(r.idRdv) as nombreRDV,
        COUNT(DISTINCT r.idPatient) as nombrePatients,
        COUNT(DISTINCT DATE(r.timestamp_RDV_reel)) as joursActifs
      FROM Employe e
      LEFT JOIN RDV r ON e.idEmploye = r.idEmploye AND r.timestamp_RDV_reel IS NOT NULL
    `;
        const params = [];
        if (debut && fin) {
            query += ` AND DATE(r.timestamp_RDV_reel) BETWEEN $1 AND $2`;
            params.push(debut, fin);
        }
        query += `
      GROUP BY e.idEmploye, e.nomEmploye, e.prenomEmploye, e.roleEmploye
      ORDER BY nombreRDV DESC
    `;
        const [rdvParEmploye] = await dbconfig_1.default.query(query, params);
        res.status(200).json(rdvParEmploye);
    }
    catch (error) {
        console.error('Erreur récupération RDV par employé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/rdv/employe/:id/par-jour?debut=2025-01-01&fin=2025-01-31
 * RDV d'un employé par jour sur un mois
 */
async function getRDVEmployeParJour(req, res) {
    try {
        const { id } = req.params;
        const { debut, fin } = req.query;
        if (!debut || !fin) {
            return res.status(400).json({ message: 'Les paramètres debut et fin sont requis' });
        }
        const [rdvParJour] = await dbconfig_1.default.query(`SELECT
        DATE(timestamp_RDV_reel) as jour,
        COUNT(*) as nombreRDV,
        COUNT(DISTINCT idPatient) as nombrePatients
       FROM RDV
       WHERE idEmploye = ?
       AND timestamp_RDV_reel IS NOT NULL
       AND DATE(timestamp_RDV_reel) BETWEEN ? AND ?
       GROUP BY DATE(timestamp_RDV_reel)
       ORDER BY jour`, [id, debut, fin]);
        res.status(200).json(rdvParJour);
    }
    catch (error) {
        console.error('Erreur récupération RDV employé par jour:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== STATISTIQUES PATIENTS ====================
/**
 * GET /api/stats/patients/global - Statistiques globales des patients
 */
async function getPatientsGlobal(req, res) {
    try {
        // Nombre total de patients
        const [totalPatients] = await dbconfig_1.default.query('SELECT COUNT(*) as total FROM Patient');
        // Patients actifs (ayant eu au moins un RDV dans les 6 derniers mois)
        const [patientsActifs] = await dbconfig_1.default.query(`SELECT COUNT(DISTINCT idPatient) as total
       FROM RDV
       WHERE timestamp_RDV_reel IS NOT NULL
       AND timestamp_RDV_reel >= DATE_SUB(NOW(), INTERVAL 6 MONTH)`);
        // Patients inactifs
        const patientsInactifs = totalPatients[0].total - patientsActifs[0].total;
        // Patient le plus récent
        const [dernierPatient] = await dbconfig_1.default.query(`SELECT idPatient, nomPatient, prenomPatient, createdAt
       FROM Patient
       ORDER BY createdAt DESC
       LIMIT 1`);
        res.status(200).json({
            total: totalPatients[0].total,
            actifs: patientsActifs[0].total,
            inactifs: patientsInactifs,
            dernierPatient: dernierPatient[0] || null,
        });
    }
    catch (error) {
        console.error('Erreur récupération stats patients global:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/patients/nouveaux?annee=2025 - Nouveaux patients par mois
 */
async function getNouveauxPatientsParMois(req, res) {
    try {
        const annee = req.query.annee || new Date().getFullYear();
        const [nouveauxPatients] = await dbconfig_1.default.query(`SELECT
        MONTH(createdAt) as mois,
        MONTHNAME(createdAt) as nomMois,
        COUNT(*) as nombreNouveauxPatients
       FROM Patient
       WHERE YEAR(createdAt) = ?
       GROUP BY MONTH(createdAt), MONTHNAME(createdAt)
       ORDER BY MONTH(createdAt)`, [annee]);
        res.status(200).json(nouveauxPatients);
    }
    catch (error) {
        console.error('Erreur récupération nouveaux patients:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/patients/top - 10 derniers patients avec détails des prestations
 */
async function getTopPatients(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        // Récupérer les derniers patients avec RDV réalisés
        const [patients] = await dbconfig_1.default.query(`SELECT DISTINCT
        p.idPatient,
        p.nomPatient,
        p.prenomPatient,
        p.numPatient,
        MAX(r.timestamp_RDV_reel) as derniereVisite
       FROM Patient p
       INNER JOIN RDV r ON p.idPatient = r.idPatient
       WHERE r.timestamp_RDV_reel IS NOT NULL
       GROUP BY p.idPatient, p.nomPatient, p.prenomPatient, p.numPatient
       ORDER BY derniereVisite DESC
       LIMIT ?`, [limit]);
        // Pour chaque patient, récupérer les détails des prestations et factures
        const patientsWithDetails = await Promise.all(patients.map(async (patient) => {
            // Prestations réalisées
            const [prestations] = await dbconfig_1.default.query(`SELECT
            pr.nomPrestation,
            pr.prix_TTC,
            COUNT(r.idRdv) as nombre_fois,
            COALESCE(SUM(pr.prix_TTC), 0) as montant_total
           FROM RDV r
           INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
           WHERE r.idPatient = ? AND r.timestamp_RDV_reel IS NOT NULL
           GROUP BY pr.idPrestation, pr.nomPrestation, pr.prix_TTC`, [patient.idPatient]);
            // Total facturé
            const [factureTotal] = await dbconfig_1.default.query(`SELECT
            COUNT(*) as nombre_factures,
            COALESCE(SUM(montantTTC), 0) as montant_total_facture,
            COALESCE(SUM(montantPaye), 0) as montant_paye
           FROM Facture
           WHERE idPatient = ?`, [patient.idPatient]);
            // Nombre total de RDV
            const [rdvCount] = await dbconfig_1.default.query(`SELECT COUNT(*) as nombre_rdv
           FROM RDV
           WHERE idPatient = ? AND timestamp_RDV_reel IS NOT NULL`, [patient.idPatient]);
            return {
                ...patient,
                nombre_rdv: rdvCount[0].nombre_rdv,
                prestations: prestations,
                montant_total: factureTotal[0].montant_total_facture,
                montant_paye: factureTotal[0].montant_paye,
                nombre_factures: factureTotal[0].nombre_factures
            };
        }));
        res.status(200).json(patientsWithDetails);
    }
    catch (error) {
        console.error('Erreur récupération derniers patients:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== STATISTIQUES PRESTATIONS ====================
/**
 * GET /api/stats/prestations/populaires - Prestations les plus populaires
 */
async function getPrestationsPopulaires(req, res) {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const [prestations] = await dbconfig_1.default.query(`SELECT
        pr.idPrestation,
        pr.nomPrestation,
        pr.prix_TTC,
        COUNT(r.idRdv) as nombre_fois,
        COALESCE(SUM(pr.prix_TTC), 0) as ca_total
       FROM Prestation pr
       LEFT JOIN RDV r ON pr.idPrestation = r.idPrestation AND r.timestamp_RDV_reel IS NOT NULL
       GROUP BY pr.idPrestation, pr.nomPrestation, pr.prix_TTC
       ORDER BY nombre_fois DESC
       LIMIT ?`, [limit]);
        res.status(200).json(prestations);
    }
    catch (error) {
        console.error('Erreur récupération prestations populaires:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
// ==================== STATISTIQUES EMPLOYÉS ====================
/**
 * GET /api/stats/employes/performance - Performance des employés
 */
async function getPerformanceEmployes(req, res) {
    try {
        const [performance] = await dbconfig_1.default.query(`SELECT
        e.idEmploye,
        e.nomEmploye,
        e.prenomEmploye,
        e.roleEmploye,
        COUNT(DISTINCT r.idRdv) as nombrePrestations,
        COUNT(DISTINCT r.idPatient) as nombrePatientsDifferents,
        AVG(r.noteStagiaire) as noteMoyenne,
        COUNT(DISTINCT f.idFacture) as nombreFacturesTraitees,
        COALESCE(SUM(f.montantTTC), 0) as montantTotalFactures
       FROM Employe e
       LEFT JOIN RDV r ON e.idEmploye = r.idEmploye AND r.timestamp_RDV_reel IS NOT NULL
       LEFT JOIN LigneFacture lf ON r.idRdv = lf.idRdv
       LEFT JOIN Facture f ON lf.idFacture = f.idFacture
       GROUP BY e.idEmploye, e.nomEmploye, e.prenomEmploye, e.roleEmploye
       ORDER BY nombrePrestations DESC`);
        res.status(200).json(performance);
    }
    catch (error) {
        console.error('Erreur récupération performance employés:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
/**
 * GET /api/stats/employes/:id/detaille - Statistiques détaillées d'un employé
 */
async function getStatsEmployeDetaille(req, res) {
    try {
        const { id } = req.params;
        // Informations de l'employé
        const [employe] = await dbconfig_1.default.query('SELECT idEmploye, nomEmploye, prenomEmploye, mailEmploye, roleEmploye FROM Employe WHERE idEmploye = ?', [id]);
        if (!employe || employe.length === 0) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        // Statistiques générales
        const [stats] = await dbconfig_1.default.query(`SELECT
        COUNT(DISTINCT r.idRdv) as totalPrestations,
        COUNT(DISTINCT r.idPatient) as totalPatients,
        COUNT(DISTINCT DATE(r.timestamp_RDV_reel)) as joursActifs,
        AVG(r.noteStagiaire) as noteMoyenne
       FROM RDV r
       WHERE r.idEmploye = ? AND r.timestamp_RDV_reel IS NOT NULL`, [id]);
        // Prestations par mois (12 derniers mois)
        const [prestationsParMois] = await dbconfig_1.default.query(`SELECT
        DATE_FORMAT(timestamp_RDV_reel, '%Y-%m') as mois,
        COUNT(*) as nombrePrestations
       FROM RDV
       WHERE idEmploye = ?
       AND timestamp_RDV_reel IS NOT NULL
       AND timestamp_RDV_reel >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(timestamp_RDV_reel, '%Y-%m')
       ORDER BY mois`, [id]);
        // Top prestations réalisées
        const [topPrestations] = await dbconfig_1.default.query(`SELECT
        pr.nomPrestation,
        COUNT(*) as nombreFois
       FROM RDV r
       INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
       WHERE r.idEmploye = ?
       AND r.timestamp_RDV_reel IS NOT NULL
       GROUP BY pr.idPrestation, pr.nomPrestation
       ORDER BY nombreFois DESC
       LIMIT 5`, [id]);
        res.status(200).json({
            employe: employe[0],
            statistiques: stats[0],
            prestationsParMois,
            topPrestations,
        });
    }
    catch (error) {
        console.error('Erreur récupération stats employé détaillées:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}
