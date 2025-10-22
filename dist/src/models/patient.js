"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Patient {
    static async create(patient) {
        const result = await dbconfig_1.default.query(`INSERT INTO Patient (nomPatient, prenomPatient, adressePatient, numPatient, mailPatient)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING idPatient`, [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient]);
        return result.rows[0].idpatient;
    }
    static async getAll() {
        const result = await dbconfig_1.default.query(`SELECT * FROM Patient`);
        return result.rows;
    }
    static async getOne(idPatient) {
        const result = await dbconfig_1.default.query(`SELECT * FROM Patient WHERE idPatient = $1`, [idPatient]);
        return result.rows.length ? result.rows[0] : null;
    }
    static async update(idPatient, patient) {
        const result = await dbconfig_1.default.query(`UPDATE Patient
             SET nomPatient = $1, prenomPatient = $2, adressePatient = $3, numPatient = $4, mailPatient = $5
             WHERE idPatient = $6`, [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient, idPatient]);
        return result.rowCount || 0;
    }
    static async delete(idPatient) {
        const result = await dbconfig_1.default.query(`DELETE FROM Patient WHERE idPatient = $1`, [idPatient]);
        return result.rowCount || 0;
    }
}
exports.Patient = Patient;
