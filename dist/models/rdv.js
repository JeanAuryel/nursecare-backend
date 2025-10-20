"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rdv = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Rdv {
    static async create(rdv) {
        await dbconfig_1.default.execute(`INSERT INTO rdv (
                idEmploye, idPrestation, idPatient, idStagiaire,
                timestamp_RDV_prevu, timestamp_RDV_reel, timestamp_RDV_facture, timestamp_RDV_integrePGI,
                noteStagiaire, commentaireStagiaire
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            rdv.idEmploye, rdv.idPrestation, rdv.idPatient, rdv.idStagiaire,
            rdv.timestamp_RDV_prevu, rdv.timestamp_RDV_reel, rdv.timestamp_RDV_facture, rdv.timestamp_RDV_integrePGI,
            rdv.noteStagiaire, rdv.commentaireStagiaire
        ]);
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM rdv`);
        return rows;
    }
    static async getOne(idEmploye, idPrestation, idPatient, idStagiaire) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM rdv WHERE idEmploye = ? AND idPrestation = ? AND idPatient = ? AND idStagiaire = ?`, [idEmploye, idPrestation, idPatient, idStagiaire]);
        return rows.length ? rows[0] : null;
    }
    static async update(rdv) {
        const [result] = await dbconfig_1.default.execute(`UPDATE rdv SET
                timestamp_RDV_prevu = ?, timestamp_RDV_reel = ?, timestamp_RDV_facture = ?, timestamp_RDV_integrePGI = ?,
                noteStagiaire = ?, commentaireStagiaire = ?
             WHERE idEmploye = ? AND idPrestation = ? AND idPatient = ? AND idStagiaire = ?`, [
            rdv.timestamp_RDV_prevu, rdv.timestamp_RDV_reel, rdv.timestamp_RDV_facture, rdv.timestamp_RDV_integrePGI,
            rdv.noteStagiaire, rdv.commentaireStagiaire,
            rdv.idEmploye, rdv.idPrestation, rdv.idPatient, rdv.idStagiaire
        ]);
        return result.affectedRows;
    }
    static async delete(idEmploye, idPrestation, idPatient, idStagiaire) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM rdv WHERE idEmploye = ? AND idPrestation = ? AND idPatient = ? AND idStagiaire = ?`, [idEmploye, idPrestation, idPatient, idStagiaire]);
        return result.affectedRows;
    }
}
exports.Rdv = Rdv;
