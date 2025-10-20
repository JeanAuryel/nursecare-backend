"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stagiaire = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Stagiaire {
    static async create(stagiaire) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO Stagiaire (nomStagiaire, prenomStagiaire, idEcole, idTuteur, mailStagiaire, numStagiaire, dateDebutStage, dateFinStage)
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
        return result.insertId;
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Stagiaire ORDER BY nomStagiaire, prenomStagiaire`);
        return rows;
    }
    static async getOne(idStagiaire) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Stagiaire WHERE idStagiaire = ?`, [idStagiaire]);
        return rows.length ? rows[0] : null;
    }
    static async getOneDetailed(idStagiaire) {
        // Récupérer le stagiaire
        const [stagiaires] = await dbconfig_1.default.execute(`SELECT S.*, E.nomEcole, E.contactReferent
             FROM Stagiaire S
             LEFT JOIN Ecole E ON S.idEcole = E.idEcole
             WHERE S.idStagiaire = ?`, [idStagiaire]);
        if (stagiaires.length === 0)
            return null;
        const stagiaire = stagiaires[0];
        // Récupérer le tuteur si existe
        if (stagiaire.idTuteur) {
            const [tuteurs] = await dbconfig_1.default.execute(`SELECT idEmploye, nomEmploye, prenomEmploye FROM Employe WHERE idEmploye = ?`, [stagiaire.idTuteur]);
            stagiaire.tuteur = tuteurs[0] || null;
        }
        // Récupérer les notes et appréciations
        const [notes] = await dbconfig_1.default.execute(`SELECT R.idRdv, R.noteStagiaire, R.commentaireStagiaire, R.timestamp_RDV_reel as dateRdv, P.nomPrestation
             FROM RDV R
             LEFT JOIN Prestation P ON R.idPrestation = P.idPrestation
             WHERE R.idStagiaire = ? AND R.timestamp_RDV_reel IS NOT NULL
             ORDER BY R.timestamp_RDV_reel DESC`, [idStagiaire]);
        stagiaire.notes = notes;
        return stagiaire;
    }
    static async update(idStagiaire, stagiaire) {
        const fields = [];
        const values = [];
        if (stagiaire.nomStagiaire !== undefined) {
            fields.push('nomStagiaire = ?');
            values.push(stagiaire.nomStagiaire);
        }
        if (stagiaire.prenomStagiaire !== undefined) {
            fields.push('prenomStagiaire = ?');
            values.push(stagiaire.prenomStagiaire);
        }
        if (stagiaire.idEcole !== undefined) {
            fields.push('idEcole = ?');
            values.push(stagiaire.idEcole);
        }
        if (stagiaire.idTuteur !== undefined) {
            fields.push('idTuteur = ?');
            values.push(stagiaire.idTuteur);
        }
        if (stagiaire.mailStagiaire !== undefined) {
            fields.push('mailStagiaire = ?');
            values.push(stagiaire.mailStagiaire);
        }
        if (stagiaire.numStagiaire !== undefined) {
            fields.push('numStagiaire = ?');
            values.push(stagiaire.numStagiaire);
        }
        if (stagiaire.dateDebutStage !== undefined) {
            fields.push('dateDebutStage = ?');
            values.push(stagiaire.dateDebutStage);
        }
        if (stagiaire.dateFinStage !== undefined) {
            fields.push('dateFinStage = ?');
            values.push(stagiaire.dateFinStage);
        }
        if (fields.length === 0)
            return 0;
        values.push(idStagiaire);
        const [result] = await dbconfig_1.default.execute(`UPDATE Stagiaire SET ${fields.join(', ')} WHERE idStagiaire = ?`, values);
        return result.affectedRows;
    }
    static async delete(idStagiaire) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM Stagiaire WHERE idStagiaire = ?`, [idStagiaire]);
        return result.affectedRows;
    }
}
exports.Stagiaire = Stagiaire;
