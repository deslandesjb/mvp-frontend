/**
 * ============================================================================
 * FICHIER : components/Inscription.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant gère l'inscription de nouveaux utilisateurs.
 * Il est affiché dans une modal (Dialog) depuis le Header.
 * 
 * RÔLE :
 * - Afficher le formulaire d'inscription complet
 * - Créer un nouveau compte via l'API
 * - Connecter automatiquement l'utilisateur après inscription
 * - Notifier l'utilisateur du résultat
 * 
 * FONCTIONNEMENT :
 * 1. L'utilisateur remplit les champs (prénom, nom, email, mot de passe)
 * 2. Au clic sur "Inscription", appel API POST /users/signup
 * 3. Si succès : l'utilisateur est connecté et la modal se ferme
 * 4. Si échec : affichage d'un toast d'erreur
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel avec hooks (useState)
 * - Redux : useDispatch pour mettre à jour le state global
 * - shadcn/ui : Input, Label, Button pour le formulaire
 * - Sonner : Notifications toast pour feedback utilisateur
 * 
 * PROPS :
 * - closeModal : Fonction callback pour fermer la modal parent
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Composants UI shadcn/ui
 */
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

/**
 * Sonner : Bibliothèque de notifications toast
 */
import {toast} from 'sonner';

/**
 * React : Hook useState pour gérer l'état du formulaire
 */
import {useState} from 'react';

/**
 * Redux : useDispatch pour déclencher des actions
 */
import {useDispatch} from 'react-redux';

/**
 * Action Redux : login pour stocker les infos utilisateur
 */
import {login} from '@/reducer/user';


// ============================================================================
// 2. COMPOSANT INSCRIPTION
// ============================================================================

/**
 * Inscription : Formulaire de création de compte
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.closeModal - Fonction pour fermer la modal parent
 * 
 * @returns {JSX.Element} - Le formulaire d'inscription
 */
export default function Inscription({closeModal}) {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * États pour chaque champ du formulaire
 * Tous initialisés à une chaîne vide
 */
const [firstname, setFirstname] = useState('');  // Prénom
const [lastname, setLastname] = useState('');    // Nom de famille
const [mail, setMail] = useState('');            // Adresse email
const [password, setPassword] = useState('');    // Mot de passe


// ─────────────────────────────────────────────────────────────────────────
// 2.2 CONFIGURATION REDUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * useDispatch : Hook Redux pour déclencher des actions
 */
const dispatch = useDispatch();


// ─────────────────────────────────────────────────────────────────────────
// 2.3 FONCTION : GÉRER L'INSCRIPTION
// ─────────────────────────────────────────────────────────────────────────
/**
 * handleSignup : Traite la soumission du formulaire d'inscription
 * 
 * LOGIQUE :
 * 1. Envoie toutes les données à l'API /users/signup
 * 2. Si result === true :
 *    - Dispatch l'action login() (connexion automatique)
 *    - Ferme la modal
 *    - Affiche un toast de succès
 * 3. Si result === false :
 *    - Affiche un toast d'erreur
 * 
 * APPEL API : POST /users/signup
 * 
 * BODY ENVOYÉ :
 * {
 *   firstname: string,
 *   lastname: string,
 *   mail: string,
 *   password: string
 * }
 * 
 * RÉPONSE ATTENDUE (succès) :
 * {
 *   result: true,
 *   token: string,      // Token unique généré par uid2
 *   firstname: string,
 *   lastname: string,
 *   mail: string
 * }
 * 
 * RÉPONSE ATTENDUE (échec) :
 * {
 *   result: false,
 *   error: string       // Ex: "Email déjà utilisé"
 * }
 */
const handleSignup = () => {

// Envoi de la requête d'inscription
fetch('http://localhost:3000/users/signup', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({
firstname: firstname,
lastname: lastname,
mail: mail,
password: password
})
})
.then((response) => response.json())
.then((data) => {

// ═══════════════════════════════════════════════════════════
// INSCRIPTION RÉUSSIE
// ═══════════════════════════════════════════════════════════
if (data.result) {

// Connexion automatique après inscription
// Stocke les données dans Redux
dispatch(login({
token: data.token,
firstname: data.firstname,
lastname: data.lastname,
mail: data.mail
}));

// Ferme la modal d'inscription
closeModal();

// Notification de succès
toast.success('Inscription réussie');

// ═══════════════════════════════════════════════════════════
// INSCRIPTION ÉCHOUÉE
// ═══════════════════════════════════════════════════════════
} else {
// Affiche le message d'erreur
// Ex: "Tous les champs sont obligatoires"
// Ex: "Email déjà utilisé"
toast.error(data.error);
}

});
};


// ─────────────────────────────────────────────────────────────────────────
// 2.4 RENDU JSX
// ─────────────────────────────────────────────────────────────────────────
return (
<>
{/* ═══════════════════════════════════════════════════════════════
    CHAMP PRÉNOM
    ═══════════════════════════════════════════════════════════════ */}
<div>
<Label htmlFor="firstname">Prénom</Label>
<Input
id="firstname"
type="text"
placeholder="Entrez votre prénom"
onChange={(e) => setFirstname(e.target.value)}
value={firstname}
/>
</div>


{/* ═══════════════════════════════════════════════════════════════
    CHAMP NOM
    ═══════════════════════════════════════════════════════════════ */}
<div>
<Label htmlFor="lastname">Nom</Label>
<Input
id="lastname"
type="text"
placeholder="Entrez votre nom"
onChange={(e) => setLastname(e.target.value)}
value={lastname}
/>
</div>


{/* ═══════════════════════════════════════════════════════════════
    CHAMP EMAIL
    ═══════════════════════════════════════════════════════════════ */}
<div>
<Label htmlFor="mail">Email</Label>
<Input
id="mail"
type="email"
placeholder="Entrez votre email"
onChange={(e) => setMail(e.target.value)}
value={mail}
/>
</div>


{/* ═══════════════════════════════════════════════════════════════
    CHAMP MOT DE PASSE
    ═══════════════════════════════════════════════════════════════ */}
<div>
<Label htmlFor="password">Mot de passe</Label>
<Input
id="password"
type="password"
placeholder="Entrez votre mot de passe"
onChange={(e) => setPassword(e.target.value)}
value={password}
/>
</div>


{/* ═══════════════════════════════════════════════════════════════
    BOUTON D'INSCRIPTION
    ═══════════════════════════════════════════════════════════════ */}
<Button
className="bg-orange hover:bg-orangehover"
onClick={() => handleSignup()}
>
Inscription
</Button>
</>
);
}
