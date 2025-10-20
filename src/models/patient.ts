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
        const [result]: any = await pool.execute(
            `INSERT INTO Patient (nomPatient, prenomPatient, adressePatient, numPatient, mailPatient)
             VALUES (?, ?, ?, ?, ?)`,
            [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient]
        );
        return result.insertId;
    }

    static async getAll(): Promise<IPatient[]> {
        const [rows]: any = await pool.execute(`SELECT * FROM Patient`);
        return rows;
    }

    static async getOne(idPatient: number): Promise<IPatient | null> {
        const [rows]: any = await pool.execute(`SELECT * FROM Patient WHERE idPatient = ?`, [idPatient]);
        return rows.length ? rows[0] : null;
    }

    static async update(idPatient: number, patient: IPatient): Promise<number> {
        const [result]: any = await pool.execute(
            `UPDATE Patient
             SET nomPatient = ?, prenomPatient = ?, adressePatient = ?, numPatient = ?, mailPatient = ?
             WHERE idPatient = ?`,
            [patient.nomPatient, patient.prenomPatient, patient.adressePatient, patient.numPatient, patient.mailPatient, idPatient]
        );
        return result.affectedRows;
    }

    static async delete(idPatient: number): Promise<number> {
        const [result]: any = await pool.execute(`DELETE FROM Patient WHERE idPatient = ?`, [idPatient]);
        return result.affectedRows;
    }
}
