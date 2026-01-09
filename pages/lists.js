/**
 * ============================================================================
 * FICHIER : pages/lists.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier est la page des favoris/listes de l'utilisateur.
 * Dans Next.js, lists.js → route "/lists"
 * 
 * RÔLE :
 * - Afficher toutes les listes de favoris de l'utilisateur connecté
 * - Permettre la gestion des listes (création, suppression)
 * 
 * LOGIQUE :
 * La page rend le composant Lists qui gère :
 * - L'affichage des listes et leurs produits
 * - La création de nouvelles listes
 * - La suppression de listes
 * - L'ajout/retrait de produits
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
 * List : Composant qui affiche les listes de favoris
 * Gère la création, suppression et modification des listes
 */
import List from '../components/Lists.js';


// ============================================================================
// COMPOSANT LISTSPAGE (PAGE FAVORIS)
// ============================================================================

/**
 * listsPage : Composant de la page favoris
 * 
 * NOTE SUR LE NOMMAGE :
 * Le nom commence par une minuscule (listsPage) ce qui n'est pas
 * la convention React. Il devrait être ListsPage.
 * Cependant, cela fonctionne car c'est une page Next.js.
 */
function listsPage() {
  return <List/>
}


// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export par défaut pour Next.js
 * Ce composant sera rendu quand l'utilisateur visite "/lists"
 */
export default listsPage;
