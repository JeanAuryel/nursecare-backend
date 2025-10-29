-- Import PostgreSQL pour Render
-- Schéma fourni par l'utilisateur + Données de test

BEGIN;

-- ============================================
-- SCHÉMA À FOURNIR PAR L'UTILISATEUR
-- ============================================
-- Collez ici votre code SQL PostgreSQL pour créer les tables



-- ============================================
-- DONNÉES DE TEST
-- ============================================

-- Catégories de prestations
INSERT INTO "Categorie" ("nomCategorie", "descriptionCategorie") VALUES
('Actes de soins', 'Soins infirmiers généraux'),
('Actes d''analyse', 'Prélèvements et analyses'),
('Actes préventifs', 'Vaccinations et dépistages');

-- Écoles partenaires
INSERT INTO "Ecole" ("nomEcole", "adresseEcole", "villeEcole", "codePostalEcole", "telephoneEcole", "mailEcole", "contactReferent") VALUES
('ESICAD', '56 chemin de la Roseraie', 'Toulouse', '31500', '05 61 23 45 78', 'contact@esicad-toulouse.fr', 'julie.martin@esicad-toulouse.fr'),
('Mirail-Université', '9 place du Capitole', 'Toulouse', '31000', '05 62 98 11 34', 'info@mirail-universite.fr', 'thomas.lefevre@mirail-universite.fr'),
('ESMT Sup', '28 rue du Faubourg-Bonnefoy', 'Toulouse', '31500', '05 61 47 82 19', 'accueil@esmt-tlse.fr', 'sarah.benali@esmt-tlse.fr');

-- Comptes employés de test avec mots de passe hashés (bcrypt)
-- Mot de passe "Test1" = $2b$10$NzvQHIk2zIL93U.YJhW09O8rpksfnLCh.eZZ5.YxETpnaOIjnrv5C
-- Mot de passe "Test2" = $2b$10$bGG/TLn07bgJl6LwOwnQE.f1gS6zr1dK7Tjvkj8o89PM5ytEeKEZC
-- Mot de passe "Test3" = $2b$10$cgnlIy2RhMQrtTXMLAh4O.ByX0mMdHCqPSav1p5VF9F9DJ2W5XI2C
INSERT INTO "Employe" ("nomEmploye", "prenomEmploye", "mailEmploye", "mdpEmploye", "roleEmploye") VALUES
('Directeur', 'Test', 'test.directeur@nursecare.fr', '$2b$10$NzvQHIk2zIL93U.YJhW09O8rpksfnLCh.eZZ5.YxETpnaOIjnrv5C', 'DIRECTEUR'),
('Secrétaire', 'Test', 'test.secretaire@nursecare.fr', '$2b$10$bGG/TLn07bgJl6LwOwnQE.f1gS6zr1dK7Tjvkj8o89PM5ytEeKEZC', 'SECRETAIRE'),
('Infirmier', 'Test', 'test.infirmier@nursecare.fr', '$2b$10$cgnlIy2RhMQrtTXMLAh4O.ByX0mMdHCqPSav1p5VF9F9DJ2W5XI2C', 'INFIRMIER');

-- Patients de test
INSERT INTO "Patient" ("nomPatient", "prenomPatient", "adressePatient", "numPatient", "mailPatient") VALUES
('Dupont', 'Marie', '12 rue de la Paix, Toulouse', '06 12 34 56 78', 'marie.dupont@email.fr'),
('Martin', 'Jean', '45 avenue Victor Hugo, Toulouse', '06 23 45 67 89', 'jean.martin@email.fr'),
('Bernard', 'Sophie', '8 boulevard Carnot, Toulouse', '06 34 56 78 90', 'sophie.bernard@email.fr');

-- Prestations de soins (référence aux catégories)
INSERT INTO "Prestation" ("nomPrestation", "prix_TTC", "idCategorie", "codePrestation") VALUES
('Prise de sang', 15.00, 2, 'PS001'),
('Injection', 10.00, 1, 'INJ001'),
('Pansement', 12.00, 1, 'PAN001'),
('Vaccination grippe', 25.00, 3, 'VAC001');

-- Stagiaires (référence aux écoles)
INSERT INTO "Stagiaire" ("nomStagiaire", "prenomStagiaire", "idEcole", "mailStagiaire") VALUES
('Durand', 'Lucas', 1, 'lucas.durand@esicad-toulouse.fr'),
('Petit', 'Emma', 2, 'emma.petit@mirail-universite.fr'),
('Roux', 'Léa', 3, 'lea.roux@esmt-tlse.fr');

COMMIT;
