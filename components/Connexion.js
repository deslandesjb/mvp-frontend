/**
 * ============================================================================
 * FICHIER : components/Connexion.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant gère la connexion des utilisateurs existants.
 * Il est affiché dans une modal (Dialog) depuis le Header.
 * 
 * RÔLE :
 * - Afficher le formulaire de connexion
 * - Valider les identifiants via l'API
 * - Stocker le token utilisateur dans Redux
 * - Notifier l'utilisateur du résultat
 * 
 * FONCTIONNEMENT :
 * 1. L'utilisateur saisit son email et mot de passe
 * 2. Au clic sur "Connexion", appel API POST /users/signin
 * 3. Si succès : dispatch login() et fermeture de la modal
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
 * Plus moderne et esthétique que les alertes natives
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
// 2. COMPOSANT CONNEXION
// ============================================================================

/**
 * Connexion : Formulaire de connexion utilisateur
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Function} props.closeModal - Fonction pour fermer la modal parent
 * 
 * @returns {JSX.Element} - Le formulaire de connexion
 */
export default function Connexion({closeModal}) {

// ─────────────────────────────────────────────────────────────────────────
// 2.1 ÉTATS LOCAUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * mail : Adresse email saisie par l'utilisateur
 * password : Mot de passe saisi par l'utilisateur
 */
const [mail, setMail] = useState('');
const [password, setPassword] = useState('');


// ─────────────────────────────────────────────────────────────────────────
// 2.2 CONFIGURATION REDUX
// ─────────────────────────────────────────────────────────────────────────
/**
 * useDispatch : Hook Redux pour déclencher des actions
 * Permet de modifier le state global de l'application
 */
const dispatch = useDispatch();


// ─────────────────────────────────────────────────────────────────────────
// 2.3 FONCTION : GÉRER LA CONNEXION
// ─────────────────────────────────────────────────────────────────────────
/**
 * handleSignin : Traite la soumission du formulaire
 * 
 * LOGIQUE :
 * 1. Envoie les identifiants à l'API /users/signin
 * 2. Si result === true :
 *    - Dispatch l'action login() avec les données utilisateur
 *    - Ferme la modal
 *    - Affiche un toast de succès
 * 3. Si result === false :
 *    - Affiche un toast d'erreur avec le message du serveur
 * 
 * APPEL API : POST /users/signin
 * 
 * BODY ENVOYÉ :
 * {
 *   mail: string,
 *   password: string
 * }
 * 
 * RÉPONSE ATTENDUE (succès) :
 * {
 *   result: true,
 *   token: string,
 *   firstname: string,
 *   lastname: string,
 *   mail: string
 * }
 * 
 * RÉPONSE ATTENDUE (échec) :
 * {
 *   result: false,
 *   error: string
 * }
 */
const handleSignin = () => {

// Envoi de la requête de connexion
fetch('http://localhost:3000/users/signin', {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({
mail: mail,
password: password
})
})
.then((response) => response.json())
.then((data) => {

// ═══════════════════════════════════════════════════════════
// CONNEXION RÉUSSIE
// ═══════════════════════════════════════════════════════════
if (data.result) {

// Dispatch l'action login avec les données utilisateur
// Cela met à jour le store Redux et persiste via redux-persist
dispatch(login({
token: data.token,
firstname: data.firstname,
lastname: data.lastname,
mail: data.mail
}));

// Ferme la modal
closeModal();

// Affiche une notification de succès
toast.success('Connexion réussie');

// ═══════════════════════════════════════════════════════════
// CONNEXION ÉCHOUÉE
// ═══════════════════════════════════════════════════════════
} else {
// Affiche le message d'erreur du serveur
// Ex: "Email ou mot de passe incorrect"
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
    CHAMP EMAIL
    ═══════════════════════════════════════════════════════════════ */}
<div>
{/* Label associé au champ input via htmlFor */}
<Label htmlFor="mail">Email</Label>

{/* Input contrôlé : value liée à l'état, onChange met à jour l'état */}
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

{/* type="password" masque les caractères saisis */}
<Input
id="password"
type="password"
placeholder="Entrez votre mot de passe"
onChange={(e) => setPassword(e.target.value)}
value={password}
/>
</div>


{/* ═══════════════════════════════════════════════════════════════
    BOUTON DE CONNEXION
    ═══════════════════════════════════════════════════════════════ */}
<Button
className="bg-orange hover:bg-orangehover"
onClick={() => handleSignin()}
>
Connexion
</Button>
</>
);
}
