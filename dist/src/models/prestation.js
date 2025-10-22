"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prestation = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Prestation {
    static async create(prestation) {
        const result = await dbconfig_1.default.query(`INSERT INTO Prestation (nomPrestation, prix_TTC, idCategorie) VALUES ($1, $2, $3) RETURNING idPrestation`, [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie]);
        return result.rows[0].idprestation;
    }
    static async getAll() {
        const result = await dbconfig_1.default.query(`
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
        return result.rows.map((row) => ({
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
        const result = await dbconfig_1.default.query(`
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
        if (result.rows.length === 0)
            return null;
        const row = result.rows[0];
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
        const result = await dbconfig_1.default.query(`UPDATE Prestation SET nomPrestation = $1, prix_TTC = $2, idCategorie = $3 WHERE idPrestation = $4`, [prestation.nomPrestation, prestation.prix_TTC, prestation.idCategorie, idPrestation]);
        return result.rowCount || 0;
    }
    static async delete(idPrestation) {
        const result = await dbconfig_1.default.query(`DELETE FROM Prestation WHERE idPrestation = $1`, [idPrestation]);
        return result.rowCount || 0;
    }
}
exports.Prestation = Prestation;
