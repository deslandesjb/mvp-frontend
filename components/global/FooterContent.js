/**
 * ============================================================================
 * FICHIER : components/global/FooterContent.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant contient le contenu visuel du footer.
 * Il est affiché à l'intérieur du composant Footer (effet reveal).
 * 
 * RÔLE :
 * - Afficher les informations de l'entreprise
 * - Fournir des liens de navigation
 * - Afficher les liens vers les réseaux sociaux
 * - Afficher les mentions légales et copyright
 * 
 * STRUCTURE :
 * Le footer est divisé en plusieurs sections :
 * 1. Section haute : Logo/description + liens de navigation
 * 2. Section basse : Grand texte décoratif + réseaux sociaux + copyright
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel
 * - Next.js : Composant Link pour la navigation
 * - Lucide React : Icônes réseaux sociaux
 * - Tailwind CSS : Styling responsive
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * Lucide React : Icônes des réseaux sociaux
 */
import {Instagram, Linkedin, Twitter} from 'lucide-react';

/**
 * Next.js : Composant Link pour navigation optimisée
 */
import Link from 'next/link';

/**
 * React : Import de base
 */
import React from 'react';


// ============================================================================
// 2. COMPOSANT FOOTERCONTENT
// ============================================================================

/**
 * FooterContent : Le contenu visuel du footer
 * 
 * DESIGN :
 * - Fond sombre (#201e30)
 * - Texte blanc avec accents orange
 * - Grand texte "ATLAS" en watermark (très transparent)
 * - Layout responsive (colonne sur mobile, ligne sur desktop)
 * 
 * @returns {JSX.Element} - Le contenu du footer
 */
export default function FooterContent() {
return (
<div className="flex h-full w-full flex-col justify-between bg-[#201e30] px-8 py-12 font-title text-white md:px-12">

{/* ═══════════════════════════════════════════════════════════════
    SECTION HAUTE : INFOS + NAVIGATION
    ═══════════════════════════════════════════════════════════════ */}
<div className="flex flex-col justify-between gap-10 md:flex-row">

{/* ─────────────────────────────────────────────────────────
    BLOC GAUCHE : LOGO ET DESCRIPTION
    ───────────────────────────────────────────────────────── */}
<div className="flex flex-col gap-4">
{/* Logo texte */}
<h3 className="text-2xl font-bold text-orange">ATLASLoot</h3>

{/* Description de l'entreprise */}
<p className="max-w-sm text-gray-400">
Votre comparateur de prix préféré. Trouvez les meilleures offres parmi des milliers de produits.
</p>
</div>


{/* ─────────────────────────────────────────────────────────
    BLOC DROITE : LIENS DE NAVIGATION
    ───────────────────────────────────────────────────────── */}
<div className="flex gap-10 md:gap-20">

{/* Colonne Navigation */}
<div className="flex flex-col gap-2">
<h3 className="mb-2 font-bold tracking-wider text-gray-500 uppercase">
Navigation
</h3>
<Link href="/" className="transition-colors hover:text-orange">
Accueil
</Link>
<Link href="/lists" className="transition-colors hover:text-orange">
Favoris
</Link>
<Link href="/about" className="transition-colors hover:text-orange">
À propos
</Link>
</div>

{/* Colonne Légal */}
<div className="flex flex-col gap-2">
<h3 className="mb-2 font-bold tracking-wider text-gray-500 uppercase">
Légal
</h3>
<Link href="/terms" className="transition-colors hover:text-orange">
Mentions légales
</Link>
<Link href="/privacy" className="transition-colors hover:text-orange">
Confidentialité
</Link>
</div>
</div>
</div>


{/* ═══════════════════════════════════════════════════════════════
    SECTION BASSE : WATERMARK + RÉSEAUX SOCIAUX + COPYRIGHT
    ═══════════════════════════════════════════════════════════════ */}
<div className="flex flex-col items-end justify-between border-t border-gray-700 pt-8 md:flex-row">

{/* ─────────────────────────────────────────────────────────
    GRAND TEXTE DÉCORATIF (WATERMARK)
    
    - Texte très grand (12vw mobile, 10vw desktop)
    - Très transparent (text-white/10 = 10% d'opacité)
    - select-none : empêche la sélection
    - leading-[0.8] : line-height réduit
    ───────────────────────────────────────────────────────── */}
<h1 className="select-none text-[12vw] font-bold leading-[0.8] text-white/10 md:text-[10vw]">
ATLAS
</h1>

{/* ─────────────────────────────────────────────────────────
    RÉSEAUX SOCIAUX + COPYRIGHT
    ───────────────────────────────────────────────────────── */}
<div className="flex flex-col items-end gap-4">

{/* Icônes réseaux sociaux */}
<div className="flex gap-4">
<Link href="#" className="transition-colors hover:text-orange">
<Instagram size={24} />
</Link>
<Link href="#" className="transition-colors hover:text-orange">
<Twitter size={24} />
</Link>
<Link href="#" className="transition-colors hover:text-orange">
<Linkedin size={24} />
</Link>
</div>

{/* Copyright */}
<p className="text-gray-500">
© 2024 AtlasLoot. Tous droits réservés.
</p>
</div>
</div>

</div>
);
}
