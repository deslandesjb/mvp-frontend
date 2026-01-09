/**
 * ============================================================================
 * FICHIER : pages/category.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier est la page des catégories de l'application.
 * Dans Next.js, category.js → route "/category"
 * 
 * RÔLE :
 * - Afficher les produits filtrés par catégorie
 * - Permettre la navigation entre catégories
 * 
 * ÉTAT ACTUEL :
 * Cette page est un placeholder/template.
 * Le filtrage par catégorie est actuellement géré via les query params
 * sur la page d'accueil (/?categories=Smartphone)
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
 * Category : Composant qui affiche la page catégorie
 * Actuellement un simple placeholder avec un bouton
 */
import Category from '../components/Category';


// ============================================================================
// COMPOSANT CATEGORYPAGE
// ============================================================================

/**
 * CategoryPage : Composant de la page catégorie
 * 
 * NOTE :
 * Cette page pourrait être développée pour afficher
 * une liste de catégories avec des visuels, ou un système
 * de navigation plus élaboré.
 */
function CategoryPage() {
	return <Category />;
}


// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export par défaut pour Next.js
 * Ce composant sera rendu quand l'utilisateur visite "/category"
 */
export default CategoryPage;
