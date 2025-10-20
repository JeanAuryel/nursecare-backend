"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
class Patient {
    static async create(patient) {
        const [result] = await dbconfig_1.default.execute(`INSERT INTO Patient (nomPatient, prenomPatient, adressePatient, numPatient, mailPatient)
             VALUES (?, ?, ?, ?, ?)`, [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient]);
        return result.insertId;
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Patient`);
        return rows;
    }
    static async getOne(idPatient) {
        const [rows] = await dbconfig_1.default.execute(`SELECT * FROM Patient WHERE idPatient = ?`, [idPatient]);
        return rows.length ? rows[0] : null;
    }
    static async update(idPatient, patient) {
        const [result] = await dbconfig_1.default.execute(`UPDATE Patient
             SET nomPatient = ?, prenomPatient = ?, adressePatient = ?, numPatient = ?, mailPatient = ?
             WHERE idPatient = ?`, [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient, idPatient]);
        return result.affectedRows;
    }
    static async delete(idPatient) {
        const [result] = await dbconfig_1.default.execute(`DELETE FROM Patient WHERE idPatient = ?`, [idPatient]);
        return result.affectedRows;
    }
}
exports.Patient = Patient;
