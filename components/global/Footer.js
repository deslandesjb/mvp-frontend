/**
 * ============================================================================
 * FICHIER : components/global/Footer.js
 * ============================================================================
 * 
 * CONTEXTE :
 * Ce composant crée un footer avec un effet "sticky reveal".
 * Le footer se révèle progressivement quand l'utilisateur scroll vers le bas.
 * 
 * RÔLE :
 * - Créer un conteneur pour le footer avec effet de révélation
 * - Utiliser le CSS clipping pour masquer puis révéler le contenu
 * 
 * FONCTIONNEMENT :
 * L'effet "sticky reveal" fonctionne en plusieurs étapes :
 * 
 * 1. Le conteneur principal a une hauteur de 800px
 * 2. clipPath cache tout ce qui dépasse du conteneur
 * 3. Un div enfant est positionné avec top négatif (-100vh)
 * 4. Sa hauteur totale est 100vh + 800px
 * 5. À l'intérieur, un div sticky reste collé en bas
 * 
 * RÉSULTAT VISUEL :
 * - Quand on scroll, le footer semble "apparaître" de sous la page
 * - Crée un effet de parallaxe/reveal très moderne
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React : Composant fonctionnel
 * - CSS : Position sticky, clipPath polygon
 * - Tailwind CSS : Classes utilitaires
 * 
 * ============================================================================
 */


// ============================================================================
// 1. IMPORTS
// ============================================================================

/**
 * React : Import de base
 */
import React from 'react';

/**
 * FooterContent : Le contenu réel du footer
 * Séparé pour une meilleure organisation du code
 */
import FooterContent from './FooterContent';


// ============================================================================
// 2. COMPOSANT FOOTER
// ============================================================================

/**
 * Footer : Conteneur avec effet sticky reveal
 * 
 * STRUCTURE CSS EXPLIQUÉE :
 * 
 * ┌─────────────────────────────────────────┐
 * │ div.relative h-[800px]                  │ ← Hauteur fixe du footer
 * │ clipPath: polygon(0 0, 100% 0, ...)     │ ← Masque le contenu débordant
 * │                                         │
 * │ ┌─────────────────────────────────────┐ │
 * │ │ div.relative -top-[100vh]           │ │ ← Positionné au-dessus
 * │ │ h-[calc(100vh+800px)]               │ │ ← Hauteur = viewport + footer
 * │ │                                     │ │
 * │ │ ┌─────────────────────────────────┐ │ │
 * │ │ │ div.sticky                      │ │ │ ← Reste collé en bas
 * │ │ │ top-[calc(100vh-800px)]         │ │ │   quand on scroll
 * │ │ │                                 │ │ │
 * │ │ │ <FooterContent />               │ │ │ ← Le vrai contenu
 * │ │ │                                 │ │ │
 * │ │ └─────────────────────────────────┘ │ │
 * │ └─────────────────────────────────────┘ │
 * └─────────────────────────────────────────┘
 * 
 * @returns {JSX.Element} - Le footer avec effet reveal
 */
export default function Footer() {
return (
<div
className="relative h-[800px]"
style={{clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)'}}
>
{/* ═══════════════════════════════════════════════════════════════
    DIV INTERMÉDIAIRE : Crée l'espace pour l'effet sticky
    
    - top négatif de 100vh : pousse le contenu vers le haut
    - hauteur = viewport + hauteur du footer
    ═══════════════════════════════════════════════════════════════ */}
<div className="relative -top-[100vh] h-[calc(100vh+800px)]">

{/* ─────────────────────────────────────────────────────────────
    DIV STICKY : Le contenu qui se révèle
    
    - position sticky : reste "collé" lors du scroll
    - top calculé : 100vh - 800px = position de révélation
    - hauteur 800px : correspond au conteneur parent
    ───────────────────────────────────────────────────────────── */}
<div className="sticky top-[calc(100vh-800px)] h-[800px]">
<FooterContent />
</div>

</div>
</div>
);
}
