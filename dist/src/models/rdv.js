"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rdv = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Rdv {
    static async create(rdv) {
        await dbconfig_1.default.query(`INSERT INTO RDV (
                idEmploye, idPrestation, idPatient, idStagiaire,
                timestamp_RDV_prevu, timestamp_RDV_reel, timestamp_RDV_facture, timestamp_RDV_integrePGI,
                noteStagiaire, commentaireStagiaire
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
            rdv.idEmploye, rdv.idPrestation, rdv.idPatient, rdv.idStagiaire,
            rdv.timestamp_RDV_prevu, rdv.timestamp_RDV_reel, rdv.timestamp_RDV_facture, rdv.timestamp_RDV_integrePGI,
            rdv.noteStagiaire, rdv.commentaireStagiaire
        ]);
    }
    static async getAll() {
        try {
            const result = await dbconfig_1.default.query(`
                SELECT
                    r.*,
                    json_build_object(
                        'idEmploye', e.idEmploye,
                        'nomEmploye', e.nomEmploye,
                        'prenomEmploye', e.prenomEmploye,
                        'mailEmploye', e.mailEmploye,
                        'roleEmploye', e.roleEmploye
                    ) as employe,
                    json_build_object(
                        'idPrestation', pr.idPrestation,
                        'nomPrestation', pr.nomPrestation,
                        'prix_TTC', pr.prix_TTC,
                        'idCategorie', pr.idCategorie
                    ) as prestation,
                    json_build_object(
                        'idPatient', p.idPatient,
                        'nomPatient', p.nomPatient,
                        'prenomPatient', p.prenomPatient,
                        'adressePatient', p.adressePatient,
                        'numPatient', p.numPatient,
                        'mailPatient', p.mailPatient
                    ) as patient,
                    json_build_object(
                        'idStagiaire', s.idStagiaire,
                        'nomStagiaire', s.nomStagiaire,
                        'prenomStagiaire', s.prenomStagiaire
                    ) as stagiaire
                FROM RDV r
                LEFT JOIN Employe e ON r.idEmploye = e.idEmploye
                LEFT JOIN Prestation pr ON r.idPrestation = pr.idPrestation
                LEFT JOIN Patient p ON r.idPatient = p.idPatient
                LEFT JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
                ORDER BY r.timestamp_RDV_prevu DESC
            `);
            // PostgreSQL returns JSON objects directly, no need to parse
            return result.rows;
        }
        catch (error) {
            console.error('Erreur SQL dans Rdv.getAll():', error);
            throw error;
        }
    }
    static async getOne(idEmploye, idPrestation, idPatient, idStagiaire) {
        const result = await dbconfig_1.default.query(`SELECT * FROM RDV WHERE idEmploye = $1 AND idPrestation = $2 AND idPatient = $3 AND idStagiaire = $4`, [idEmploye, idPrestation, idPatient, idStagiaire]);
        return result.rows.length ? result.rows[0] : null;
    }
    static async update(rdv) {
        const result = await dbconfig_1.default.query(`UPDATE RDV SET
                timestamp_RDV_prevu = $1, timestamp_RDV_reel = $2, timestamp_RDV_facture = $3, timestamp_RDV_integrePGI = $4,
                noteStagiaire = $5, commentaireStagiaire = $6
             WHERE idEmploye = $7 AND idPrestation = $8 AND idPatient = $9 AND idStagiaire = $10`, [
            rdv.timestamp_RDV_prevu, rdv.timestamp_RDV_reel, rdv.timestamp_RDV_facture, rdv.timestamp_RDV_integrePGI,
            rdv.noteStagiaire, rdv.commentaireStagiaire,
            rdv.idEmploye, rdv.idPrestation, rdv.idPatient, rdv.idStagiaire
        ]);
        return result.rowCount || 0;
    }
    static async delete(idEmploye, idPrestation, idPatient, idStagiaire) {
        const result = await dbconfig_1.default.query(`DELETE FROM RDV WHERE idEmploye = $1 AND idPrestation = $2 AND idPatient = $3 AND idStagiaire = $4`, [idEmploye, idPrestation, idPatient, idStagiaire]);
        return result.rowCount || 0;
    }
    /**
     * Récupérer toutes les prestations réalisées avec détails
     */
    static async getPrestationsRealisees() {
        const result = await dbconfig_1.default.query(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.timestamp_RDV_reel IS NOT NULL
            ORDER BY r.timestamp_RDV_reel DESC
        `);
        return result.rows;
    }
    /**
     * Récupérer les prestations à facturer (réalisées mais pas encore facturées)
     */
    static async getPrestationsAFacturer() {
        const result = await dbconfig_1.default.query(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.timestamp_RDV_reel IS NOT NULL
            AND r.timestamp_RDV_facture IS NULL
            ORDER BY r.timestamp_RDV_reel DESC
        `);
        return result.rows;
    }
    /**
     * Récupérer les prestations facturées
     */
    static async getPrestationsFacturees() {
        const result = await dbconfig_1.default.query(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.timestamp_RDV_facture IS NOT NULL
            ORDER BY r.timestamp_RDV_facture DESC
        `);
        return result.rows;
    }
    /**
     * Marquer une prestation comme facturée
     */
    static async marquerFacturee(idRdv) {
        const result = await dbconfig_1.default.query(`UPDATE RDV SET timestamp_RDV_facture = CURRENT_TIMESTAMP WHERE idRdv = $1`, [idRdv]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    /**
     * Marquer une prestation comme intégrée au PGI
     */
    static async marquerIntegrePGI(idRdv) {
        const result = await dbconfig_1.default.query(`UPDATE RDV SET timestamp_RDV_integrePGI = CURRENT_TIMESTAMP WHERE idRdv = $1`, [idRdv]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    /**
     * Récupérer une prestation par ID avec détails
     */
    static async getById(idRdv) {
        const result = await dbconfig_1.default.query(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.idRdv = $1
        `, [idRdv]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
}
exports.Rdv = Rdv;
