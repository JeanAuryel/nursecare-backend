"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employe = exports.RoleEmploye = void 0;
const dbconfig_1 = __importDefault(require("../config/dbconfig"));
const bcrypt_1 = __importDefault(require("bcrypt"));
var RoleEmploye;
(function (RoleEmploye) {
    RoleEmploye["INFIRMIER"] = "INFIRMIER";
    RoleEmploye["DIRECTEUR"] = "DIRECTEUR";
    RoleEmploye["SECRETAIRE"] = "SECRETAIRE";
})(RoleEmploye || (exports.RoleEmploye = RoleEmploye = {}));
class Employe {
    /**
     * Vérifie si un mot de passe est déjà haché
     */
    static isPasswordHashed(mdpEmploye) {
        return mdpEmploye.startsWith('$2b$') || mdpEmploye.startsWith('$2a$') || mdpEmploye.startsWith('$2y$');
    }
    /**
     * Hache un mot de passe s'il n'est pas déjà haché
     */
    static async hashPasswordIfNeeded(mdpEmploye) {
        if (this.isPasswordHashed(mdpEmploye)) {
            console.log('🔍 Mot de passe déjà haché, pas de modification nécessaire');
            return mdpEmploye;
        }
        console.log('🔑 Hachage du mot de passe en cours...');
        const hashedPassword = await bcrypt_1.default.hash(mdpEmploye, 10);
        console.log('✅ Mot de passe haché avec succès');
        return hashedPassword;
    }
    static async create(employe) {
        // Hasher le mot de passe automatiquement
        const hashedPassword = await bcrypt_1.default.hash(employe.mdpEmploye, 10);
        const [result] = await dbconfig_1.default.execute('INSERT INTO Employe (mailEmploye, mdpEmploye, prenomEmploye, nomEmploye, roleEmploye) VALUES (?, ?, ?, ?, ?)', [employe.mailEmploye, hashedPassword, employe.prenomEmploye, employe.nomEmploye, employe.roleEmploye]);
        return employe.mailEmploye;
    }
    static async findByEmail(email) {
        const [rows] = await dbconfig_1.default.execute('SELECT * FROM Employe WHERE mailEmploye = ?', [email]);
        if (!rows.length)
            return null;
        const employe = rows[0];
        employe.roleEmploye = employe.roleEmploye;
        return employe;
    }
    static async update(email, employe) {
        let query = 'UPDATE Employe SET ';
        const params = [];
        if (employe.prenomEmploye) {
            query += 'prenomEmploye = ?, ';
            params.push(employe.prenomEmploye);
        }
        if (employe.nomEmploye) {
            query += 'nomEmploye = ?, ';
            params.push(employe.nomEmploye);
        }
        if (employe.mdpEmploye) {
            query += 'mdpEmploye = ?, ';
            // Hasher le nouveau mot de passe automatiquement
            const hashedPassword = await this.hashPasswordIfNeeded(employe.mdpEmploye);
            params.push(hashedPassword);
        }
        // Enlever la virgule et l'espace à la fin
        query = query.slice(0, -2);
        query += ' WHERE mailEmploye = ?';
        params.push(email);
        const [result] = await dbconfig_1.default.execute(query, params);
        return result.affectedRows > 0;
    }
    static async getAll() {
        const [rows] = await dbconfig_1.default.execute('SELECT * FROM Employe');
        return rows;
    }
    static async verifyPassword(email, password) {
        const employe = await this.findByEmail(email);
        if (!employe) {
            console.log(`❌ Utilisateur non trouvé: ${email}`);
            return false;
        }
        // Si le mot de passe en base n'est pas haché, le hasher maintenant
        if (!this.isPasswordHashed(employe.mdpEmploye)) {
            console.log(`🔄 Migration du mot de passe pour: ${email}`);
            // Vérifier d'abord si le mot de passe en clair correspond
            if (employe.mdpEmploye === password) {
                // Hasher et mettre à jour
                const hashedPassword = await bcrypt_1.default.hash(password, 10);
                await dbconfig_1.default.execute('UPDATE Employe SET MDPEmploye = ? WHERE mailEmploye = ?', [hashedPassword, email]);
                console.log(`✅ Mot de passe migré pour: ${email}`);
                return true;
            }
            else {
                console.log(`❌ Mot de passe incorrect pour: ${email}`);
                return false;
            }
        }
        // Vérification normale avec bcrypt
        const isValid = await bcrypt_1.default.compare(password, employe.mdpEmploye);
        console.log(`🔐 Vérification pour ${email}: ${isValid ? '✅ OK' : '❌ KO'}`);
        return isValid;
    }
}
exports.Employe = Employe;
