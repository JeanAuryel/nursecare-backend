"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestation = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Prestation {
    static async create(prestation) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO prestation (nomPrestation, prix_TTC, idCategorie) VALUES (?, ?, ?)`, [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie]);
        return result.insertId;
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM prestation`);
        return rows;
    }
    static async getOne(idPrestation) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM prestation WHERE idPrestation = ?`, [idPrestation]);
        return rows.length ? rows[0] : null;
    }
    static async update(idPrestation, prestation) {
        const [result] = await dbconfig_1.default.execute(`UPDATE prestation SET nomPrestation = ?, prix_TTC = ?, idCategorie = ? WHERE idPrestation = ?`, [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie, idPrestation]);
        return result.affectedRows;
    }
    static async delete(idPrestation) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM prestation WHERE idPrestation = ?`, [idPrestation]);
        return result.affectedRows;
    }
}
exports.Prestation = Prestation;
