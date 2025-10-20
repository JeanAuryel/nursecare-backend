"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestation = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Prestation {
    static async create(prestation) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO Prestation (nomPrestation, prix_TTC, idCategorie) VALUES (?, ?, ?)`, [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie]);
        return result.insertId;
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`
            SELECT
                p.idPrestation,
                p.nomPrestation,
                p.prix_TTC,
                p.idCategorie,
                c.nomCategorie as categorie_nomCategorie
            FROM Prestation p
            LEFT JOIN Categorie c ON p.idCategorie = c.idCategorie
            ORDER BY p.nomPrestation
        `);
        // Restructurer les données pour inclure l'objet categorie
        return rows.map((row) => ({
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prix_TTC: row.prix_TTC,
            idCategorie: row.idCategorie,
            categorie: row.categorie_nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.categorie_nomCategorie
            } : undefined
        }));
    }
    static async getOne(idPrestation) {
        const [rows] = await dbconfig_1.default.execute(`
            SELECT
                p.idPrestation,
                p.nomPrestation,
                p.prix_TTC,
                p.idCategorie,
                c.nomCategorie as categorie_nomCategorie
            FROM Prestation p
            LEFT JOIN Categorie c ON p.idCategorie = c.idCategorie
            WHERE p.idPrestation = ?
        `, [idPrestation]);
        if (rows.length === 0)
            return null;
        const row = rows[0];
        return {
            idPrestation: row.idPrestation,
            nomPrestation: row.nomPrestation,
            prix_TTC: row.prix_TTC,
            idCategorie: row.idCategorie,
            categorie: row.categorie_nomCategorie ? {
                idCategorie: row.idCategorie,
                nomCategorie: row.categorie_nomCategorie
            } : undefined
        };
    }
    static async update(idPrestation, prestation) {
        const [result] = await dbconfig_1.default.execute(`UPDATE Prestation SET nomPrestation = ?, prix_TTC = ?, idCategorie = ? WHERE idPrestation = ?`, [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie, idPrestation]);
        return result.affectedRows;
    }
    static async delete(idPrestation) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM Prestation WHERE idPrestation = ?`, [idPrestation]);
        return result.affectedRows;
    }
}
exports.Prestation = Prestation;
