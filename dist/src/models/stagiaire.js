"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stagiaire = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Stagiaire {
    static async create(stagiaire) {
        const result = await dbconfig_1.default.query(`INSERT INTO Stagiaire (nomStagiaire, prenomStagiaire, idEcole, idTuteur, mailStagiaire, numStagiaire, dateDebutStage, dateFinStage)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            stagiaire.nomStagiaire,
            stagiaire.prenomStagiaire,
            stagiaire.idEcole,
            stagiaire.idTuteur || null,
            stagiaire.mailStagiaire || null,
            stagiaire.numStagiaire || null,
            stagiaire.dateDebutStage || null,
            stagiaire.dateFinStage || null
        ]);
        return result.rows[0].idstagiaire;
    }
    static async getAll() {
        const result = await dbconfig_1.default.query(`SELECT * FROM Stagiaire ORDER BY nomStagiaire, prenomStagiaire`);
        return result.rows;
    }
    static async getOne(idStagiaire) {
        const result = await dbconfig_1.default.query(`SELECT * FROM Stagiaire WHERE idStagiaire = $1`, [idStagiaire]);
        return result.rows.length ? result.rows[0] : null;
    }
    static async getOneDetailed(idStagiaire) {
        // Récupérer le stagiaire
        const stagiairesResult = await dbconfig_1.default.query(`SELECT S.*, E.nomEcole, E.contactReferent
             FROM Stagiaire S
             LEFT JOIN Ecole E ON S.idEcole = E.idEcole
             WHERE S.idStagiaire = ?`, [idStagiaire]);
        if (stagiairesResult.rows.length === 0)
            return null;
        const stagiaire = stagiairesResult.rows[0];
        // Récupérer le tuteur si existe
        if (stagiaire.idTuteur) {
            const tuteursResult = await dbconfig_1.default.query(`SELECT idEmploye, nomEmploye, prenomEmploye FROM Employe WHERE idEmploye = $1`, [stagiaire.idTuteur]);
            stagiaire.tuteur = tuteursResult.rows[0] || null;
        }
        // Récupérer les notes et appréciations
        const notesResult = await dbconfig_1.default.query(`SELECT R.idRdv, R.noteStagiaire, R.commentaireStagiaire, R.timestamp_RDV_reel as dateRdv, P.nomPrestation
             FROM RDV R
             LEFT JOIN Prestation P ON R.idPrestation = P.idPrestation
             WHERE R.idStagiaire = ? AND R.timestamp_RDV_reel IS NOT NULL
             ORDER BY R.timestamp_RDV_reel DESC`, [idStagiaire]);
        stagiaire.notes = notesResult.rows;
        return stagiaire;
    }
    static async update(idStagiaire, stagiaire) {
        const fields = [];
        const values = [];
        let paramIndex = 1;
        if (stagiaire.nomStagiaire !== undefined) {
            fields.push(`nomStagiaire = $${paramIndex++}`);
            values.push(stagiaire.nomStagiaire);
        }
        if (stagiaire.prenomStagiaire !== undefined) {
            fields.push(`prenomStagiaire = $${paramIndex++}`);
            values.push(stagiaire.prenomStagiaire);
        }
        if (stagiaire.idEcole !== undefined) {
            fields.push(`idEcole = $${paramIndex++}`);
            values.push(stagiaire.idEcole);
        }
        if (stagiaire.idTuteur !== undefined) {
            fields.push(`idTuteur = $${paramIndex++}`);
            values.push(stagiaire.idTuteur);
        }
        if (stagiaire.mailStagiaire !== undefined) {
            fields.push(`mailStagiaire = $${paramIndex++}`);
            values.push(stagiaire.mailStagiaire);
        }
        if (stagiaire.numStagiaire !== undefined) {
            fields.push(`numStagiaire = $${paramIndex++}`);
            values.push(stagiaire.numStagiaire);
        }
        if (stagiaire.dateDebutStage !== undefined) {
            fields.push(`dateDebutStage = $${paramIndex++}`);
            values.push(stagiaire.dateDebutStage);
        }
        if (stagiaire.dateFinStage !== undefined) {
            fields.push(`dateFinStage = $${paramIndex++}`);
            values.push(stagiaire.dateFinStage);
        }
        if (fields.length === 0)
            return 0;
        values.push(idStagiaire);
        const result = await dbconfig_1.default.query(`UPDATE Stagiaire SET ${fields.join(', ')} WHERE idStagiaire = $${paramIndex}`, values);
        return result.rowCount || 0;
    }
    static async delete(idStagiaire) {
        const result = await dbconfig_1.default.query(`DELETE FROM Stagiaire WHERE idStagiaire = $1`, [idStagiaire]);
        return result.rowCount || 0;
    }
}
exports.Stagiaire = Stagiaire;
