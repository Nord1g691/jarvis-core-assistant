# JARVIS V9 — test rapide

## 1. Test hors ligne

Ouvrir `v9/v9-test.html` depuis le même serveur qui sert le dossier `v9/`.

Le test ne contacte pas Home Assistant. Il charge toute la chaîne V9 puis exécute `v9-self-test.js`.

Résultat attendu :
- `ok: true`
- tous les tests marqués `ok: true`

## 2. Test réel Home Assistant

Définir `HA_URL` et `HA_TOKEN` dans l'environnement/intégration existante du projet, sans mettre le token en dur dans Git.

Puis charger `v9/loader.js` depuis le HUD existant.

Vérifier dans l'ordre :
1. les entités apparaissent dans les catégories ;
2. un changement d'état HA met à jour le dashboard ;
3. une action autorisée fonctionne ;
4. une action sur un mauvais domaine est refusée ;
5. une valeur hors plage est refusée ;
6. le bouton de refresh déclenche une actualisation ;
7. une erreur HA remonte sans casser le HUD.

## 3. Ce qui n'est pas considéré comme validé sans instance HA

La communication réseau réelle avec Home Assistant et le rendu exact dans le HUD existant nécessitent un test sur l'instance cible.
