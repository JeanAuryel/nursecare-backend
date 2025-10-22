"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categorie = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Categorie {
    static async create(categorie) {
        const result = await dbconfig_1.default.query(`INSERT INTO Categorie (nomCategorie) VALUES ($1) RETURNING idCategorie`, [categorie.nomCategorie]);
        return result.rows[0].idcategorie;
    }
    static async findAll() {
        const result = await dbconfig_1.default.query(`SELECT * FROM Categorie`);
        return result.rows;
    }
    static async findById(idCategorie) {
        const result = await dbconfig_1.default.query(`SELECT * FROM Categorie WHERE idCategorie = $1`, [idCategorie]);
        return result.rows.length ? result.rows[0] : null;
    }
    static async update(categorie) {
        const result = await dbconfig_1.default.query(`UPDATE Categorie SET nomCategorie = $1 WHERE idCategorie = $2`, [categorie.nomCategorie, categorie.idCategorie]);
        return result.rowCount || 0;
    }
    static async delete(idCategorie) {
        const result = await dbconfig_1.default.query(`DELETE FROM Categorie WHERE idCategorie = $1`, [idCategorie]);
        return result.rowCount || 0;
    }
}
exports.Categorie = Categorie;
