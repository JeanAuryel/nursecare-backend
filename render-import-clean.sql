-- Import PostgreSQL pour Render
-- Schéma fourni par l'utilisateur + Données de test

BEGIN;

-- ============================================================================
-- Schéma PostgreSQL amélioré pour NurseCare
-- ============================================================================

-- Nettoyage préalable (optionnel - pour réinitialisation)
DROP TABLE IF EXISTS "BonObservation" CASCADE;
DROP TABLE IF EXISTS "RDV_Prestation" CASCADE;
DROP TABLE IF EXISTS "RDV" CASCADE;
DROP TABLE IF EXISTS "Stagiaire" CASCADE;
DROP TABLE IF EXISTS "Prestation" CASCADE;
DROP TABLE IF EXISTS "Categorie" CASCADE;
DROP TABLE IF EXISTS "Patient" CASCADE;
DROP TABLE IF EXISTS "Employe" CASCADE;
DROP TABLE IF EXISTS "Ecole" CASCADE;
DROP TYPE IF EXISTS role_employe CASCADE;
DROP TYPE IF EXISTS statut_rdv CASCADE;

-- ============================================================================
-- Types ENUM
-- ============================================================================

-- Type ENUM pour les rôles des employés
CREATE TYPE role_employe AS ENUM ('INFIRMIER', 'SECRETAIRE', 'DIRECTEUR');

-- Type ENUM pour le statut des rendez-vous
CREATE TYPE statut_rdv AS ENUM ('PREVU', 'REALISE', 'ANNULE');

-- ============================================================================
-- Tables principales
-- ============================================================================

-- Table Employe (Personnel du cabinet)
CREATE TABLE "Employe"(
   "idEmploye" SERIAL,
   "nomEmploye" VARCHAR(50) NOT NULL,
   "prenomEmploye" VARCHAR(50) NOT NULL,
   "mailEmploye" VARCHAR(100) NOT NULL,
   "mdpEmploye" VARCHAR(255) NOT NULL,
   "roleEmploye" role_employe NOT NULL,
   "adresseEmploye" VARCHAR(255),
   "telephoneEmploye" VARCHAR(20),
   "actif" BOOLEAN DEFAULT TRUE,
   "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY("idEmploye"),
   CONSTRAINT "unique_mail_employe" UNIQUE("mailEmploye")
);

-- Table Patient
CREATE TABLE "Patient"(
   "idPatient" SERIAL,
   "nomPatient" VARCHAR(50) NOT NULL,
   "prenomPatient" VARCHAR(50) NOT NULL,
   "adressePatient" VARCHAR(255) NOT NULL,
   "codePostalPatient" VARCHAR(10),
   "villePatient" VARCHAR(50),
   "telephonePatient" VARCHAR(20) NOT NULL,
   "mailPatient" VARCHAR(100),
   "numSecuriteSociale" VARCHAR(15),
   "actif" BOOLEAN DEFAULT TRUE,
   "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY("idPatient"),
   CONSTRAINT "unique_mail_patient" UNIQUE("mailPatient")
);

-- Table Ecole (Organismes de formation)
CREATE TABLE "Ecole"(
   "idEcole" SERIAL,
   "nomEcole" VARCHAR(100) NOT NULL,
   "adresseEcole" VARCHAR(255),
   "telephoneEcole" VARCHAR(20),
   "mailEcole" VARCHAR(100),
   PRIMARY KEY("idEcole"),
   CONSTRAINT "unique_nom_ecole" UNIQUE("nomEcole")
);

-- Table Categorie (Catégories de prestations)
CREATE TABLE "Categorie"(
   "idCategorie" SERIAL,
   "nomCategorie" VARCHAR(50) NOT NULL,
   "descriptionCategorie" TEXT,
   PRIMARY KEY("idCategorie"),
   CONSTRAINT "unique_nom_categorie" UNIQUE("nomCategorie")
);

-- Table Prestation (Actes de soins)
CREATE TABLE "Prestation"(
   "idPrestation" SERIAL,
   "nomPrestation" VARCHAR(100) NOT NULL,
   "prixTTC" NUMERIC(15,2) NOT NULL,
   "dureeEstimee" INTEGER,
   "idCategorie" INTEGER NOT NULL,
   "actif" BOOLEAN DEFAULT TRUE,
   PRIMARY KEY("idPrestation"),
   FOREIGN KEY("idCategorie") REFERENCES "Categorie"("idCategorie") ON DELETE RESTRICT,
   CONSTRAINT "prix_positif" CHECK ("prixTTC" > 0),
   CONSTRAINT "duree_positive" CHECK ("dureeEstimee" IS NULL OR "dureeEstimee" > 0)
);

-- Table Stagiaire
CREATE TABLE "Stagiaire"(
   "idStagiaire" SERIAL,
   "nomStagiaire" VARCHAR(50) NOT NULL,
   "prenomStagiaire" VARCHAR(50) NOT NULL,
   "mailStagiaire" VARCHAR(100),
   "telephoneStagiaire" VARCHAR(20),
   "dateDebutStage" DATE,
   "dateFinStage" DATE,
   "idEcole" INTEGER NOT NULL,
   "actif" BOOLEAN DEFAULT TRUE,
   PRIMARY KEY("idStagiaire"),
   FOREIGN KEY("idEcole") REFERENCES "Ecole"("idEcole") ON DELETE RESTRICT,
   CONSTRAINT "dates_stage_valides" CHECK ("dateFinStage" IS NULL OR "dateFinStage" >= "dateDebutStage")
);

-- Table RDV (Rendez-vous d'intervention)
CREATE TABLE "RDV"(
   "idRDV" SERIAL,
   "idEmploye" INTEGER NOT NULL,
   "idPatient" INTEGER NOT NULL,
   "idStagiaire" INTEGER,
   "dateHeurePrevu" TIMESTAMP NOT NULL,
   "dateHeureReel" TIMESTAMP,
   "dureeEstimee" INTEGER,
   "dureeReelle" INTEGER,
   "statutRDV" statut_rdv DEFAULT 'PREVU',
   "commentaireRDV" TEXT,
   "dateHeureFacture" TIMESTAMP,
   "dateHeureIntegrePGI" TIMESTAMP,
   "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY("idRDV"),
   FOREIGN KEY("idEmploye") REFERENCES "Employe"("idEmploye") ON DELETE RESTRICT,
   FOREIGN KEY("idPatient") REFERENCES "Patient"("idPatient") ON DELETE RESTRICT,
   FOREIGN KEY("idStagiaire") REFERENCES "Stagiaire"("idStagiaire") ON DELETE SET NULL,
   CONSTRAINT "duree_estimee_positive" CHECK ("dureeEstimee" IS NULL OR "dureeEstimee" > 0),
   CONSTRAINT "duree_reelle_positive" CHECK ("dureeReelle" IS NULL OR "dureeReelle" > 0),
   CONSTRAINT "date_reelle_apres_prevu" CHECK ("dateHeureReel" IS NULL OR "dateHeureReel" >= "dateHeurePrevu" - INTERVAL '1 day')
);

-- Table de liaison RDV_Prestation (Un RDV peut avoir plusieurs prestations)
CREATE TABLE "RDV_Prestation"(
   "idRDV" INTEGER,
   "idPrestation" INTEGER,
   "quantite" INTEGER DEFAULT 1,
   "prixUnitaire" NUMERIC(15,2) NOT NULL,
   PRIMARY KEY("idRDV", "idPrestation"),
   FOREIGN KEY("idRDV") REFERENCES "RDV"("idRDV") ON DELETE CASCADE,
   FOREIGN KEY("idPrestation") REFERENCES "Prestation"("idPrestation") ON DELETE RESTRICT,
   CONSTRAINT "quantite_positive" CHECK ("quantite" > 0),
   CONSTRAINT "prix_unitaire_positif" CHECK ("prixUnitaire" > 0)
);

-- Table BonObservation (Évaluation des stagiaires)
CREATE TABLE "BonObservation"(
   "idBonObservation" SERIAL,
   "idRDV" INTEGER NOT NULL,
   "idStagiaire" INTEGER NOT NULL,
   "idPrestation" INTEGER NOT NULL,
   "dateHeureObservation" TIMESTAMP NOT NULL,
   "noteStagiaire" INTEGER NOT NULL,
   "commentaireStagiaire" TEXT,
   "idEmployeEvaluateur" INTEGER NOT NULL,
   "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY("idBonObservation"),
   FOREIGN KEY("idRDV") REFERENCES "RDV"("idRDV") ON DELETE CASCADE,
   FOREIGN KEY("idStagiaire") REFERENCES "Stagiaire"("idStagiaire") ON DELETE CASCADE,
   FOREIGN KEY("idPrestation") REFERENCES "Prestation"("idPrestation") ON DELETE RESTRICT,
   FOREIGN KEY("idEmployeEvaluateur") REFERENCES "Employe"("idEmploye") ON DELETE RESTRICT,
   CONSTRAINT "note_valide" CHECK ("noteStagiaire" >= 1 AND "noteStagiaire" <= 5)
);

-- ============================================================================
-- Index pour optimiser les performances
-- ============================================================================

CREATE INDEX "idx_prestation_categorie" ON "Prestation"("idCategorie");
CREATE INDEX "idx_stagiaire_ecole" ON "Stagiaire"("idEcole");
CREATE INDEX "idx_rdv_employe" ON "RDV"("idEmploye");
CREATE INDEX "idx_rdv_patient" ON "RDV"("idPatient");
CREATE INDEX "idx_rdv_stagiaire" ON "RDV"("idStagiaire");
CREATE INDEX "idx_rdv_prestation_rdv" ON "RDV_Prestation"("idRDV");
CREATE INDEX "idx_rdv_prestation_prestation" ON "RDV_Prestation"("idPrestation");
CREATE INDEX "idx_bon_rdv" ON "BonObservation"("idRDV");
CREATE INDEX "idx_bon_stagiaire" ON "BonObservation"("idStagiaire");
CREATE INDEX "idx_bon_evaluateur" ON "BonObservation"("idEmployeEvaluateur");
CREATE INDEX "idx_rdv_date_prevu" ON "RDV"("dateHeurePrevu");
CREATE INDEX "idx_rdv_statut" ON "RDV"("statutRDV");
CREATE INDEX "idx_rdv_date_facture" ON "RDV"("dateHeureFacture");
CREATE INDEX "idx_rdv_date_integre_pgi" ON "RDV"("dateHeureIntegrePGI");
CREATE INDEX "idx_employe_role" ON "Employe"("roleEmploye");
CREATE INDEX "idx_employe_actif" ON "Employe"("actif");
CREATE INDEX "idx_patient_actif" ON "Patient"("actif");
CREATE INDEX "idx_rdv_employe_date" ON "RDV"("idEmploye", "dateHeurePrevu");
CREATE INDEX "idx_rdv_patient_date" ON "RDV"("idPatient", "dateHeurePrevu");

-- ============================================================================
-- Triggers pour mise à jour automatique
-- ============================================================================

CREATE OR REPLACE FUNCTION update_date_modification()
RETURNS TRIGGER AS $$
BEGIN
    NEW."dateModification" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trigger_employe_date_modification"
    BEFORE UPDATE ON "Employe"
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER "trigger_patient_date_modification"
    BEFORE UPDATE ON "Patient"
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

CREATE TRIGGER "trigger_rdv_date_modification"
    BEFORE UPDATE ON "RDV"
    FOR EACH ROW
    EXECUTE FUNCTION update_date_modification();

-- ============================================================================
-- Vues utiles pour l'application
-- ============================================================================

CREATE OR REPLACE VIEW "vue_rdv_complet" AS
SELECT
    r."idRDV",
    r."dateHeurePrevu",
    r."dateHeureReel",
    r."statutRDV",
    e."idEmploye",
    e."nomEmploye",
    e."prenomEmploye",
    e."roleEmploye",
    p."idPatient",
    p."nomPatient",
    p."prenomPatient",
    p."adressePatient",
    p."villePatient",
    p."telephonePatient",
    s."idStagiaire",
    s."nomStagiaire",
    s."prenomStagiaire",
    r."dateHeureFacture",
    r."dateHeureIntegrePGI",
    r."commentaireRDV"
FROM "RDV" r
INNER JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
INNER JOIN "Patient" p ON r."idPatient" = p."idPatient"
LEFT JOIN "Stagiaire" s ON r."idStagiaire" = s."idStagiaire";

CREATE OR REPLACE VIEW "vue_prestations_rdv" AS
SELECT
    rp."idRDV",
    rp."idPrestation",
    pr."nomPrestation",
    c."nomCategorie",
    rp."quantite",
    rp."prixUnitaire",
    (rp."quantite" * rp."prixUnitaire") AS "montantTotal"
FROM "RDV_Prestation" rp
INNER JOIN "Prestation" pr ON rp."idPrestation" = pr."idPrestation"
INNER JOIN "Categorie" c ON pr."idCategorie" = c."idCategorie";

CREATE OR REPLACE VIEW "vue_stats_categorie" AS
SELECT
    c."idCategorie",
    c."nomCategorie",
    COUNT(DISTINCT r."idRDV") AS "nombreRDV",
    SUM(rp."quantite") AS "nombrePrestations",
    SUM(rp."quantite" * rp."prixUnitaire") AS "montantTotal"
FROM "Categorie" c
LEFT JOIN "Prestation" pr ON c."idCategorie" = pr."idCategorie"
LEFT JOIN "RDV_Prestation" rp ON pr."idPrestation" = rp."idPrestation"
LEFT JOIN "RDV" r ON rp."idRDV" = r."idRDV" AND r."statutRDV" = 'REALISE'
GROUP BY c."idCategorie", c."nomCategorie";

CREATE OR REPLACE VIEW "vue_moyenne_notes_ecole" AS
SELECT
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
GROUP BY e."idEcole", e."nomEcole";

CREATE OR REPLACE VIEW "vue_delai_traitement_factures" AS
SELECT
    r."idRDV",
    r."dateHeureReel",
    r."dateHeureFacture",
    r."dateHeureIntegrePGI",
    EXTRACT(EPOCH FROM (r."dateHeureIntegrePGI" - r."dateHeureFacture"))/3600 AS "delaiTraitementHeures",
    e."idEmploye",
    e."nomEmploye",
    e."prenomEmploye"
FROM "RDV" r
INNER JOIN "Employe" e ON r."idEmploye" = e."idEmploye"
WHERE r."dateHeureFacture" IS NOT NULL
  AND r."statutRDV" = 'REALISE';

-- ============================================================================
-- DONNÉES DE TEST
-- ============================================================================

-- Catégories de prestations
INSERT INTO "Categorie" ("nomCategorie", "descriptionCategorie") VALUES
('Actes de soins', 'Soins infirmiers généraux'),
('Actes d''analyse', 'Prélèvements et analyses'),
('Actes préventifs', 'Vaccinations et dépistages');

-- Écoles partenaires
INSERT INTO "Ecole" ("nomEcole", "adresseEcole", "telephoneEcole", "mailEcole") VALUES
('ESICAD', '56 chemin de la Roseraie, Toulouse 31500', '05 61 23 45 78', 'contact@esicad-toulouse.fr'),
('Mirail-Université', '9 place du Capitole, Toulouse 31000', '05 62 98 11 34', 'info@mirail-universite.fr'),
('ESMT Sup', '28 rue du Faubourg-Bonnefoy, Toulouse 31500', '05 61 47 82 19', 'accueil@esmt-tlse.fr');

-- Comptes employés de test avec mots de passe hashés (bcrypt)
-- Mot de passe "Test1" = $2b$10$NzvQHIk2zIL93U.YJhW09O8rpksfnLCh.eZZ5.YxETpnaOIjnrv5C
-- Mot de passe "Test2" = $2b$10$bGG/TLn07bgJl6LwOwnQE.f1gS6zr1dK7Tjvkj8o89PM5ytEeKEZC
-- Mot de passe "Test3" = $2b$10$cgnlIy2RhMQrtTXMLAh4O.ByX0mMdHCqPSav1p5VF9F9DJ2W5XI2C
INSERT INTO "Employe" ("nomEmploye", "prenomEmploye", "mailEmploye", "mdpEmploye", "roleEmploye") VALUES
('Directeur', 'Test', 'test.directeur@nursecare.fr', '$2b$10$NzvQHIk2zIL93U.YJhW09O8rpksfnLCh.eZZ5.YxETpnaOIjnrv5C', 'DIRECTEUR'),
('Secrétaire', 'Test', 'test.secretaire@nursecare.fr', '$2b$10$bGG/TLn07bgJl6LwOwnQE.f1gS6zr1dK7Tjvkj8o89PM5ytEeKEZC', 'SECRETAIRE'),
('Infirmier', 'Test', 'test.infirmier@nursecare.fr', '$2b$10$cgnlIy2RhMQrtTXMLAh4O.ByX0mMdHCqPSav1p5VF9F9DJ2W5XI2C', 'INFIRMIER');

-- Patients de test
INSERT INTO "Patient" ("nomPatient", "prenomPatient", "adressePatient", "telephonePatient", "mailPatient") VALUES
('Dupont', 'Marie', '12 rue de la Paix, Toulouse', '06 12 34 56 78', 'marie.dupont@email.fr'),
('Martin', 'Jean', '45 avenue Victor Hugo, Toulouse', '06 23 45 67 89', 'jean.martin@email.fr'),
('Bernard', 'Sophie', '8 boulevard Carnot, Toulouse', '06 34 56 78 90', 'sophie.bernard@email.fr');

-- Prestations de soins (référence aux catégories)
INSERT INTO "Prestation" ("nomPrestation", "prixTTC", "idCategorie") VALUES
('Prise de sang', 15.00, 2),
('Injection', 10.00, 1),
('Pansement', 12.00, 1),
('Vaccination grippe', 25.00, 3);

-- Stagiaires (référence aux écoles)
INSERT INTO "Stagiaire" ("nomStagiaire", "prenomStagiaire", "idEcole", "mailStagiaire") VALUES
('Durand', 'Lucas', 1, 'lucas.durand@esicad-toulouse.fr'),
('Petit', 'Emma', 2, 'emma.petit@mirail-universite.fr'),
('Roux', 'Léa', 3, 'lea.roux@esmt-tlse.fr');

COMMIT;
