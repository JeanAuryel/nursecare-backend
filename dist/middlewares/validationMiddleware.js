"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateParams = validateParams;
function validateBody(rules) {
    return (req, res, next) => {
        const errors = [];
        for (const rule of rules) {
            const value = req.body[rule.field];
            // Vérification si le champ est requis
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`Le champ ${rule.field} est requis.`);
                continue;
            }
            // Si le champ n'est pas requis et vide, on passe au suivant
            if (!rule.required && (value === undefined || value === null || value === '')) {
                continue;
            }
            // Validation du type
            if (rule.type) {
                switch (rule.type) {
                    case 'string':
                        if (typeof value !== 'string') {
                            errors.push(`Le champ ${rule.field} doit être une chaîne de caractères.`);
                        }
                        break;
                    case 'number':
                        if (isNaN(Number(value))) {
                            errors.push(`Le champ ${rule.field} doit être un nombre.`);
                        }
                        break;
                    case 'email':
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            errors.push(`Le champ ${rule.field} doit être un email valide.`);
                        }
                        break;
                    case 'date':
                        if (isNaN(Date.parse(value))) {
                            errors.push(`Le champ ${rule.field} doit être une date valide.`);
                        }
                        break;
                }
            }
            // Validation de la longueur pour les chaînes
            if (typeof value === 'string') {
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`Le champ ${rule.field} doit contenir au moins ${rule.minLength} caractères.`);
                }
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`Le champ ${rule.field} ne peut pas dépasser ${rule.maxLength} caractères.`);
                }
            }
            // Validation des valeurs numériques
            if (rule.type === 'number' && !isNaN(Number(value))) {
                const numValue = Number(value);
                if (rule.min !== undefined && numValue < rule.min) {
                    errors.push(`Le champ ${rule.field} doit être supérieur ou égal à ${rule.min}.`);
                }
                if (rule.max !== undefined && numValue > rule.max) {
                    errors.push(`Le champ ${rule.field} doit être inférieur ou égal à ${rule.max}.`);
                }
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Erreurs de validation",
                errors
            });
        }
        next();
    };
}
function validateParams(rules) {
    return (req, res, next) => {
        const errors = [];
        for (const rule of rules) {
            const value = req.params[rule.field];
            if (rule.required && !value) {
                errors.push(`Le paramètre ${rule.field} est requis.`);
                continue;
            }
            if (rule.type === 'number' && value && isNaN(Number(value))) {
                errors.push(`Le paramètre ${rule.field} doit être un nombre.`);
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Erreurs de validation des paramètres",
                errors
            });
        }
        next();
    };
}
