/**
 * ============================================================================
 * FICHIER : reducer/user.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce fichier définit le "slice" Redux pour gérer l'état de l'utilisateur.
 * Un slice combine le reducer, les actions et l'état initial.
 * 
 * RÔLE :
 * - Stocker les informations de l'utilisateur connecté
 * - Gérer la connexion (login) et la déconnexion (logout)
 * - Persister l'état grâce à Redux Persist
 * 
 * STRUCTURE DE L'ÉTAT :
 * {
 *   token: "abc123...",      // Token d'authentification
 *   firstname: "Jean",       // Prénom de l'utilisateur
 *   lastname: "Dupont",      // Nom de l'utilisateur
 *   mail: "jean@email.com"   // Email de l'utilisateur
 * }
 * 
 * ACTIONS DISPONIBLES :
 * - login : Connecte l'utilisateur (stocke ses infos)
 * - logout : Déconnecte l'utilisateur (réinitialise l'état)
 * 
 * TECHNOLOGIES UTILISÉES :
 * - Redux Toolkit : createSlice pour simplifier la création de reducers
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * createSlice : Fonction Redux Toolkit qui crée un slice
 * Un slice = état initial + reducers + actions générées automatiquement
 */
import { createSlice } from '@reduxjs/toolkit';


// ============================================================================
// 2. ÉTAT INITIAL
// ============================================================================

/**
 * L'état initial représente un utilisateur non connecté.
 * Toutes les valeurs sont null.
 * 
 * Quand l'utilisateur se connecte, ces valeurs sont remplies.
 * Quand il se déconnecte, elles redeviennent null.
 */
const initialState = {
  token: null,        // Token d'authentification (null = non connecté)
  firstname: null,    // Prénom
  lastname: null,     // Nom
  mail: null,         // Email
};


// ============================================================================
// 3. CRÉATION DU SLICE
// ============================================================================

/**
 * createSlice() génère automatiquement :
 * - Le reducer
 * - Les action creators
 * - Les types d'actions
 * 
 * PARAMÈTRES :
 * - name : Nom du slice (préfixe des actions)
 * - initialState : État initial
 * - reducers : Fonctions qui modifient l'état
 */
const userSlice = createSlice({

  // Nom du slice (actions seront : user/login, user/logout)
  name: 'user',

  // État initial (utilisateur non connecté)
  initialState,

  // ─────────────────────────────────────────────────────────────────────────
  // REDUCERS : Fonctions qui modifient l'état
  // ─────────────────────────────────────────────────────────────────────────
  reducers: {

    /**
     * login : Connecte l'utilisateur
     * 
     * PARAMÈTRES :
     * - state : L'état actuel (modifiable directement grâce à Immer)
     * - action : { type: 'user/login', payload: { token, firstname, lastname, mail } }
     * 
     * UTILISATION :
     * dispatch(login({ token: "abc", firstname: "Jean", ... }))
     */
    login: (state, action) => {
      state.token = action.payload.token;
      state.firstname = action.payload.firstname;
      state.lastname = action.payload.lastname;
      state.mail = action.payload.mail;
    },

    /**
     * logout : Déconnecte l'utilisateur
     * 
     * PARAMÈTRES :
     * - state : L'état actuel
     * 
     * COMPORTEMENT :
     * Réinitialise toutes les valeurs à null
     * 
     * UTILISATION :
     * dispatch(logout())
     */
    logout: (state) => {
      state.token = null;
      state.firstname = null;
      state.lastname = null;
      state.mail = null;
    },

  },
});


// ============================================================================
// 4. EXPORTS
// ============================================================================

/**
 * Export des actions générées automatiquement
 * Ces actions peuvent être dispatchées depuis les composants :
 * 
 * import { login, logout } from '../reducer/user';
 * dispatch(login({ token, firstname, lastname, mail }));
 * dispatch(logout());
 */
export const { login, logout } = userSlice.actions;

/**
 * Export du reducer par défaut
 * Ce reducer est combiné avec les autres dans le store
 * 
 * import userReducer from '../reducer/user';
 * combineReducers({ user: userReducer });
 */
export default userSlice.reducer;
