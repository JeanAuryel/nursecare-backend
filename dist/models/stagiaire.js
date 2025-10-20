"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stagiaire = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Stagiaire {
    static async create(stagiaire) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO stagiaire (nomStagiaire, prenomStagiaire, idEcole) VALUES (?, ?, ?)`, [stagiaire.nomStagiaire, stagiaire.prenomStagiaire, stagiaire.idEcole]);
        return result.insertId;
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM stagiaire`);
        return rows;
    }
    static async getOne(idStagiaire) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM stagiaire WHERE idStagiaire = ?`, [idStagiaire]);
        return rows.length ? rows[0] : null;
    }
    static async update(idStagiaire, stagiaire) {
        const [result] = await dbconfig_1.default.execute(`UPDATE stagiaire SET nomStagiaire = ?, prenomStagiaire = ?, idEcole = ? WHERE idStagiaire = ?`, [stagiaire.nomStagiaire, stagiaire.prenomStagiaire, stagiaire.idEcole, idStagiaire]);
        return result.affectedRows;
    }
    static async delete(idStagiaire) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM stagiaire WHERE idStagiaire = ?`, [idStagiaire]);
        return result.affectedRows;
    }
}
exports.Stagiaire = Stagiaire;
