"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecole = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Ecole {
    static async create(nomEcole) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO ecole (nomEcole) VALUES (?)`, [nomEcole]);
        const id = result.insertId;
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM ecole WHERE idEcole = ?`, [id]);
        return rows[0];
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM ecole`);
        return rows;
    }
    static async getOne(idEcole) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM ecole WHERE idEcole = ?`, [idEcole]);
        return rows.length ? rows[0] : null;
    }
    static async update(idEcole, nomEcole) {
        await dbconfig_1.default.execute(`UPDATE ecole SET nomEcole = ? WHERE idEcole = ?`, [nomEcole, idEcole]);
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM ecole WHERE idEcole = ?`, [idEcole]);
        return rows.length ? rows[0] : null;
    }
    static async delete(idEcole) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM ecole WHERE idEcole = ?`, [idEcole]);
        return result.affectedRows;
    }
}
exports.Ecole = Ecole;
