"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Facture = exports.ModePaiement = exports.StatutFacture = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
var StatutFacture;
(function (StatutFacture) {
    StatutFacture["BROUILLON"] = "BROUILLON";
    StatutFacture["ENVOYEE"] = "ENVOYEE";
    StatutFacture["PAYEE"] = "PAYEE";
    StatutFacture["PARTIELLE"] = "PARTIELLE";
    StatutFacture["IMPAYEE"] = "IMPAYEE";
    StatutFacture["ANNULEE"] = "ANNULEE";
})(StatutFacture || (exports.StatutFacture = StatutFacture = {}));
var ModePaiement;
(function (ModePaiement) {
    ModePaiement["ESPECES"] = "ESPECES";
    ModePaiement["CARTE"] = "CARTE";
    ModePaiement["CHEQUE"] = "CHEQUE";
    ModePaiement["VIREMENT"] = "VIREMENT";
    ModePaiement["MUTUELLE"] = "MUTUELLE";
})(ModePaiement || (exports.ModePaiement = ModePaiement = {}));
class Facture {
    /**
     * Générer un numéro de facture unique
     */
    static async genererNumeroFacture() {
        const annee = new Date().getFullYear();
        const result = await dbconfig_1.default.query("SELECT COUNT(*) as count FROM Facture WHERE EXTRACT(YEAR FROM dateFacture) = ?", [annee]);
        const count = result.rows[0].count + 1;
        return `FAC-${annee}-${String(count).padStart(5, '0')}`;
    }
    /**
     * Créer une nouvelle facture
     */
    static async create(facture) {
        const numeroFacture = await this.genererNumeroFacture();
        const result = await dbconfig_1.default.query(`INSERT INTO Facture (
        numeroFacture, idPatient, dateFacture, dateEcheance,
        montantHT, montantTVA, montantTTC, montantPaye,
        statutFacture, modePaiement, datePaiement, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            numeroFacture,
            facture.idPatient,
            facture.dateFacture,
            facture.dateEcheance,
            facture.montantHT,
            facture.montantTVA,
            facture.montantTTC,
            facture.montantPaye || 0,
            facture.statutFacture,
            facture.modePaiement || null,
            facture.datePaiement || null,
            facture.notes || null
        ]);
        return result.rows[0].idfacture;
    }
    /**
     * Ajouter une ligne de facture
     */
    static async ajouterLigne(ligne) {
        const result = await dbconfig_1.default.query(`INSERT INTO LigneFacture (
        idFacture, idPrestation, idRdv, description,
        quantite, prixUnitaire, montantHT,
        tauxTVA, montantTVA, montantTTC
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            ligne.idFacture,
            ligne.idPrestation,
            ligne.idRdv || null,
            ligne.description,
            ligne.quantite,
            ligne.prixUnitaire,
            ligne.montantHT,
            ligne.tauxTVA,
            ligne.montantTVA,
            ligne.montantTTC
        ]);
        return result.rows[0].idfacture;
    }
    /**
     * Récupérer toutes les factures
     */
    static async getAll() {
        const result = await dbconfig_1.default.query(`
      SELECT
        f.*,
        json_build_object(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      ORDER BY f.dateFacture DESC
    `);
        // Parse patient JSON and convert numeric fields
        return result.rows.map((row) => ({
            ...row,
            patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
            montantHT: parseFloat(row.montantHT) || 0,
            montantTVA: parseFloat(row.montantTVA) || 0,
            montantTTC: parseFloat(row.montantTTC) || 0,
            montantPaye: parseFloat(row.montantPaye) || 0
        }));
    }
    /**
     * Récupérer une facture par ID avec ses lignes
     */
    static async getById(idFacture) {
        const result = await dbconfig_1.default.query(`
      SELECT
        f.*,
        json_build_object(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      WHERE f.idFacture = ?
    `, [idFacture]);
        if (result.rows.length === 0)
            return null;
        const facture = result.rows[0];
        // Parse patient JSON
        facture.patient = typeof facture.patient === 'string' ? JSON.parse(facture.patient) : facture.patient;
        // Récupérer les lignes
        const lignesResult = await dbconfig_1.default.query(`
      SELECT
        lf.*,
        pr.nomPrestation,
        pr.codePrestation
      FROM LigneFacture lf
      LEFT JOIN Prestation pr ON lf.idPrestation = pr.idPrestation
      WHERE lf.idFacture = ?
    `, [idFacture]);
        facture.lignes = lignesResult.rows;
        return facture;
    }
    /**
     * Mettre à jour le statut d'une facture
     */
    static async updateStatut(idFacture, statutFacture, montantPaye, modePaiement, datePaiement) {
        const result = await dbconfig_1.default.query(`UPDATE Facture
       SET statutFacture = ?,
           montantPaye = COALESCE(?, montantPaye),
           modePaiement = COALESCE(?, modePaiement),
           datePaiement = COALESCE(?, datePaiement),
           updatedAt = CURRENT_TIMESTAMP
       WHERE idFacture = ?`, [statutFacture, montantPaye, modePaiement, datePaiement, idFacture]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    /**
     * Récupérer les factures par statut
     */
    static async getByStatut(statutFacture) {
        const result = await dbconfig_1.default.query(`
      SELECT
        f.*,
        json_build_object(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      WHERE f.statutFacture = ?
      ORDER BY f.dateFacture DESC
    `, [statutFacture]);
        // Parse patient JSON and convert numeric fields
        return result.rows.map((row) => ({
            ...row,
            patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
            montantHT: parseFloat(row.montantHT) || 0,
            montantTVA: parseFloat(row.montantTVA) || 0,
            montantTTC: parseFloat(row.montantTTC) || 0,
            montantPaye: parseFloat(row.montantPaye) || 0
        }));
    }
    /**
     * Récupérer les factures d'un patient
     */
    static async getByPatient(idPatient) {
        const result = await dbconfig_1.default.query(`
      SELECT
        f.*,
        json_build_object(
          'idPatient', p.idPatient,
          'nomPatient', p.nomPatient,
          'prenomPatient', p.prenomPatient,
          'adressePatient', p.adressePatient,
          'numPatient', p.numPatient,
          'mailPatient', p.mailPatient
        ) as patient
      FROM Facture f
      LEFT JOIN Patient p ON f.idPatient = p.idPatient
      WHERE f.idPatient = ?
      ORDER BY f.dateFacture DESC
    `, [idPatient]);
        // Parse patient JSON and convert numeric fields
        return result.rows.map((row) => ({
            ...row,
            patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
            montantHT: parseFloat(row.montantHT) || 0,
            montantTVA: parseFloat(row.montantTVA) || 0,
            montantTTC: parseFloat(row.montantTTC) || 0,
            montantPaye: parseFloat(row.montantPaye) || 0
        }));
    }
    /**
     * Supprimer une facture
     */
    static async delete(idFacture) {
        // Supprimer d'abord les lignes
        await dbconfig_1.default.query("DELETE FROM LigneFacture WHERE idFacture = ?", [idFacture]);
        // Puis la facture
        const result = await dbconfig_1.default.query("DELETE FROM Facture WHERE idFacture = ?", [idFacture]);
        return result.rowCount !== null && result.rowCount > 0;
    }
}
exports.Facture = Facture;
