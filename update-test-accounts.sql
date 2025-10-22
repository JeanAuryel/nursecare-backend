-- Mise à jour des comptes de test
-- À exécuter manuellement dans PostgreSQL Render ou localement

BEGIN;

-- Les mots de passe sont hashés avec bcrypt (bcrypt rounds = 10)
-- Test1 = $2b$10$NzvQHIk2zIL93U.YJhW09O8rpksfnLCh.eZZ5.YxETpnaOIjnrv5C
-- Test2 = $2b$10$bGG/TLn07bgJl6LwOwnQE.f1gS6zr1dK7Tjvkj8o89PM5ytEeKEZC
-- Test3 = $2b$10$cgnlIy2RhMQrtTXMLAh4O.ByX0mMdHCqPSav1p5VF9F9DJ2W5XI2C

-- Mettre à jour le compte Directeur (test_1)
UPDATE "Employe"
SET
  "mailEmploye" = 'test.directeur@nursecare.fr',
  "mdpEmploye" = '$2b$10$NzvQHIk2zIL93U.YJhW09O8rpksfnLCh.eZZ5.YxETpnaOIjnrv5C'
WHERE "mailEmploye" = 'test_1.nursecare@nursecare.fr'
   OR ("roleEmploye" = 'DIRECTEUR' AND "nomEmploye" = 'nursecare' AND "prenomEmploye" = 'test_1');

-- Mettre à jour le compte Secrétaire (test_2)
UPDATE "Employe"
SET
  "mailEmploye" = 'test.secretaire@nursecare.fr',
  "mdpEmploye" = '$2b$10$bGG/TLn07bgJl6LwOwnQE.f1gS6zr1dK7Tjvkj8o89PM5ytEeKEZC'
WHERE "mailEmploye" = 'test_2.nursecare@nursecare.fr'
   OR ("roleEmploye" = 'SECRETAIRE' AND "nomEmploye" = 'nursecare' AND "prenomEmploye" = 'test_2');

-- Mettre à jour le compte Infirmier (test_3)
UPDATE "Employe"
SET
  "mailEmploye" = 'test.infirmier@nursecare.fr',
  "mdpEmploye" = '$2b$10$cgnlIy2RhMQrtTXMLAh4O.ByX0mMdHCqPSav1p5VF9F9DJ2W5XI2C'
WHERE "mailEmploye" = 'test_3.nursecare@nursecare.fr'
   OR ("roleEmploye" = 'INFIRMIER' AND "nomEmploye" = 'nursecare' AND "prenomEmploye" = 'test_3');

COMMIT;

-- Vérification
SELECT "idEmploye", "nomEmploye", "prenomEmploye", "mailEmploye", "roleEmploye"
FROM "Employe"
WHERE "mailEmploye" LIKE '%test.%@nursecare.fr';
