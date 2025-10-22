"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecole = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Ecole {
    static async create(ecoleData) {
        const result = await dbconfig_1.default.query(`INSERT INTO Ecole (nomEcole, adresseEcole, villeEcole, codePostalEcole, numEcole, contactReferent)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING idEcole`, [
            ecoleData.nomEcole,
            ecoleData.adresseEcole,
            ecoleData.villeEcole,
            ecoleData.codePostalEcole,
            ecoleData.numEcole,
            ecoleData.contactReferent
        ]);
        const id = result.rows[0].idecole;
        const selectResult = await dbconfig_1.default.query(`SELECT * FROM Ecole WHERE idEcole = $1`, [id]);
        return selectResult.rows[0];
    }
    static async getAll() {
        const result = await dbconfig_1.default.query(`SELECT * FROM Ecole ORDER BY nomEcole`);
        return result.rows;
    }
    static async getAllWithStagiaires() {
        const ecolesResult = await dbconfig_1.default.query(`SELECT * FROM Ecole ORDER BY nomEcole`);
        // Pour chaque école, récupérer ses stagiaires
        for (const ecole of ecolesResult.rows) {
            const stagiairesResult = await dbconfig_1.default.query(`SELECT * FROM Stagiaire WHERE idEcole = $1 ORDER BY nomStagiaire, prenomStagiaire`, [ecole.idEcole]);
            ecole.stagiaires = stagiairesResult.rows;
        }
        return ecolesResult.rows;
    }
    static async getOne(idEcole) {
        const result = await dbconfig_1.default.query(`SELECT * FROM Ecole WHERE idEcole = $1`, [idEcole]);
        return result.rows.length ? result.rows[0] : null;
    }
    static async update(idEcole, ecoleData) {
        const fields = [];
        const values = [];
        if (ecoleData.nomEcole !== undefined) {
            fields.push('nomEcole = ?');
            values.push(ecoleData.nomEcole);
        }
        if (ecoleData.adresseEcole !== undefined) {
            fields.push('adresseEcole = ?');
            values.push(ecoleData.adresseEcole);
        }
        if (ecoleData.villeEcole !== undefined) {
            fields.push('villeEcole = ?');
            values.push(ecoleData.villeEcole);
        }
        if (ecoleData.codePostalEcole !== undefined) {
            fields.push('codePostalEcole = ?');
            values.push(ecoleData.codePostalEcole);
        }
        if (ecoleData.numEcole !== undefined) {
            fields.push('numEcole = ?');
            values.push(ecoleData.numEcole);
        }
        if (ecoleData.contactReferent !== undefined) {
            fields.push('contactReferent = ?');
            values.push(ecoleData.contactReferent);
        }
        if (fields.length === 0) {
            return this.getOne(idEcole);
        }
        values.push(idEcole);
        await dbconfig_1.default.query(`UPDATE Ecole SET ${fields.join(', ')} WHERE idEcole = $1`, values);
        return this.getOne(idEcole);
    }
    static async delete(idEcole) {
        const result = await dbconfig_1.default.query(`DELETE FROM Ecole WHERE idEcole = $1`, [idEcole]);
        return result.rowCount || 0;
    }
}
exports.Ecole = Ecole;
