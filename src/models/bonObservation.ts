import pool from '../config/dbconfig';

export interface IBonObservation {
    idBonObservation?: number;
    idRDV: number;
    idStagiaire: number;
    idPrestation: number;
    dateHeureObservation: Date;
    noteStagiaire: number; // Note de 1 à 5
    commentaireStagiaire?: string;
    idEmployeEvaluateur: number;
    dateCreation?: Date;
}

export interface IBonObservationDetailed extends IBonObservation {
    rdv?: {
        idRDV: number;
        dateHeurePrevu: Date;
        patient: {
            nomPatient: string;
            prenomPatient: string;
        };
    };
    stagiaire?: {
        idStagiaire: number;
        nomStagiaire: string;
        prenomStagiaire: string;
        ecole: {
            nomEcole: string;
        };
    };
    prestation?: {
        idPrestation: number;
        nomPrestation: string;
        nomCategorie: string;
    };
    evaluateur?: {
        idEmploye: number;
        nomEmploye: string;
        prenomEmploye: string;
    };
}

export class BonObservation {
    /**
     * Créer un nouveau bon d'observation
     */
    static async create(bon: Omit<IBonObservation, 'idBonObservation'>): Promise<number> {
        // Vérifier que la note est entre 1 et 5
        if (bon.noteStagiaire < 1 || bon.noteStagiaire > 5) {
            throw new Error('La note doit être comprise entre 1 et 5');
        }

        const result = await pool.query(
            `INSERT INTO "BonObservation" (
                "idRDV", "idStagiaire", "idPrestation",
                "dateHeureObservation", "noteStagiaire",
                "commentaireStagiaire", "idEmployeEvaluateur"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING "idBonObservation"`,
            [
                bon.idRDV,
                bon.idStagiaire,
                bon.idPrestation,
                bon.dateHeureObservation,
                bon.noteStagiaire,
                bon.commentaireStagiaire || null,
                bon.idEmployeEvaluateur
            ]
        );

        return result.rows[0].idBonObservation;
    }

    /**
     * Récupérer un bon d'observation par ID
     */
    static async findById(idBonObservation: number): Promise<IBonObservation | null> {
        const result = await pool.query(
            `SELECT * FROM "BonObservation" WHERE "idBonObservation" = $1`,
            [idBonObservation]
        );

        if (!result.rows.length) return null;
        return result.rows[0] as IBonObservation;
    }

    /**
     * Récupérer un bon d'observation détaillé avec toutes les jointures
     */
    static async findByIdDetailed(idBonObservation: number): Promise<IBonObservationDetailed | null> {
        const result = await pool.query(
            `SELECT
                bo.*,
                r."dateHeurePrevu",
                p_patient."nomPatient",
                p_patient."prenomPatient",
                s."nomStagiaire",
                s."prenomStagiaire",
                ec."nomEcole",
                pr."nomPrestation",
                c."nomCategorie",
                e."nomEmploye",
                e."prenomEmploye"
             FROM "BonObservation" bo
             INNER JOIN "RDV" r ON bo."idRDV" = r."idRDV"
             INNER JOIN "Patient" p_patient ON r."idPatient" = p_patient."idPatient"
             INNER JOIN "Stagiaire" s ON bo."idStagiaire" = s."idStagiaire"
             INNER JOIN "Ecole" ec ON s."idEcole" = ec."idEcole"
             INNER JOIN "Prestation" pr ON bo."idPrestation" = pr."idPrestation"
             INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
             INNER JOIN "Employe" e ON bo."idEmployeEvaluateur" = e."idEmploye"
             WHERE bo."idBonObservation" = $1`,
            [idBonObservation]
        );

        if (!result.rows.length) return null;

        const row = result.rows[0];
        return {
            idBonObservation: row.idBonObservation,
            idRDV: row.idRDV,
            idStagiaire: row.idStagiaire,
            idPrestation: row.idPrestation,
            dateHeureObservation: row.dateHeureObservation,
            noteStagiaire: row.noteStagiaire,
            commentaireStagiaire: row.commentaireStagiaire,
            idEmployeEvaluateur: row.idEmployeEvaluateur,
            dateCreation: row.dateCreation,
            rdv: {
                idRDV: row.idRDV,
                dateHeurePrevu: row.dateHeurePrevu,
                patient: {
                    nomPatient: row.nomPatient,
                    prenomPatient: row.prenomPatient
                }
            },
            stagiaire: {
                idStagiaire: row.idStagiaire,
                nomStagiaire: row.nomStagiaire,
                prenomStagiaire: row.prenomStagiaire,
                ecole: {
                    nomEcole: row.nomEcole
                }
            },
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: row.nomCategorie
            },
            evaluateur: {
                idEmploye: row.idEmployeEvaluateur,
                nomEmploye: row.nomEmploye,
                prenomEmploye: row.prenomEmploye
            }
        };
    }

    /**
     * Récupérer tous les bons d'observation d'un stagiaire
     */
    static async getByStagiaire(idStagiaire: number): Promise<IBonObservationDetailed[]> {
        const result = await pool.query(
            `SELECT
                bo.*,
                r."dateHeurePrevu",
                pr."nomPrestation",
                c."nomCategorie",
                e."nomEmploye",
                e."prenomEmploye"
             FROM "BonObservation" bo
             INNER JOIN "RDV" r ON bo."idRDV" = r."idRDV"
             INNER JOIN "Prestation" pr ON bo."idPrestation" = pr."idPrestation"
             INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie"
             INNER JOIN "Employe" e ON bo."idEmployeEvaluateur" = e."idEmploye"
             WHERE bo."idStagiaire" = $1
             ORDER BY bo."dateHeureObservation" DESC`,
            [idStagiaire]
        );

        return result.rows.map(row => ({
            idBonObservation: row.idBonObservation,
            idRDV: row.idRDV,
            idStagiaire: row.idStagiaire,
            idPrestation: row.idPrestation,
            dateHeureObservation: row.dateHeureObservation,
            noteStagiaire: row.noteStagiaire,
            commentaireStagiaire: row.commentaireStagiaire,
            idEmployeEvaluateur: row.idEmployeEvaluateur,
            rdv: {
                idRDV: row.idRDV,
                dateHeurePrevu: row.dateHeurePrevu,
                patient: { nomPatient: '', prenomPatient: '' }
            },
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: row.nomCategorie
            },
            evaluateur: {
                idEmploye: row.idEmployeEvaluateur,
                nomEmploye: row.nomEmploye,
                prenomEmploye: row.prenomEmploye
            }
        }));
    }

    /**
     * Récupérer tous les bons d'observation d'un RDV
     */
    static async getByRDV(idRDV: number): Promise<IBonObservationDetailed[]> {
        const result = await pool.query(
            `SELECT
                bo.*,
                s."nomStagiaire",
                s."prenomStagiaire",
                pr."nomPrestation",
                e."nomEmploye",
                e."prenomEmploye"
             FROM "BonObservation" bo
             INNER JOIN "Stagiaire" s ON bo."idStagiaire" = s."idStagiaire"
             INNER JOIN "Prestation" pr ON bo."idPrestation" = pr."idPrestation"
             INNER JOIN "Employe" e ON bo."idEmployeEvaluateur" = e."idEmploye"
             WHERE bo."idRDV" = $1
             ORDER BY bo."dateHeureObservation" DESC`,
            [idRDV]
        );

        return result.rows.map(row => ({
            idBonObservation: row.idBonObservation,
            idRDV: row.idRDV,
            idStagiaire: row.idStagiaire,
            idPrestation: row.idPrestation,
            dateHeureObservation: row.dateHeureObservation,
            noteStagiaire: row.noteStagiaire,
            commentaireStagiaire: row.commentaireStagiaire,
            idEmployeEvaluateur: row.idEmployeEvaluateur,
            stagiaire: {
                idStagiaire: row.idStagiaire,
                nomStagiaire: row.nomStagiaire,
                prenomStagiaire: row.prenomStagiaire,
                ecole: { nomEcole: '' }
            },
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: ''
            },
            evaluateur: {
                idEmploye: row.idEmployeEvaluateur,
                nomEmploye: row.nomEmploye,
                prenomEmploye: row.prenomEmploye
            }
        }));
    }

    /**
     * Récupérer tous les bons d'observation d'un évaluateur (infirmier)
     */
    static async getByEvaluateur(idEmployeEvaluateur: number): Promise<IBonObservationDetailed[]> {
        const result = await pool.query(
            `SELECT
                bo.*,
                s."nomStagiaire",
                s."prenomStagiaire",
                pr."nomPrestation",
                r."dateHeurePrevu"
             FROM "BonObservation" bo
             INNER JOIN "Stagiaire" s ON bo."idStagiaire" = s."idStagiaire"
             INNER JOIN "Prestation" pr ON bo."idPrestation" = pr."idPrestation"
             INNER JOIN "RDV" r ON bo."idRDV" = r."idRDV"
             WHERE bo."idEmployeEvaluateur" = $1
             ORDER BY bo."dateHeureObservation" DESC`,
            [idEmployeEvaluateur]
        );

        return result.rows.map(row => ({
            idBonObservation: row.idBonObservation,
            idRDV: row.idRDV,
            idStagiaire: row.idStagiaire,
            idPrestation: row.idPrestation,
            dateHeureObservation: row.dateHeureObservation,
            noteStagiaire: row.noteStagiaire,
            commentaireStagiaire: row.commentaireStagiaire,
            idEmployeEvaluateur: row.idEmployeEvaluateur,
            rdv: {
                idRDV: row.idRDV,
                dateHeurePrevu: row.dateHeurePrevu,
                patient: { nomPatient: '', prenomPatient: '' }
            },
            stagiaire: {
                idStagiaire: row.idStagiaire,
                nomStagiaire: row.nomStagiaire,
                prenomStagiaire: row.prenomStagiaire,
                ecole: { nomEcole: '' }
            },
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: ''
            }
        }));
    }

    /**
     * Récupérer tous les bons d'observation
     */
    static async getAll(): Promise<IBonObservationDetailed[]> {
        const result = await pool.query(
            `SELECT
                bo.*,
                s."nomStagiaire",
                s."prenomStagiaire",
                ec."nomEcole",
                pr."nomPrestation",
                e."nomEmploye",
                e."prenomEmploye"
             FROM "BonObservation" bo
             INNER JOIN "Stagiaire" s ON bo."idStagiaire" = s."idStagiaire"
             INNER JOIN "Ecole" ec ON s."idEcole" = ec."idEcole"
             INNER JOIN "Prestation" pr ON bo."idPrestation" = pr."idPrestation"
             INNER JOIN "Employe" e ON bo."idEmployeEvaluateur" = e."idEmploye"
             ORDER BY bo."dateHeureObservation" DESC`
        );

        return result.rows.map(row => ({
            idBonObservation: row.idBonObservation,
            idRDV: row.idRDV,
            idStagiaire: row.idStagiaire,
            idPrestation: row.idPrestation,
            dateHeureObservation: row.dateHeureObservation,
            noteStagiaire: row.noteStagiaire,
            commentaireStagiaire: row.commentaireStagiaire,
            idEmployeEvaluateur: row.idEmployeEvaluateur,
            stagiaire: {
                idStagiaire: row.idStagiaire,
                nomStagiaire: row.nomStagiaire,
                prenomStagiaire: row.prenomStagiaire,
                ecole: {
                    nomEcole: row.nomEcole
                }
            },
            prestation: {
                idPrestation: row.idPrestation,
                nomPrestation: row.nomPrestation,
                nomCategorie: ''
            },
            evaluateur: {
                idEmploye: row.idEmployeEvaluateur,
                nomEmploye: row.nomEmploye,
                prenomEmploye: row.prenomEmploye
            }
        }));
    }

    /**
     * Mettre à jour un bon d'observation
     */
    static async update(idBonObservation: number, bon: Partial<IBonObservation>): Promise<boolean> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (bon.noteStagiaire !== undefined) {
            if (bon.noteStagiaire < 1 || bon.noteStagiaire > 5) {
                throw new Error('La note doit être comprise entre 1 et 5');
            }
            fields.push(`"noteStagiaire" = $${paramIndex++}`);
            values.push(bon.noteStagiaire);
        }

        if (bon.commentaireStagiaire !== undefined) {
            fields.push(`"commentaireStagiaire" = $${paramIndex++}`);
            values.push(bon.commentaireStagiaire);
        }

        if (bon.dateHeureObservation !== undefined) {
            fields.push(`"dateHeureObservation" = $${paramIndex++}`);
            values.push(bon.dateHeureObservation);
        }

        if (fields.length === 0) return false;

        values.push(idBonObservation);

        const result = await pool.query(
            `UPDATE "BonObservation" SET ${fields.join(', ')} WHERE "idBonObservation" = $${paramIndex}`,
            values
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Supprimer un bon d'observation
     */
    static async delete(idBonObservation: number): Promise<boolean> {
        const result = await pool.query(
            `DELETE FROM "BonObservation" WHERE "idBonObservation" = $1`,
            [idBonObservation]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

    /**
     * Calculer la moyenne des notes d'un stagiaire
     */
    static async getMoyenneStagiaire(idStagiaire: number): Promise<number> {
        const result = await pool.query(
            `SELECT AVG("noteStagiaire") as moyenne
             FROM "BonObservation"
             WHERE "idStagiaire" = $1`,
            [idStagiaire]
        );

        return parseFloat(result.rows[0].moyenne || 0);
    }

    /**
     * Calculer la moyenne des notes par école
     */
    static async getMoyenneParEcole(): Promise<any[]> {
        const result = await pool.query(
            `SELECT
                e."idEcole",
                e."nomEcole",
                COUNT(DISTINCT s."idStagiaire") AS "nombreStagiaires",
                COUNT(bo."idBonObservation") AS "nombreObservations",
                AVG(bo."noteStagiaire") AS "moyenneNotes",
                MIN(bo."noteStagiaire") AS "noteMin",
                MAX(bo."noteStagiaire") AS "noteMax"
             FROM "Ecole" e
             LEFT JOIN "Stagiaire" s ON e."idEcole" = s."idEcole"
             LEFT JOIN "BonObservation" bo ON s."idStagiaire" = bo."idStagiaire"
             GROUP BY e."idEcole", e."nomEcole"
             ORDER BY "moyenneNotes" DESC`
        );

        return result.rows;
    }

    /**
     * Récupérer les statistiques d'un stagiaire
     */
    static async getStatsStagiaire(idStagiaire: number): Promise<any> {
        const result = await pool.query(
            `SELECT
                COUNT(bo."idBonObservation") AS "nombreEvaluations",
                AVG(bo."noteStagiaire") AS "moyenneNotes",
                MIN(bo."noteStagiaire") AS "noteMin",
                MAX(bo."noteStagiaire") AS "noteMax",
                COUNT(DISTINCT bo."idPrestation") AS "nombrePrestationsDifferentes"
             FROM "BonObservation" bo
             WHERE bo."idStagiaire" = $1`,
            [idStagiaire]
        );

        return result.rows[0];
    }
}
