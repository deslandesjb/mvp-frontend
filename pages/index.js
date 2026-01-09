/**
 * ============================================================================
 * FICHIER : pages/index.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier est la page d'accueil de l'application AtlasLoot.
 * Dans Next.js, chaque fichier dans pages/ devient une route.
 * index.js → route "/" (accueil)
 * 
 * RÔLE :
 * - Afficher la page d'accueil avec tous les produits
 * - Servir de point d'entrée principal de l'application
 * 
 * LOGIQUE :
 * Cette page est un simple wrapper qui rend le composant AllProducts.
 * La logique d'affichage et de récupération des données est dans AllProducts.
 * 
 * TECHNOLOGIES UTILISÉES :
 * - Next.js : Routing basé sur les fichiers
 * - React : Composants fonctionnels
 * 
 * ============================================================================
 */


// ============================================================================
// IMPORTS
// ============================================================================

/**
 * AllProducts : Composant qui affiche la liste de tous les produits
 * Gère la pagination, la recherche et les filtres
 */
import AllProducts from '../components/AllProducts';


// ============================================================================
// COMPOSANT INDEX (PAGE D'ACCUEIL)
// ============================================================================

/**
 * Index : Composant de la page d'accueil
 * 
 * STRUCTURE :
 * - Rend simplement le composant AllProducts
 * - Pas de logique supplémentaire ici
 * 
 * POURQUOI CETTE SÉPARATION ?
 * - Permet de réutiliser AllProducts ailleurs si besoin
 * - Garde les pages légères et les composants réutilisables
 */
function Index() {
	return <AllProducts />;
}


// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export par défaut pour Next.js
 * Ce composant sera rendu quand l'utilisateur visite "/"
 */
export default Index;
