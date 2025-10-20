import pool from '../config/dbconfig';

export interface IRdv {
    idRdv?: number;
    idEmploye: number;
    idPrestation: number;
    idPatient: number;
    idStagiaire: number;
    timestamp_RDV_prevu: Date;
    timestamp_RDV_reel?: Date | null;
    timestamp_RDV_facture?: Date | null;
    timestamp_RDV_integrePGI?: Date | null;
    noteStagiaire?: number | null;
    commentaireStagiaire?: string | null;
}

export interface IRdvDetailed extends IRdv {
    employe?: {
        nomEmploye: string;
        prenomEmploye: string;
    };
    prestation?: {
        nomPrestation: string;
        prix_TTC: number;
    };
    patient?: {
        nomPatient: string;
        prenomPatient: string;
        adressePatient: string;
        numPatient: string;
    };
    stagiaire?: {
        nomStagiaire: string;
        prenomStagiaire: string;
    };
}

export class Rdv {
    static async create(rdv: IRdv): Promise<void> {
        await pool.execute(
            `INSERT INTO RDV (
                idEmploye, idPrestation, idPatient, idStagiaire,
                timestamp_RDV_prevu, timestamp_RDV_reel, timestamp_RDV_facture, timestamp_RDV_integrePGI,
                noteStagiaire, commentaireStagiaire
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                rdv.idEmploye, rdv.idPrestation, rdv.idPatient, rdv.idStagiaire,
                rdv.timestamp_RDV_prevu, rdv.timestamp_RDV_reel, rdv.timestamp_RDV_facture, rdv.timestamp_RDV_integrePGI,
                rdv.noteStagiaire, rdv.commentaireStagiaire
            ]
        );
    }

    static async getAll(): Promise<IRdvDetailed[]> {
        try {
            const [rows]: any = await pool.execute(`
                SELECT
                    r.*,
                    JSON_OBJECT(
                        'idEmploye', e.idEmploye,
                        'nomEmploye', e.nomEmploye,
                        'prenomEmploye', e.prenomEmploye,
                        'mailEmploye', e.mailEmploye,
                        'roleEmploye', e.roleEmploye
                    ) as employe,
                    JSON_OBJECT(
                        'idPrestation', pr.idPrestation,
                        'nomPrestation', pr.nomPrestation,
                        'prix_TTC', pr.prix_TTC,
                        'idCategorie', pr.idCategorie
                    ) as prestation,
                    JSON_OBJECT(
                        'idPatient', p.idPatient,
                        'nomPatient', p.nomPatient,
                        'prenomPatient', p.prenomPatient,
                        'adressePatient', p.adressePatient,
                        'numPatient', p.numPatient,
                        'mailPatient', p.mailPatient
                    ) as patient,
                    JSON_OBJECT(
                        'idStagiaire', s.idStagiaire,
                        'nomStagiaire', s.nomStagiaire,
                        'prenomStagiaire', s.prenomStagiaire
                    ) as stagiaire
                FROM RDV r
                LEFT JOIN Employe e ON r.idEmploye = e.idEmploye
                LEFT JOIN Prestation pr ON r.idPrestation = pr.idPrestation
                LEFT JOIN Patient p ON r.idPatient = p.idPatient
                LEFT JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
                ORDER BY r.timestamp_RDV_prevu DESC
            `);

            // Parse JSON objects
            return rows.map((row: any) => {
                try {
                    return {
                        ...row,
                        employe: typeof row.employe === 'string' ? JSON.parse(row.employe) : row.employe,
                        prestation: typeof row.prestation === 'string' ? JSON.parse(row.prestation) : row.prestation,
                        patient: typeof row.patient === 'string' ? JSON.parse(row.patient) : row.patient,
                        stagiaire: typeof row.stagiaire === 'string' ? JSON.parse(row.stagiaire) : row.stagiaire
                    };
                } catch (parseError) {
                    console.error('Erreur parsing JSON pour RDV:', row.idRdv, parseError);
                    return row;
                }
            });
        } catch (error) {
            console.error('Erreur SQL dans Rdv.getAll():', error);
            throw error;
        }
    }

    static async getOne(idEmploye: number, idPrestation: number, idPatient: number, idStagiaire: number): Promise<IRdv | null> {
        const [rows]: any = await pool.execute(
            `SELECT * FROM RDV WHERE idEmploye = ? AND idPrestation = ? AND idPatient = ? AND idStagiaire = ?`,
            [idEmploye, idPrestation, idPatient, idStagiaire]
        );
        return rows.length ? rows[0] : null;
    }

    static async update(rdv: IRdv): Promise<number> {
        const [result]: any = await pool.execute(
            `UPDATE RDV SET
                timestamp_RDV_prevu = ?, timestamp_RDV_reel = ?, timestamp_RDV_facture = ?, timestamp_RDV_integrePGI = ?,
                noteStagiaire = ?, commentaireStagiaire = ?
             WHERE idEmploye = ? AND idPrestation = ? AND idPatient = ? AND idStagiaire = ?`,
            [
                rdv.timestamp_RDV_prevu, rdv.timestamp_RDV_reel, rdv.timestamp_RDV_facture, rdv.timestamp_RDV_integrePGI,
                rdv.noteStagiaire, rdv.commentaireStagiaire,
                rdv.idEmploye, rdv.idPrestation, rdv.idPatient, rdv.idStagiaire
            ]
        );
        return result.affectedRows;
    }

    static async delete(idEmploye: number, idPrestation: number, idPatient: number, idStagiaire: number): Promise<number> {
        const [result]: any = await pool.execute(
            `DELETE FROM RDV WHERE idEmploye = ? AND idPrestation = ? AND idPatient = ? AND idStagiaire = ?`,
            [idEmploye, idPrestation, idPatient, idStagiaire]
        );
        return result.affectedRows;
    }

    /**
     * Récupérer toutes les prestations réalisées avec détails
     */
    static async getPrestationsRealisees(): Promise<IRdvDetailed[]> {
        const [rows]: any = await pool.execute(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.timestamp_RDV_reel IS NOT NULL
            ORDER BY r.timestamp_RDV_reel DESC
        `);
        return rows;
    }

    /**
     * Récupérer les prestations à facturer (réalisées mais pas encore facturées)
     */
    static async getPrestationsAFacturer(): Promise<IRdvDetailed[]> {
        const [rows]: any = await pool.execute(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.timestamp_RDV_reel IS NOT NULL
            AND r.timestamp_RDV_facture IS NULL
            ORDER BY r.timestamp_RDV_reel DESC
        `);
        return rows;
    }

    /**
     * Récupérer les prestations facturées
     */
    static async getPrestationsFacturees(): Promise<IRdvDetailed[]> {
        const [rows]: any = await pool.execute(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.timestamp_RDV_facture IS NOT NULL
            ORDER BY r.timestamp_RDV_facture DESC
        `);
        return rows;
    }

    /**
     * Marquer une prestation comme facturée
     */
    static async marquerFacturee(idRdv: number): Promise<boolean> {
        const [result]: any = await pool.execute(
            `UPDATE RDV SET timestamp_RDV_facture = NOW() WHERE idRdv = ?`,
            [idRdv]
        );
        return result.affectedRows > 0;
    }

    /**
     * Marquer une prestation comme intégrée au PGI
     */
    static async marquerIntegrePGI(idRdv: number): Promise<boolean> {
        const [result]: any = await pool.execute(
            `UPDATE RDV SET timestamp_RDV_integrePGI = NOW() WHERE idRdv = ?`,
            [idRdv]
        );
        return result.affectedRows > 0;
    }

    /**
     * Récupérer une prestation par ID avec détails
     */
    static async getById(idRdv: number): Promise<IRdvDetailed | null> {
        const [rows]: any = await pool.execute(`
            SELECT
                r.*,
                e.nomEmploye,
                e.prenomEmploye,
                pr.nomPrestation,
                pr.prix_TTC,
                p.nomPatient,
                p.prenomPatient,
                p.adressePatient,
                p.numPatient,
                s.nomStagiaire,
                s.prenomStagiaire
            FROM RDV r
            INNER JOIN Employe e ON r.idEmploye = e.idEmploye
            INNER JOIN Prestation pr ON r.idPrestation = pr.idPrestation
            INNER JOIN Patient p ON r.idPatient = p.idPatient
            INNER JOIN Stagiaire s ON r.idStagiaire = s.idStagiaire
            WHERE r.idRdv = ?
        `, [idRdv]);
        return rows.length > 0 ? rows[0] : null;
    }
}
