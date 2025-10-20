"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categorie = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Categorie {
    static async create(categorie) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO categorie (nomCategorie) VALUES (?)`, [categorie.nomCategorie]);
        return result.insertId;
    }
    static async findAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM categorie`);
        return rows;
    }
    static async findById(idCategorie) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM categorie WHERE idCategorie = ?`, [idCategorie]);
        return rows.length ? rows[0] : null;
    }
    static async update(categorie) {
        const [result] = await dbconfig_1.default.execute(`UPDATE categorie SET nomCategorie = ? WHERE idCategorie = ?`, [categorie.nomCategorie, categorie.idCategorie]);
        return result.affectedRows;
    }
    static async delete(idCategorie) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM categorie WHERE idCategorie = ?`, [idCategorie]);
        return result.affectedRows;
    }
}
exports.Categorie = Categorie;
