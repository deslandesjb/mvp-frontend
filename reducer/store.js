/**
 * ============================================================================
 * FICHIER : reducer/store.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier configure le store Redux avec la persistance.
 * C'est une configuration alternative à celle dans _app.js.
 * 
 * NOTE :
 * Dans ce projet, la configuration Redux est directement dans _app.js
 * Ce fichier est potentiellement inutilisé ou prévu pour une refactorisation.
 * 
 * RÔLE :
 * - Créer et configurer le store Redux
 * - Activer la persistance dans localStorage
 * - Exporter le store et le persistor
 * 
 * TECHNOLOGIES UTILISÉES :
 * - Redux Toolkit : Configuration simplifiée du store
 * - Redux Persist : Persistance de l'état dans localStorage
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Redux Toolkit imports :
 * - configureStore : Crée le store avec une configuration simplifiée
 * - combineReducers : Combine plusieurs reducers en un seul
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';

/**
 * Redux Persist imports :
 * - persistStore : Crée le persistor qui gère la sauvegarde
 * - persistReducer : Wrapper qui ajoute la persistance
 */
import { persistStore, persistReducer } from 'redux-persist';

/**
 * storage : Utilise localStorage pour la persistance
 */
import storage from 'redux-persist/lib/storage';

/**
 * userReducer : Le reducer qui gère l'état de l'utilisateur
 */
import userReducer from './user';


// ============================================================================
// 2. COMBINAISON DES REDUCERS
// ============================================================================

/**
 * rootReducer : Combine tous les reducers de l'application
 * 
 * Structure de l'état global :
 * {
 *   user: { token, firstname, lastname, mail }
 * }
 * 
 * Pour ajouter d'autres reducers :
 * const rootReducer = combineReducers({
 *   user: userReducer,
 *   cart: cartReducer,
 *   products: productsReducer,
 * });
 */
const rootReducer = combineReducers({
  user: userReducer,
});


// ============================================================================
// 3. CONFIGURATION DE LA PERSISTANCE
// ============================================================================

/**
 * Configuration de Redux Persist
 * 
 * OPTIONS :
 * - key : Clé utilisée dans localStorage ('root')
 * - storage : Où sauvegarder (localStorage)
 * - whitelist : Liste des reducers à persister (ici 'user')
 * 
 * WHITELIST VS BLACKLIST :
 * - whitelist : Persiste SEULEMENT les reducers listés
 * - blacklist : Persiste TOUS les reducers SAUF ceux listés
 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],  // Seul l'état 'user' sera persisté
};


// ============================================================================
// 4. CRÉATION DU REDUCER PERSISTÉ
// ============================================================================

/**
 * persistReducer enveloppe le rootReducer pour ajouter
 * la logique de persistance (sauvegarde et restauration)
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);


// ============================================================================
// 5. CRÉATION DU STORE
// ============================================================================

/**
 * configureStore crée le store Redux avec :
 * - Le reducer persisté
 * - Les middlewares par défaut (dont redux-thunk)
 * - Les DevTools Redux en développement
 * 
 * MIDDLEWARE :
 * serializableCheck: false désactive la vérification de sérialisation
 * car Redux Persist utilise des actions non-sérialisables
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


// ============================================================================
// 6. CRÉATION DU PERSISTOR
// ============================================================================

/**
 * persistStore crée le persistor qui :
 * - Restaure l'état depuis localStorage au démarrage
 * - Sauvegarde l'état dans localStorage à chaque changement
 * 
 * Utilisé avec PersistGate dans _app.js
 */
export const persistor = persistStore(store);
