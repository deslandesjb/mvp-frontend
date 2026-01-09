/**
 * ============================================================================
 * FICHIER : pages/_app.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier est le point d'entrée principal de l'application Next.js.
 * Il enveloppe toutes les pages et configure les éléments globaux.
 * 
 * RÔLE :
 * - Configurer Redux et Redux Persist pour la gestion d'état
 * - Ajouter les composants globaux (Header, Footer)
 * - Charger les styles CSS globaux
 * - Afficher les notifications toast
 * 
 * LOGIQUE :
 * Chaque page est rendue à l'intérieur de ce composant App.
 * Les providers (Redux, PersistGate) donnent accès à l'état global
 * depuis n'importe quel composant de l'application.
 * 
 * TECHNOLOGIES UTILISÉES :
 * - Next.js : Framework React avec routing automatique
 * - Redux Toolkit : Gestion d'état moderne et simplifiée
 * - Redux Persist : Sauvegarde de l'état dans localStorage
 * - Sonner : Librairie de notifications toast
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Head : Composant Next.js pour modifier le <head> HTML
 * Permet d'ajouter title, meta, favicon, etc.
 */
import Head from 'next/head';

/**
 * Toaster : Composant de notifications toast (sonner)
 * Affiche des messages temporaires à l'utilisateur
 */
import {Toaster} from 'sonner';

/**
 * Composants globaux : Header et Footer
 * Affichés sur toutes les pages de l'application
 */
import Footer from '../components/global/Footer';
import Header from '../components/global/Header';

/**
 * Styles CSS globaux
 * Appliqués à toute l'application (Tailwind, fonts, etc.)
 */
import '../styles/globals.css';


// ============================================================================
// 2. CONFIGURATION REDUX
// ============================================================================

/**
 * Redux Toolkit : Gestion d'état moderne
 * - combineReducers : Combine plusieurs reducers en un seul
 * - configureStore : Crée le store Redux avec middleware
 */
import {combineReducers, configureStore} from '@reduxjs/toolkit';

/**
 * Provider : Composant React-Redux qui donne accès au store
 * à tous les composants enfants via useSelector et useDispatch
 */
import {Provider} from 'react-redux';

/**
 * Reducer user : Gère l'état de l'utilisateur connecté
 * (token, firstname, lastname, mail)
 */
import user from '../reducer/user';


// ============================================================================
// 3. CONFIGURATION REDUX PERSIST
// ============================================================================

/**
 * Redux Persist : Sauvegarde l'état dans localStorage
 * 
 * AVANTAGE :
 * L'utilisateur reste connecté même après fermeture du navigateur
 * car son token est persisté dans localStorage.
 */

/**
 * persistReducer : Wrapper qui ajoute la persistance au reducer
 * persistStore : Crée le persistor qui gère la sauvegarde/restauration
 */
import {persistReducer, persistStore} from 'redux-persist';

/**
 * PersistGate : Attend que l'état soit restauré avant d'afficher l'app
 * Évite le "flash" d'état non connecté au chargement
 */
import {PersistGate} from 'redux-persist/integration/react';

/**
 * storage : Utilise localStorage pour la persistance
 * (sessionStorage est aussi disponible)
 */
import storage from 'redux-persist/lib/storage';


// ============================================================================
// 4. CRÉATION DU STORE REDUX
// ============================================================================

/**
 * Combinaison des reducers
 * Ici on n'a qu'un seul reducer (user), mais on peut en ajouter d'autres
 * Exemple : combineReducers({ user, cart, products })
 */
const reducers = combineReducers({user});

/**
 * Configuration de la persistance
 * - key : Clé utilisée dans localStorage
 * - storage : Où sauvegarder (localStorage)
 */
const persistConfig = {
	key: 'applicationName',
	storage,
};

/**
 * Création du reducer persisté
 * C'est ce reducer qui sera utilisé dans le store
 */
const persistedReducer = persistReducer(persistConfig, reducers);

/**
 * Création du store Redux
 * - reducer : Le reducer persisté
 * - middleware : Configuration pour éviter les warnings avec Redux Persist
 */
const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			// Désactive la vérification de sérialisation pour Redux Persist
			serializableCheck: false,
		}),
});

/**
 * Création du persistor
 * Utilisé par PersistGate pour gérer la restauration de l'état
 */
const persistor = persistStore(store);


// ============================================================================
// 5. COMPOSANT APP (POINT D'ENTRÉE)
// ============================================================================

/**
 * App : Composant racine de l'application Next.js
 * 
 * PARAMÈTRES :
 * - Component : Le composant de la page actuelle (index.js, lists.js, etc.)
 * - pageProps : Les props de la page (de getServerSideProps, etc.)
 * 
 * STRUCTURE :
 * Provider → PersistGate → Header → Page → Footer
 */
function App({Component, pageProps}) {

	return (
		// ─────────────────────────────────────────────────────────────────────
		// Provider Redux : Donne accès au store à toute l'application
		// ─────────────────────────────────────────────────────────────────────
		<Provider store={store}>

			{/* ─────────────────────────────────────────────────────────────────
			    PersistGate : Attend la restauration de l'état avant l'affichage
			    Évite le "flash" d'état non connecté
			    ───────────────────────────────────────────────────────────────── */}
			<PersistGate persistor={persistor}>

				{/* ─────────────────────────────────────────────────────────────
				    Head : Balise <title> de la page
				    ───────────────────────────────────────────────────────────── */}
				<Head>
					<title>MVP</title>
				</Head>

				{/* ─────────────────────────────────────────────────────────────
				    Toaster : Conteneur pour les notifications toast
				    Position en haut à droite
				    ───────────────────────────────────────────────────────────── */}
				<Toaster position="top-right" />

				{/* ─────────────────────────────────────────────────────────────
				    Header : Barre de navigation (présente sur toutes les pages)
				    ───────────────────────────────────────────────────────────── */}
				<Header />

				{/* ─────────────────────────────────────────────────────────────
				    Component : La page actuelle (change selon l'URL)
				    pageProps : Props passées à la page
				    ───────────────────────────────────────────────────────────── */}
				<Component {...pageProps} />

				{/* ─────────────────────────────────────────────────────────────
				    Footer : Pied de page (présent sur toutes les pages)
				    ───────────────────────────────────────────────────────────── */}
				<Footer />

			</PersistGate>
		</Provider>
	);
}


// ============================================================================
// 6. EXPORT
// ============================================================================

/**
 * Export par défaut du composant App
 * Next.js l'utilise automatiquement comme wrapper de toutes les pages
 */
export default App;
