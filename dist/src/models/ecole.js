"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecole = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Ecole {
    static async create(ecoleData) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO Ecole (nomEcole, adresseEcole, villeEcole, codePostalEcole, numEcole, contactReferent)
       VALUES (?, ?, ?, ?, ?, ?)`, [
            ecoleData.nomEcole,
            ecoleData.adresseEcole,
            ecoleData.villeEcole,
            ecoleData.codePostalEcole,
            ecoleData.numEcole,
            ecoleData.contactReferent
        ]);
        const id = result.insertId;
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Ecole WHERE idEcole = ?`, [id]);
        return rows[0];
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Ecole ORDER BY nomEcole`);
        return rows;
    }
    static async getAllWithStagiaires() {
        const [ecoles] = await dbconfig_1.default.execute(`SELECT * FROM Ecole ORDER BY nomEcole`);
        // Pour chaque école, récupérer ses stagiaires
        for (const ecole of ecoles) {
            const [stagiaires] = await dbconfig_1.default.execute(`SELECT * FROM Stagiaire WHERE idEcole = ? ORDER BY nomStagiaire, prenomStagiaire`, [ecole.idEcole]);
            ecole.stagiaires = stagiaires;
        }
        return ecoles;
    }
    static async getOne(idEcole) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Ecole WHERE idEcole = ?`, [idEcole]);
        return rows.length ? rows[0] : null;
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
        await dbconfig_1.default.execute(`UPDATE Ecole SET ${fields.join(', ')} WHERE idEcole = ?`, values);
        return this.getOne(idEcole);
    }
    static async delete(idEcole) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM Ecole WHERE idEcole = ?`, [idEcole]);
        return result.affectedRows;
    }
}
exports.Ecole = Ecole;
