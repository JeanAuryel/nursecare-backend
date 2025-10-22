import pool from '../config/dbconfig';

export interface IPatient {
    idPatient?: number;
    nomPatient: string;
    prenomPatient: string;
    adressePatient: string;
    numPatient: string;
    mailPatient: string;
}

export class Patient {
    static async create(patient: IPatient): Promise<number> {
        const result = await pool.query(
            `INSERT INTO Patient (nomPatient, prenomPatient, adressePatient, numPatient, mailPatient)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING idPatient`,
            [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient]
        );
        return result.rows[0].idpatient;
    }

    static async getAll(): Promise<IPatient[]> {
        const result = await pool.query(`SELECT * FROM Patient`);
        return result.rows;
    }

    static async getOne(idPatient: number): Promise<IPatient | null> {
        const result = await pool.query(`SELECT * FROM Patient WHERE idPatient = $1`, [idPatient]);
        return result.rows.length ? result.rows[0] : null;
    }

    static async update(idPatient: number, patient: IPatient): Promise<number> {
        const result = await pool.query(
            `UPDATE Patient
             SET nomPatient = $1, prenomPatient = $2, adressePatient = $3, numPatient = $4, mailPatient = $5
             WHERE idPatient = $6`,
            [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient, idPatient]
        );
        return result.rowCount || 0;
    }

    static async delete(idPatient: number): Promise<number> {
        const result = await pool.query(`DELETE FROM Patient WHERE idPatient = $1`, [idPatient]);
        return result.rowCount || 0;
    }
}
