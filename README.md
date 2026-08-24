# JARVIS Core Assistant

JARVIS Core Assistant — interface intelligente pour Home Assistant, avec HUD, cartes dynamiques, actions, mémoire, automatisations, énergie, caméras et médias.

## V9
V9 reste une couche additive au visuel existant. Home Assistant est la source de vérité : les entités sont découvertes dynamiquement et les états sont consommés en temps réel.

## HACS — nouvelle architecture
Le dépôt contient maintenant le socle de l'intégration Home Assistant `custom_components/jarvis`.

- aucun token Nabu Casa dans le dépôt ;
- aucune URL Home Assistant à saisir dans le navigateur pour l'intégration ;
- Home Assistant fournit directement les états à JARVIS ;
- les capteurs solaires JARVIS sont détectés automatiquement parmi les capteurs HA ;
- six valeurs sont exposées : production solaire, consommation maison, import réseau, export réseau, puissance réseau et autoconsommation solaire ;
- les entités source réellement sélectionnées sont conservées dans les attributs des capteurs pour diagnostic.

Le moteur V9 existant et le visuel ne sont pas remplacés. Le shell navigateur avec URL/token reste uniquement un outil de test pendant la transition HACS.

## Installation
Pour le développement, copier `custom_components/jarvis` dans le dossier `config/custom_components/` de Home Assistant, redémarrer Home Assistant puis ajouter **JARVIS** depuis les intégrations.

Le dépôt est préparé pour HACS via `hacs.json`. La partie panneau/visuel intégré à Home Assistant sera branchée sur ce socle, afin que la version distribuable n'utilise plus l'authentification navigateur Nabu Casa.
