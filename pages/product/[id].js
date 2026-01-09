/**
 * ============================================================================
 * FICHIER : pages/product/[id].js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier est la page de détail d'un produit.
 * Le [id] dans le nom de fichier est une route dynamique Next.js.
 * 
 * ROUTING DYNAMIQUE :
 * - /product/123 → id = "123"
 * - /product/abc → id = "abc"
 * - L'ID est récupéré via useRouter().query.id
 * 
 * RÔLE :
 * - Afficher les détails complets d'un produit
 * - Montrer la comparaison des prix entre vendeurs
 * - Afficher les avis clients
 * 
 * LOGIQUE :
 * La page rend le composant ProductPage qui :
 * - Récupère l'ID depuis l'URL
 * - Fait un appel API pour obtenir les détails
 * - Affiche toutes les informations du produit
 * 
 * TECHNOLOGIES UTILISÉES :
 * - Next.js : Routes dynamiques avec [param]
 * - React : Composants fonctionnels
 * 
 * ============================================================================
 */


// ============================================================================
// IMPORTS
// ============================================================================

/**
 * ProductPage : Composant qui affiche les détails d'un produit
 * Gère la récupération des données et l'affichage
 */
import ProductPage from '../../components/ProductPage';


// ============================================================================
// COMPOSANT PRODUCTPAGE (PAGE DÉTAIL)
// ============================================================================

/**
 * productPage : Composant de la page détail produit
 * 
 * NOTE SUR LE NOMMAGE :
 * Le nom commence par une minuscule (productPage) ce qui n'est pas
 * la convention React. Il devrait être ProductDetailPage.
 * Cependant, cela fonctionne car c'est une page Next.js.
 * 
 * FONCTIONNEMENT :
 * L'ID du produit est automatiquement disponible via useRouter()
 * dans le composant ProductPage grâce au routing dynamique Next.js.
 */
function productPage() {
	return <ProductPage />;
}


// ============================================================================
// EXPORT
// ============================================================================

/**
 * Export par défaut pour Next.js
 * Ce composant sera rendu quand l'utilisateur visite "/product/[id]"
 * Exemple : /product/507f1f77bcf86cd799439011
 */
export default productPage;
