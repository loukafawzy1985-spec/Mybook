/**
 * Vector illustrations for "معاذ وسر النظافة" (Muaath and the Secret of Cleanliness)
 * Hand-crafted, rich, colorful SVG illustrations converted to data URLs.
 */

function svgToDataUrl(svgString: string): string {
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

// 1. Cover Illustration: Muaath with soccer ball, bubbles, sunshine, mosque minaret
export function getCoverIllustration(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="40%" stop-color="#7dd3fc"/>
        <stop offset="75%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#fef08a"/>
      </linearGradient>
      <linearGradient id="sunGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4ade80"/>
        <stop offset="60%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#15803d"/>
      </linearGradient>
      <linearGradient id="mosqueGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="100%" stop-color="#cbd5e1"/>
      </linearGradient>
      <linearGradient id="bubbleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="40%" stop-color="#93c5fd" stop-opacity="0.5"/>
        <stop offset="80%" stop-color="#e879f9" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.7"/>
      </linearGradient>
      <linearGradient id="thobeGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="70%" stop-color="#f1f5f9"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.25"/>
      </filter>
    </defs>

    <!-- Sky -->
    <rect width="800" height="1060" fill="url(#skyGrad)"/>

    <!-- Sun rays -->
    <circle cx="680" cy="180" r="160" fill="url(#sunGlow)"/>
    <circle cx="680" cy="180" r="55" fill="#fef08a"/>

    <!-- Mosque in background -->
    <g opacity="0.65" transform="translate(40, 260)">
      <!-- Main Dome -->
      <path d="M 120 220 Q 170 120 220 220 Z" fill="url(#mosqueGrad)"/>
      <circle cx="170" cy="115" r="5" fill="#fbbf24"/>
      <!-- Small Dome -->
      <path d="M 50 240 Q 80 180 110 240 Z" fill="url(#mosqueGrad)"/>
      <!-- Minaret -->
      <rect x="250" y="80" width="30" height="160" fill="url(#mosqueGrad)"/>
      <polygon points="250,80 265,30 280,80" fill="#38bdf8"/>
      <rect x="245" y="130" width="40" height="8" fill="#fbbf24"/>
      <rect x="245" y="170" width="40" height="8" fill="#fbbf24"/>
      <circle cx="265" cy="25" r="4" fill="#fbbf24"/>
    </g>

    <!-- Rolling Hills / Grass -->
    <path d="M 0 680 Q 250 600 500 660 T 800 640 L 800 1060 L 0 1060 Z" fill="#86efac" opacity="0.6"/>
    <path d="M 0 740 Q 300 670 600 730 T 800 710 L 800 1060 L 0 1060 Z" fill="url(#grassGrad)"/>

    <!-- Soccer Field Lines -->
    <path d="M 0 950 Q 400 880 800 950" stroke="#ffffff" stroke-width="4" stroke-opacity="0.4" fill="none"/>
    <ellipse cx="400" cy="980" rx="140" ry="40" stroke="#ffffff" stroke-width="4" stroke-opacity="0.3" fill="none"/>

    <!-- Bubbles of Cleanliness Floating -->
    <g>
      <circle cx="180" cy="420" r="32" fill="url(#bubbleGrad)"/>
      <circle cx="172" cy="410" r="8" fill="#ffffff" opacity="0.8"/>
      <circle cx="120" cy="490" r="22" fill="url(#bubbleGrad)"/>
      <circle cx="115" cy="483" r="5" fill="#ffffff" opacity="0.8"/>
      <circle cx="640" cy="520" r="40" fill="url(#bubbleGrad)"/>
      <circle cx="628" cy="508" r="10" fill="#ffffff" opacity="0.8"/>
      <circle cx="690" cy="440" r="24" fill="url(#bubbleGrad)"/>
      <circle cx="260" cy="360" r="18" fill="url(#bubbleGrad)"/>
      <circle cx="560" cy="380" r="28" fill="url(#bubbleGrad)"/>
    </g>

    <!-- Sparkles -->
    <g fill="#fde047">
      <path d="M 140 330 L 145 345 L 160 350 L 145 355 L 140 370 L 135 355 L 120 350 L 135 345 Z"/>
      <path d="M 680 340 L 684 352 L 696 356 L 684 360 L 680 372 L 676 360 L 664 356 L 676 352 Z" transform="scale(0.8) translate(140, 50)"/>
      <path d="M 230 540 L 233 550 L 243 553 L 233 556 L 230 566 L 227 556 L 217 553 L 227 550 Z"/>
    </g>

    <!-- Main Character: Muaath (10 years old) -->
    <g id="muaath" transform="translate(180, 280)" filter="url(#softShadow)">
      <!-- Legs & Shoes -->
      <rect x="180" y="470" width="30" height="90" fill="#cbd5e1" rx="8"/>
      <rect x="235" y="470" width="30" height="90" fill="#cbd5e1" rx="8"/>
      <!-- Athletic clean sneakers -->
      <path d="M 165 545 Q 185 530 215 545 L 215 570 L 160 570 Z" fill="#0284c7"/>
      <path d="M 160 565 L 215 565 L 215 572 L 160 572 Z" fill="#ffffff"/>
      <path d="M 230 545 Q 255 530 285 545 L 285 570 L 230 570 Z" fill="#0284c7"/>
      <path d="M 230 565 L 285 565 L 285 572 L 230 572 Z" fill="#ffffff"/>

      <!-- Body: Neat Sporty White/Light Blue Thobe / Jersey -->
      <path d="M 160 250 L 290 250 L 310 480 L 140 480 Z" fill="url(#thobeGrad)"/>
      <!-- Collar & Gold Embroidery / Details -->
      <rect x="215" y="248" width="20" height="90" fill="#38bdf8" rx="4"/>
      <circle cx="225" cy="270" r="4" fill="#fbbf24"/>
      <circle cx="225" cy="300" r="4" fill="#fbbf24"/>

      <!-- Left Arm holding Soccer Ball -->
      <path d="M 160 260 Q 110 320 135 390" stroke="#f1f5f9" stroke-width="32" stroke-linecap="round" fill="none"/>
      <!-- Hand holding ball -->
      <circle cx="140" cy="390" r="18" fill="#fed7aa"/>

      <!-- Soccer Ball -->
      <g transform="translate(85, 345)">
        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#334155" stroke-width="4"/>
        <polygon points="50,30 65,42 60,58 40,58 35,42" fill="#0f172a"/>
        <polygon points="50,15 58,2 42,2" fill="#0f172a"/>
        <polygon points="80,32 94,26 90,40" fill="#0f172a"/>
        <polygon points="78,72 88,82 74,88" fill="#0f172a"/>
        <polygon points="22,72 12,82 26,88" fill="#0f172a"/>
        <polygon points="20,32 6,26 10,40" fill="#0f172a"/>
        <!-- Clean Shine on ball -->
        <path d="M 25 22 Q 40 16 65 20" stroke="#bae6fd" stroke-width="4" stroke-linecap="round" fill="none"/>
      </g>

      <!-- Right Arm Raised in friendly wave -->
      <path d="M 290 260 Q 360 290 350 220" stroke="#f1f5f9" stroke-width="30" stroke-linecap="round" fill="none"/>
      <!-- Right Hand waving -->
      <circle cx="350" cy="210" r="17" fill="#fed7aa"/>
      <rect x="340" y="195" width="8" height="18" fill="#fed7aa" rx="4"/>
      <rect x="348" y="193" width="7" height="19" fill="#fed7aa" rx="4"/>
      <rect x="355" y="196" width="6" height="17" fill="#fed7aa" rx="4"/>

      <!-- Neck -->
      <rect x="210" y="210" width="30" height="42" fill="#fed7aa" rx="6"/>

      <!-- Head / Face -->
      <ellipse cx="225" cy="165" rx="58" ry="64" fill="#fed7aa"/>

      <!-- Ears -->
      <circle cx="167" cy="168" r="12" fill="#fed7aa"/>
      <circle cx="283" cy="168" r="12" fill="#fed7aa"/>

      <!-- Cheeks (Healthy Rosy) -->
      <ellipse cx="190" cy="180" rx="12" ry="7" fill="#f87171" opacity="0.4"/>
      <ellipse cx="260" cy="180" rx="12" ry="7" fill="#f87171" opacity="0.4"/>

      <!-- Eyes (Big, Expressive, Happy) -->
      <ellipse cx="200" cy="160" rx="9" ry="11" fill="#1e293b"/>
      <circle cx="197" cy="156" r="3.5" fill="#ffffff"/>
      <ellipse cx="250" cy="160" rx="9" ry="11" fill="#1e293b"/>
      <circle cx="247" cy="156" r="3.5" fill="#ffffff"/>

      <!-- Eyebrows -->
      <path d="M 190 144 Q 202 138 214 145" stroke="#334155" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M 236 145 Q 248 138 260 144" stroke="#334155" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Nose -->
      <path d="M 223 165 Q 225 174 230 173" stroke="#f97316" stroke-width="3" stroke-linecap="round" fill="none"/>

      <!-- Big Smiling Mouth -->
      <path d="M 205 188 Q 225 210 245 188 Z" fill="#b91c1c"/>
      <!-- Teeth -->
      <path d="M 209 189 Q 225 197 241 189" fill="#ffffff"/>

      <!-- Hair: Neat, Dark Wavy/Sporty -->
      <path d="M 166 150 Q 165 95 225 95 Q 285 95 284 150 Q 265 110 225 112 Q 185 110 166 150 Z" fill="#332414"/>
      <!-- Soft tufts of hair -->
      <path d="M 190 102 Q 200 85 220 95" fill="#332414"/>
      <path d="M 225 96 Q 240 85 255 100" fill="#332414"/>
    </g>

    <!-- Soap Bar with Suds at bottom corner -->
    <g transform="translate(620, 860)" filter="url(#softShadow)">
      <rect x="0" y="15" width="80" height="45" rx="16" fill="#38bdf8"/>
      <rect x="8" y="8" width="80" height="45" rx="16" fill="#7dd3fc"/>
      <!-- Soap brand sparkle -->
      <circle cx="48" cy="30" r="10" fill="#bae6fd"/>
      <text x="32" y="34" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0284c7">نقاء</text>
      <!-- Suds -->
      <circle cx="10" cy="10" r="14" fill="#ffffff" opacity="0.85"/>
      <circle cx="30" cy="5" r="10" fill="#ffffff" opacity="0.85"/>
      <circle cx="85" cy="18" r="12" fill="#ffffff" opacity="0.85"/>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 2. Page 1 Illustration: Muaath playing soccer outdoors, energetic, dusty & muddy hands/knees
export function getPage1Illustration(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
    <defs>
      <linearGradient id="p1Sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="60%" stop-color="#bae6fd"/>
        <stop offset="100%" stop-color="#fed7aa"/>
      </linearGradient>
      <linearGradient id="p1Ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d97706"/>
        <stop offset="30%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
      <filter id="dustBlur">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>

    <!-- Sky -->
    <rect width="800" height="1060" fill="url(#p1Sky)"/>

    <!-- Distant Houses/Buildings of the Neighborhood -->
    <rect x="60" y="440" width="100" height="160" fill="#cbd5e1"/>
    <polygon points="60,440 110,390 160,440" fill="#94a3b8"/>
    <rect x="200" y="460" width="140" height="140" fill="#e2e8f0"/>
    <rect x="620" y="420" width="120" height="180" fill="#cbd5e1"/>
    <polygon points="620,420 680,370 740,420" fill="#f87171"/>

    <!-- Goal Post -->
    <g stroke="#ffffff" stroke-width="12" stroke-linecap="round" opacity="0.85">
      <line x1="580" y1="360" x2="580" y2="680"/>
      <line x1="760" y1="360" x2="760" y2="680"/>
      <line x1="580" y1="360" x2="760" y2="360"/>
    </g>
    <!-- Goal Net -->
    <g stroke="#e2e8f0" stroke-width="2" stroke-opacity="0.4">
      <line x1="580" y1="410" x2="760" y2="410"/>
      <line x1="580" y1="460" x2="760" y2="460"/>
      <line x1="580" y1="510" x2="760" y2="510"/>
      <line x1="580" y1="560" x2="760" y2="560"/>
      <line x1="625" y1="360" x2="625" y2="680"/>
      <line x1="670" y1="360" x2="670" y2="680"/>
      <line x1="715" y1="360" x2="715" y2="680"/>
    </g>

    <!-- Playing Ground (Dusty soccer pitch) -->
    <path d="M 0 600 Q 300 580 800 600 L 800 1060 L 0 1060 Z" fill="url(#p1Ground)"/>

    <!-- Dust clouds from kicking -->
    <ellipse cx="260" cy="850" rx="90" ry="40" fill="#fde68a" opacity="0.6" filter="url(#dustBlur)"/>
    <ellipse cx="200" cy="890" rx="70" ry="30" fill="#fed7aa" opacity="0.7" filter="url(#dustBlur)"/>

    <!-- Soccer Ball flying in motion -->
    <g transform="translate(140, 720)">
      <!-- Motion lines -->
      <path d="M 200 40 Q 140 30 90 40" stroke="#fef08a" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M 190 70 Q 130 65 75 80" stroke="#fef08a" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Ball -->
      <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
      <polygon points="50,30 65,42 60,58 40,58 35,42" fill="#1e293b"/>
      <!-- Mud stains on ball -->
      <path d="M 20 60 Q 35 70 25 80 Z" fill="#78350f" opacity="0.8"/>
      <circle cx="70" cy="35" r="7" fill="#78350f" opacity="0.7"/>
    </g>

    <!-- Muaath Kicking the Ball enthusiastically -->
    <g transform="translate(240, 260)">
      <!-- Left leg supporting on ground with mud on knee -->
      <path d="M 120 400 L 90 530" stroke="#1e293b" stroke-width="36" stroke-linecap="round"/>
      <circle cx="95" cy="460" r="14" fill="#78350f"/><!-- mud on knee -->
      <!-- Left Shoe -->
      <path d="M 60 520 L 110 540 L 70 560 Z" fill="#dc2626"/>

      <!-- Right leg kicking forward in high dynamic kick! -->
      <path d="M 160 380 Q 220 400 270 340" stroke="#1e293b" stroke-width="36" stroke-linecap="round" fill="none"/>
      <!-- Right Shoe kicking -->
      <path d="M 260 320 L 310 330 L 290 365 Z" fill="#dc2626"/>

      <!-- Torso in Soccer Jersey (Number 10) -->
      <path d="M 90 220 L 190 220 L 170 390 L 80 390 Z" fill="#0284c7"/>
      <!-- Red Collar & Stripes -->
      <rect x="90" y="220" width="100" height="15" fill="#ef4444"/>
      <text x="110" y="320" font-family="Impact" font-size="64" fill="#ffffff">10</text>
      <!-- Mud splatters on shirt -->
      <circle cx="150" cy="340" r="9" fill="#78350f" opacity="0.75"/>
      <circle cx="105" cy="270" r="6" fill="#78350f" opacity="0.6"/>

      <!-- Left Arm balancing -->
      <path d="M 90 240 Q 30 280 20 230" stroke="#fed7aa" stroke-width="26" stroke-linecap="round" fill="none"/>
      <!-- Mud on left hand! -->
      <circle cx="20" cy="225" r="16" fill="#fed7aa"/>
      <path d="M 10 215 Q 24 220 20 235 Z" fill="#78350f"/>

      <!-- Right Arm stretching back for balance -->
      <path d="M 180 240 Q 250 260 270 210" stroke="#fed7aa" stroke-width="26" stroke-linecap="round" fill="none"/>
      <!-- Mud on right hand! -->
      <circle cx="270" cy="205" r="16" fill="#fed7aa"/>
      <circle cx="272" cy="202" r="9" fill="#78350f"/>

      <!-- Neck & Head -->
      <rect x="120" y="180" width="30" height="44" fill="#fed7aa"/>
      <ellipse cx="135" cy="140" rx="54" ry="60" fill="#fed7aa"/>

      <!-- Eyes & Cheeks -->
      <ellipse cx="155" cy="135" rx="8" ry="10" fill="#0f172a"/>
      <circle cx="157" cy="132" r="3" fill="#ffffff"/>
      <ellipse cx="115" cy="135" rx="8" ry="10" fill="#0f172a"/>
      <circle cx="117" cy="132" r="3" fill="#ffffff"/>

      <!-- Sweat drop of active boy -->
      <path d="M 185 130 C 185 120 193 115 193 125 C 193 132 185 135 185 130 Z" fill="#38bdf8"/>

      <!-- Joyful Determined Smile -->
      <path d="M 120 162 Q 138 180 156 162 Z" fill="#b91c1c"/>
      <path d="M 124 163 Q 138 170 152 163" stroke="#ffffff" stroke-width="3" fill="none"/>

      <!-- Nose & Eyebrows -->
      <path d="M 137 142 L 142 150 L 137 151" stroke="#ea580c" stroke-width="3" fill="none"/>
      <path d="M 110 120 Q 120 115 130 122" stroke="#1e293b" stroke-width="5" fill="none"/>
      <path d="M 148 122 Q 158 115 168 120" stroke="#1e293b" stroke-width="5" fill="none"/>

      <!-- Hair: Ruffled active dark hair -->
      <path d="M 85 130 Q 80 75 140 75 Q 195 75 190 130 Q 170 95 140 95 Q 105 95 85 130 Z" fill="#2d1c0b"/>
      <polygon points="135,70 148,55 152,73" fill="#2d1c0b"/>
      <polygon points="160,75 174,60 176,80" fill="#2d1c0b"/>
    </g>

    <!-- Mud text indicator badge -->
    <g transform="translate(60, 920)">
      <rect width="200" height="50" rx="12" fill="#451a03" opacity="0.85"/>
      <text x="100" y="32" font-family="'Cairo', sans-serif" font-size="18" font-weight="bold" fill="#fef08a" text-anchor="middle">⚽ يد متسخة بالتراب!</text>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 3. Page 2 Illustration: Muaath rushing to dining table, reaching with dusty hands, mom warning him
export function getPage2Illustration(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
    <defs>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef3c7"/>
        <stop offset="100%" stop-color="#fed7aa"/>
      </linearGradient>
      <linearGradient id="tableGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#92400e"/>
        <stop offset="50%" stop-color="#b45309"/>
        <stop offset="100%" stop-color="#78350f"/>
      </linearGradient>
    </defs>

    <!-- Cozy Warm Dining Room Wall -->
    <rect width="800" height="1060" fill="url(#wallGrad)"/>

    <!-- Window with curtain -->
    <rect x="80" y="80" width="180" height="240" fill="#7dd3fc" stroke="#f1f5f9" stroke-width="12" rx="8"/>
    <line x1="170" y1="80" x2="170" y2="320" stroke="#f1f5f9" stroke-width="8"/>
    <line x1="80" y1="200" x2="260" y2="200" stroke="#f1f5f9" stroke-width="8"/>
    <path d="M 60 70 Q 110 140 70 320" fill="#f43f5e" opacity="0.8"/>
    <path d="M 280 70 Q 230 140 270 320" fill="#f43f5e" opacity="0.8"/>

    <!-- Tile Floor -->
    <rect x="0" y="700" width="800" height="360" fill="#e2e8f0"/>
    <g stroke="#cbd5e1" stroke-width="2">
      <line x1="0" y1="780" x2="800" y2="780"/>
      <line x1="0" y1="860" x2="800" y2="860"/>
      <line x1="0" y1="940" x2="800" y2="940"/>
      <line x1="160" y1="700" x2="160" y2="1060"/>
      <line x1="360" y1="700" x2="360" y2="1060"/>
      <line x1="560" y1="700" x2="560" y2="1060"/>
      <line x1="740" y1="700" x2="740" y2="1060"/>
    </g>

    <!-- Dining Table in foreground/middle -->
    <path d="M 40 620 L 760 620 L 800 750 L 0 750 Z" fill="url(#tableGrad)"/>
    <!-- Tablecloth -->
    <ellipse cx="400" cy="650" rx="340" ry="40" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>

    <!-- Delicious Food on Table -->
    <!-- Bread Basket -->
    <ellipse cx="480" cy="640" rx="55" ry="25" fill="#d97706"/>
    <ellipse cx="460" cy="635" rx="30" ry="15" fill="#fef08a"/><!-- Fresh bread -->
    <ellipse cx="495" cy="635" rx="28" ry="14" fill="#fef08a"/>
    <!-- Fruit Bowl -->
    <ellipse cx="320" cy="640" rx="50" ry="22" fill="#0284c7"/>
    <circle cx="310" cy="630" r="14" fill="#ef4444"/><!-- Apple -->
    <circle cx="330" cy="630" r="13" fill="#eab308"/><!-- Orange -->
    <circle cx="320" cy="622" r="11" fill="#22c55e"/>
    <!-- Soup Bowl steaming -->
    <ellipse cx="200" cy="645" rx="42" ry="18" fill="#e2e8f0"/>
    <ellipse cx="200" cy="642" rx="36" ry="12" fill="#f97316"/>
    <!-- Steam -->
    <path d="M 195 625 Q 190 605 198 590" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M 205 625 Q 212 605 204 590" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.6"/>

    <!-- Caring Mother Standing Near Sink in Background -->
    <g transform="translate(140, 240)">
      <!-- Headscarf (Hijab) & Dress -->
      <path d="M 50 140 Q 90 90 130 140 L 140 400 L 40 400 Z" fill="#0284c7"/>
      <!-- Soft Veil -->
      <path d="M 55 130 Q 90 80 125 130 Q 130 200 90 200 Q 50 200 55 130 Z" fill="#ec4899"/>
      <!-- Face -->
      <ellipse cx="90" cy="140" rx="26" ry="30" fill="#fed7aa"/>
      <ellipse cx="80" cy="138" rx="4" ry="5" fill="#0f172a"/>
      <ellipse cx="100" cy="138" rx="4" ry="5" fill="#0f172a"/>
      <!-- Concerned smile -->
      <path d="M 83 156 Q 90 162 98 156" stroke="#b91c1c" stroke-width="2" fill="none"/>
      <!-- Mother gesturing with open hand towards the sink/bathroom -->
      <path d="M 125 220 Q 180 200 170 160" stroke="#0284c7" stroke-width="20" stroke-linecap="round" fill="none"/>
      <circle cx="170" cy="155" r="12" fill="#fed7aa"/>
      <!-- Speech bubble from Mother -->
      <g transform="translate(170, -20)">
        <rect width="180" height="85" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
        <polygon points="20,85 10,105 35,85" fill="#ffffff"/>
        <text x="90" y="36" font-family="'Cairo', sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">«اغسل يديكَ</text>
        <text x="90" y="62" font-family="'Cairo', sans-serif" font-size="16" font-weight="bold" fill="#dc2626" text-anchor="middle">بالصابون أولاً!»</text>
      </g>
    </g>

    <!-- Muaath: Hungry, reaching eagerly with very dirty hands! -->
    <g transform="translate(480, 310)">
      <!-- Body leaning forward towards food -->
      <path d="M 80 240 L 160 210 L 180 420 L 70 420 Z" fill="#2563eb"/>

      <!-- Dirty Muddy Right Arm grabbing bread -->
      <path d="M 80 240 Q 20 280 -60 320" stroke="#fed7aa" stroke-width="32" stroke-linecap="round" fill="none"/>
      <!-- Muddy Hand on Food! -->
      <circle cx="-60" cy="320" r="20" fill="#fed7aa"/>
      <!-- Visible Brown Mud and Germ spots on fingers -->
      <path d="M -70 310 Q -50 315 -60 330 Z" fill="#78350f"/>
      <circle cx="-50" cy="315" r="6" fill="#78350f"/>
      <circle cx="-68" cy="326" r="5" fill="#78350f"/>
      <!-- Bacteria warning symbol -->
      <circle cx="-60" cy="270" r="18" fill="#ef4444"/>
      <text x="-60" y="276" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">🦠</text>

      <!-- Head looking hungrily at the food -->
      <ellipse cx="110" cy="140" rx="55" ry="60" fill="#fed7aa"/>
      <!-- Big hungry eyes -->
      <ellipse cx="85" cy="135" rx="10" ry="12" fill="#0f172a"/>
      <circle cx="82" cy="130" r="4" fill="#ffffff"/>
      <ellipse cx="125" cy="135" rx="10" ry="12" fill="#0f172a"/>
      <circle cx="122" cy="130" r="4" fill="#ffffff"/>
      <!-- Mouth watering / open for food -->
      <path d="M 90 162 Q 105 188 120 162 Z" fill="#b91c1c"/>

      <!-- Hair messy from playing -->
      <path d="M 60 130 Q 60 75 120 75 Q 170 75 165 130 Q 140 95 110 95 Q 80 95 60 130 Z" fill="#2d1c0b"/>
    </g>

    <!-- Warning banner -->
    <g transform="translate(240, 960)">
      <rect width="320" height="48" rx="12" fill="#dc2626"/>
      <text x="160" y="32" font-family="'Cairo', sans-serif" font-size="19" font-weight="bold" fill="#ffffff" text-anchor="middle">⚠️ خطر: تناول الطعام بأيدٍ ملوثة!</text>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 4. Page 3 Illustration: Muaath at bathroom sink, happily washing hands with foamy soap & 20s bubbles
export function getPage3Illustration(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
    <defs>
      <linearGradient id="p3Tile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ecfeff"/>
        <stop offset="100%" stop-color="#a5f3fc"/>
      </linearGradient>
      <linearGradient id="mirrorGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e0f2fe"/>
        <stop offset="100%" stop-color="#bae6fd"/>
      </linearGradient>
      <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#e0f2fe"/>
      </linearGradient>
    </defs>

    <!-- Bright Clean Bathroom Tiles -->
    <rect width="800" height="1060" fill="url(#p3Tile)"/>
    <g stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.25">
      <line x1="0" y1="120" x2="800" y2="120"/>
      <line x1="0" y1="240" x2="800" y2="240"/>
      <line x1="0" y1="360" x2="800" y2="360"/>
      <line x1="0" y1="480" x2="800" y2="480"/>
      <line x1="0" y1="600" x2="800" y2="600"/>
      <line x1="160" y1="0" x2="160" y2="700"/>
      <line x1="320" y1="0" x2="320" y2="700"/>
      <line x1="480" y1="0" x2="480" y2="700"/>
      <line x1="640" y1="0" x2="640" y2="700"/>
    </g>

    <!-- Mirror on Wall -->
    <rect x="220" y="60" width="360" height="280" rx="20" fill="url(#mirrorGrad)" stroke="#38bdf8" stroke-width="14"/>
    <path d="M 240 80 L 340 80 L 260 200 Z" fill="#ffffff" opacity="0.4"/>

    <!-- Shiny Chrome Faucet / Tap -->
    <g transform="translate(370, 480)">
      <rect x="20" y="0" width="20" height="70" fill="#94a3b8" rx="6"/>
      <path d="M 30 0 Q 30 -50 0 -45 L -10 -35" stroke="#94a3b8" stroke-width="16" stroke-linecap="round" fill="none"/>
      <!-- Running Clean Water Stream -->
      <path d="M -10 -25 L -10 90" stroke="#38bdf8" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
      <!-- Water Splashes -->
      <circle cx="-16" cy="85" r="4" fill="#38bdf8"/>
      <circle cx="-2" cy="78" r="5" fill="#38bdf8"/>
    </g>

    <!-- Ceramic Sink Basin -->
    <ellipse cx="400" cy="620" rx="220" ry="80" fill="#ffffff" stroke="#cbd5e1" stroke-width="10"/>
    <ellipse cx="400" cy="625" rx="180" ry="55" fill="#e0f2fe"/>

    <!-- Soap Dispenser with bubbles -->
    <g transform="translate(560, 490)">
      <rect x="15" y="40" width="45" height="70" rx="10" fill="#38bdf8"/>
      <rect x="25" y="15" width="25" height="25" rx="4" fill="#94a3b8"/>
      <rect x="10" y="15" width="20" height="6" fill="#64748b"/>
      <text x="37" y="80" font-family="'Cairo', sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">صابون</text>
    </g>

    <!-- Muaath Washing Hands with Great Big Bubbles! -->
    <!-- Head & Upper Body -->
    <g transform="translate(260, 160)">
      <!-- Shoulders in clean clothes -->
      <path d="M 40 330 Q 140 280 240 330 L 270 470 L 10 470 Z" fill="#0284c7"/>

      <!-- Arms bent down into the sink -->
      <path d="M 60 340 Q 110 440 130 430" stroke="#fed7aa" stroke-width="30" stroke-linecap="round" fill="none"/>
      <path d="M 220 340 Q 170 440 150 430" stroke="#fed7aa" stroke-width="30" stroke-linecap="round" fill="none"/>

      <!-- Foamy Soap Suds Covering Both Hands in Basin -->
      <g transform="translate(110, 400)">
        <ellipse cx="30" cy="30" rx="45" ry="25" fill="url(#foamGrad)"/>
        <circle cx="10" cy="20" r="14" fill="#ffffff"/>
        <circle cx="35" cy="15" r="18" fill="#ffffff"/>
        <circle cx="50" cy="28" r="16" fill="#ffffff"/>
        <circle cx="20" cy="40" r="12" fill="#ffffff"/>
        <!-- Clean sparkling bubbles floating -->
        <circle cx="-30" cy="-20" r="16" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="80" cy="-30" r="22" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="110" cy="10" r="12" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>
      </g>

      <!-- Head / Face Smiling Broadly -->
      <ellipse cx="140" cy="150" rx="55" ry="60" fill="#fed7aa"/>
      <circle cx="85" cy="150" r="12" fill="#fed7aa"/>
      <circle cx="195" cy="150" r="12" fill="#fed7aa"/>

      <!-- Big Happy Eyes -->
      <ellipse cx="120" cy="145" rx="9" ry="11" fill="#0f172a"/>
      <circle cx="117" cy="141" r="3.5" fill="#ffffff"/>
      <ellipse cx="160" cy="145" rx="9" ry="11" fill="#0f172a"/>
      <circle cx="157" cy="141" r="3.5" fill="#ffffff"/>

      <!-- Rosy Cheeks -->
      <ellipse cx="110" cy="165" rx="12" ry="6" fill="#f87171" opacity="0.4"/>
      <ellipse cx="170" cy="165" rx="12" ry="6" fill="#f87171" opacity="0.4"/>

      <!-- Proud Smile -->
      <path d="M 125 175 Q 140 195 155 175 Z" fill="#b91c1c"/>
      <path d="M 128 176 Q 140 182 152 176" fill="#ffffff"/>

      <!-- Dark Neat Hair -->
      <path d="M 85 140 Q 80 85 140 85 Q 200 85 195 140 Q 170 100 140 100 Q 110 100 85 140 Z" fill="#2d1c0b"/>
    </g>

    <!-- 20 Seconds Timer Badge (Doctor's Rule) -->
    <g transform="translate(80, 750)">
      <rect width="250" height="110" rx="18" fill="#15803d" stroke="#ffffff" stroke-width="4"/>
      <circle cx="50" cy="55" r="32" fill="#ffffff"/>
      <!-- Clock Hand showing 20s -->
      <circle cx="50" cy="55" r="26" fill="#dcfce7"/>
      <line x1="50" y1="55" x2="50" y2="36" stroke="#15803d" stroke-width="4"/>
      <line x1="50" y1="55" x2="68" y2="65" stroke="#dc2626" stroke-width="3"/>
      <text x="155" y="48" font-family="'Cairo', sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle">قاعدة الـ 20 ثانية</text>
      <text x="155" y="80" font-family="'Cairo', sans-serif" font-size="14" font-weight="bold" fill="#bbf7d0" text-anchor="middle">فرك اليدين بالصابون</text>
    </g>

    <!-- Defeated Bacteria Cartoon fleeing! -->
    <g transform="translate(620, 780)" opacity="0.8">
      <circle cx="30" cy="30" r="26" fill="#a855f7"/>
      <!-- Sad/dizzy face -->
      <text x="30" y="38" font-family="sans-serif" font-size="20" text-anchor="middle">😵</text>
      <path d="M 30 0 L 30 -10 M 55 15 L 65 10 M 55 45 L 65 50 M 0 30 L -10 30" stroke="#7e22ce" stroke-width="3"/>
      <text x="30" y="75" font-family="'Cairo', sans-serif" font-size="12" font-weight="bold" fill="#6b21a8" text-anchor="middle">وداعاً يا جراثيم!</text>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 5. Page 4 Illustration: Friday bathing & Ghusl, pristine white thobe, perfumed with oud
export function getPage4Illustration(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
    <defs>
      <linearGradient id="p4Room" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fef9c3"/>
        <stop offset="60%" stop-color="#fef08a"/>
        <stop offset="100%" stop-color="#fed7aa"/>
      </linearGradient>
      <linearGradient id="goldGleam" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>
    </defs>

    <!-- Bright Sunny Bedroom on Friday Morning -->
    <rect width="800" height="1060" fill="url(#p4Room)"/>

    <!-- Sunlight Beam streaming through arch window -->
    <path d="M 0 0 L 300 0 L 800 900 L 0 900 Z" fill="#ffffff" opacity="0.2"/>

    <!-- Islamic Arch Window -->
    <g transform="translate(520, 80)">
      <path d="M 20 280 L 20 140 Q 100 20 180 140 L 180 280 Z" fill="#38bdf8" stroke="#ffffff" stroke-width="10"/>
      <!-- Window Grilles -->
      <line x1="100" y1="60" x2="100" y2="280" stroke="#ffffff" stroke-width="6"/>
      <line x1="20" y1="180" x2="180" y2="180" stroke="#ffffff" stroke-width="6"/>
    </g>

    <!-- Dresser Table with Mirror -->
    <rect x="60" y="550" width="300" height="360" rx="12" fill="#78350f"/>
    <!-- Ornate Mirror -->
    <rect x="90" y="160" width="240" height="370" rx="30" fill="#bae6fd" stroke="url(#goldGleam)" stroke-width="14"/>
    <path d="M 110 180 L 220 180 L 130 330 Z" fill="#ffffff" opacity="0.5"/>

    <!-- Items on Dresser: Oud / Perfume Bottle & Siwak (Tooth stick) -->
    <g transform="translate(110, 500)">
      <!-- Perfume bottle (Oud / Attar) -->
      <rect x="20" y="15" width="35" height="40" rx="8" fill="url(#goldGleam)"/>
      <rect x="30" y="0" width="15" height="15" rx="3" fill="#fbbf24"/>
      <!-- Scent vapors -->
      <path d="M 37 -10 Q 30 -30 45 -45 Q 60 -60 50 -75" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75"/>
      <circle cx="50" cy="-80" r="4" fill="#fbbf24"/>
      <circle cx="36" cy="-40" r="3" fill="#fbbf24"/>

      <!-- Miswak (Natural toothbrush) on tray -->
      <rect x="80" y="42" width="80" height="10" rx="4" fill="#d97706"/>
      <rect x="80" y="40" width="12" height="14" rx="2" fill="#fef08a"/>
      <text x="120" y="32" font-family="'Cairo', sans-serif" font-size="12" font-weight="bold" fill="#78350f" text-anchor="middle">السواك</text>
    </g>

    <!-- Muaath Standing Tall & Radiant in Pure White Thobe -->
    <g transform="translate(380, 240)">
      <!-- Long Pristine White Thobe -->
      <path d="M 100 240 L 220 240 L 250 680 L 70 680 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="3"/>
      <!-- Soft fabric creases -->
      <path d="M 160 250 L 160 670" stroke="#f1f5f9" stroke-width="4"/>
      <path d="M 130 400 L 120 660" stroke="#f1f5f9" stroke-width="3"/>
      <path d="M 190 400 L 200 660" stroke="#f1f5f9" stroke-width="3"/>

      <!-- Clean Black/Brown Sandals -->
      <rect x="85" y="675" width="40" height="20" rx="6" fill="#78350f"/>
      <rect x="195" y="675" width="40" height="20" rx="6" fill="#78350f"/>

      <!-- Gold trim at collar -->
      <rect x="150" y="240" width="20" height="80" fill="#fef08a" stroke="#d97706" stroke-width="1.5" rx="3"/>

      <!-- Hands Applying Perfume to Wrist -->
      <path d="M 100 250 Q 50 320 130 350" stroke="#ffffff" stroke-width="26" stroke-linecap="round" fill="none"/>
      <circle cx="130" cy="350" r="14" fill="#fed7aa"/>
      <path d="M 220 250 Q 250 320 155 350" stroke="#ffffff" stroke-width="26" stroke-linecap="round" fill="none"/>
      <circle cx="155" cy="350" r="14" fill="#fed7aa"/>

      <!-- Scent Sparkles around wrist -->
      <circle cx="145" cy="330" r="5" fill="#f59e0b"/>
      <circle cx="135" cy="320" r="3" fill="#f59e0b"/>

      <!-- Head / Face Radiant & Clean (Ghusl completed) -->
      <ellipse cx="160" cy="140" rx="55" ry="60" fill="#fed7aa"/>
      <circle cx="105" cy="140" r="12" fill="#fed7aa"/>
      <circle cx="215" cy="140" r="12" fill="#fed7aa"/>

      <!-- Clean Sparkling Eyes -->
      <ellipse cx="140" cy="135" rx="9" ry="11" fill="#0f172a"/>
      <circle cx="137" cy="131" r="3.5" fill="#ffffff"/>
      <ellipse cx="180" cy="135" rx="9" ry="11" fill="#0f172a"/>
      <circle cx="177" cy="131" r="3.5" fill="#ffffff"/>

      <!-- Radiant Smile -->
      <path d="M 142 165 Q 160 185 178 165 Z" fill="#b91c1c"/>
      <path d="M 146 166 Q 160 172 174 166" fill="#ffffff"/>

      <!-- Hair: Combed, Fragrant, Neat -->
      <path d="M 105 130 Q 100 80 160 80 Q 220 80 215 130 Q 190 95 160 95 Q 130 95 105 130 Z" fill="#2d1c0b"/>
    </g>

    <!-- Friday Sunnahs Checklist Banner -->
    <g transform="translate(80, 870)">
      <rect width="640" height="90" rx="16" fill="#1e293b" opacity="0.95"/>
      <text x="320" y="32" font-family="'Cairo', sans-serif" font-size="17" font-weight="900" fill="#fde047" text-anchor="middle">🕌 سُنَنُ يَوْمِ الجُمُعَةِ المُبارَكِ</text>
      <text x="320" y="65" font-family="'Cairo', sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">الاسْتِحْمامُ (الغُسْلُ) · السِّواكُ · تَقْلِيمُ الأَظافِرِ · الثِّيابُ البَيْضاءُ · الطِّيبُ</text>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}

// 6. Page 5 & End Illustration: Muaath & Grandfather walking to mosque, glowing clean champion
export function getPage5Illustration(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1060" width="800" height="1060">
    <defs>
      <linearGradient id="p5Sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0284c7"/>
        <stop offset="50%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#e0f2fe"/>
      </linearGradient>
      <linearGradient id="mosqueGrand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>

    <!-- Clear Bright Sky -->
    <rect width="800" height="1060" fill="url(#p5Sky)"/>

    <!-- Magnificent Grand Mosque in Center Background -->
    <g transform="translate(180, 160)">
      <!-- Main Dome -->
      <path d="M 120 320 Q 220 140 320 320 Z" fill="url(#mosqueGrand)" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="220" cy="130" r="10" fill="#f59e0b"/>
      <!-- Crescent -->
      <path d="M 220 115 A 8 8 0 1 1 228 123 A 6 6 0 1 0 220 115 Z" fill="#f59e0b"/>

      <!-- Twin Minarets -->
      <rect x="40" y="100" width="36" height="260" fill="url(#mosqueGrand)"/>
      <polygon points="40,100 58,40 76,100" fill="#38bdf8"/>
      <rect x="360" y="100" width="36" height="260" fill="url(#mosqueGrand)"/>
      <polygon points="360,100 378,40 396,100" fill="#38bdf8"/>

      <!-- Grand Arches -->
      <rect x="80" y="320" width="280" height="120" fill="url(#mosqueGrand)"/>
      <path d="M 180 440 L 180 370 Q 220 340 260 370 L 260 440 Z" fill="#0f172a"/>
    </g>

    <!-- Palm Trees along the pathway -->
    <g transform="translate(40, 360)">
      <path d="M 50 320 Q 70 200 60 100" stroke="#78350f" stroke-width="16" stroke-linecap="round" fill="none"/>
      <!-- Fronds -->
      <path d="M 60 100 Q 10 70 -20 100" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 60 100 Q 110 60 140 90" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 60 100 Q 70 30 80 10" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>
    </g>
    <g transform="translate(680, 380)">
      <path d="M 40 320 Q 30 200 40 100" stroke="#78350f" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M 40 100 Q -10 60 -40 90" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="M 40 100 Q 90 70 120 100" stroke="#15803d" stroke-width="10" stroke-linecap="round" fill="none"/>
    </g>

    <!-- Clean Stone Courtyard / Pathway -->
    <path d="M 0 680 L 800 680 L 800 1060 L 0 1060 Z" fill="#f8fafc"/>
    <path d="M 280 680 L 520 680 L 640 1060 L 160 1060 Z" fill="#f1f5f9"/>

    <!-- Grandfather (Wise, smiling, dignified) -->
    <g transform="translate(180, 430)">
      <!-- Tall White Thobe with Bisht/Cloak -->
      <path d="M 80 240 L 200 240 L 220 540 L 60 540 Z" fill="#f8fafc"/>
      <path d="M 70 240 L 50 540" stroke="#d97706" stroke-width="14" stroke-linecap="round"/>
      <path d="M 210 240 L 230 540" stroke="#d97706" stroke-width="14" stroke-linecap="round"/>

      <!-- Hand on Muaath's shoulder -->
      <path d="M 190 260 Q 250 320 270 300" stroke="#f8fafc" stroke-width="26" stroke-linecap="round" fill="none"/>
      <circle cx="270" cy="300" r="14" fill="#fed7aa"/>

      <!-- Head with Ghutra & Agal -->
      <ellipse cx="140" cy="140" rx="46" ry="54" fill="#fed7aa"/>
      <path d="M 90 140 Q 90 80 140 80 Q 190 80 190 140 L 200 230 L 80 230 Z" fill="#ffffff"/><!-- White Ghutra -->
      <ellipse cx="140" cy="90" rx="42" ry="12" fill="#0f172a"/><!-- Agal -->

      <!-- White Beard -->
      <path d="M 115 150 Q 140 210 165 150 Z" fill="#f1f5f9"/>
      <!-- Kind Smiling Eyes -->
      <path d="M 120 135 Q 128 130 136 135" stroke="#1e293b" stroke-width="3" fill="none"/>
      <path d="M 148 135 Q 156 130 164 135" stroke="#1e293b" stroke-width="3" fill="none"/>
    </g>

    <!-- Muaath (10 years old) Walking Happily with Grandfather -->
    <g transform="translate(420, 500)">
      <!-- Crisp White Thobe -->
      <path d="M 80 190 L 170 190 L 190 480 L 60 480 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="75" y="475" width="30" height="15" rx="4" fill="#78350f"/>
      <rect x="150" y="475" width="30" height="15" rx="4" fill="#78350f"/>

      <!-- Head -->
      <ellipse cx="125" cy="115" rx="45" ry="50" fill="#fed7aa"/>
      <!-- Bright Happy Eyes -->
      <ellipse cx="110" cy="110" rx="7" ry="9" fill="#0f172a"/>
      <circle cx="108" cy="107" r="3" fill="#ffffff"/>
      <ellipse cx="142" cy="110" rx="7" ry="9" fill="#0f172a"/>
      <circle cx="140" cy="107" r="3" fill="#ffffff"/>
      <!-- Radiant Smile -->
      <path d="M 112 135 Q 126 150 140 135 Z" fill="#b91c1c"/>
      <path d="M 115 136 Q 126 141 137 136" fill="#ffffff"/>
      <!-- Hair -->
      <path d="M 80 110 Q 75 70 125 70 Q 175 70 170 110 Q 150 82 125 82 Q 98 82 80 110 Z" fill="#2d1c0b"/>

      <!-- Sparkles of Cleanliness around Muaath -->
      <path d="M 210 200 L 214 212 L 226 216 L 214 220 L 210 232 L 206 220 L 194 216 L 206 212 Z" fill="#fde047"/>
      <path d="M 40 240 L 43 250 L 53 253 L 43 256 L 40 266 L 37 256 L 27 253 L 37 250 Z" fill="#fde047"/>
    </g>

    <!-- Golden Hadith Banner at Bottom -->
    <g transform="translate(100, 940)">
      <rect width="600" height="60" rx="16" fill="#065f46" stroke="#fbbf24" stroke-width="3"/>
      <text x="300" y="38" font-family="'Cairo', sans-serif" font-size="20" font-weight="900" fill="#fef08a" text-anchor="middle">«النَّظَافَةُ مِنَ الإِيمَانِ»</text>
    </g>
  </svg>`;
  return svgToDataUrl(svg);
}
