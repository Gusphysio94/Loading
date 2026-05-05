import type { BodySide } from "../../types/bodyMap";

/**
 * Squelette anatomique stylisé — vue antérieure ou postérieure.
 * ViewBox 0..400 × 0..620, corps centré x=200.
 *
 * Design :
 *  - Os : remplissage ivoire translucide + contour blanc subtil pour
 *    "flotter" sur fond sombre (stars-bg).
 *  - Articulations : cercles légèrement plus contrastés.
 *  - Aucun élément n'est interactif ici — les hit zones (ellipses
 *    invisibles) sont posées par-dessus dans BodyMapScreen.
 */
export function SkeletonFigure({ side }: { side: BodySide }) {
  return (
    <g>
      <defs>
        <linearGradient id="bone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(248, 246, 240, 0.92)" />
          <stop offset="100%" stopColor="rgba(220, 222, 230, 0.78)" />
        </linearGradient>
        <linearGradient id="bone-grad-soft" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(248, 246, 240, 0.55)" />
          <stop offset="100%" stopColor="rgba(220, 222, 230, 0.42)" />
        </linearGradient>
        <radialGradient id="joint-grad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.95)" />
          <stop offset="100%" stopColor="rgba(180, 188, 205, 0.65)" />
        </radialGradient>
        <filter id="bone-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.7" />
        </filter>
      </defs>

      {/* Body silhouette, very faint, behind bones */}
      <BodySilhouette side={side} />

      {side === "front" ? <SkeletonFront /> : <SkeletonBack />}
    </g>
  );
}

const boneStyle = {
  fill: "url(#bone-grad)",
  stroke: "rgba(255, 255, 255, 0.55)",
  strokeWidth: 0.9,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const boneSoftStyle = {
  fill: "url(#bone-grad-soft)",
  stroke: "rgba(255, 255, 255, 0.42)",
  strokeWidth: 0.8,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const jointStyle = {
  fill: "url(#joint-grad)",
  stroke: "rgba(255, 255, 255, 0.55)",
  strokeWidth: 0.8,
};

const lineStyle = {
  fill: "none",
  stroke: "rgba(255, 255, 255, 0.45)",
  strokeWidth: 1.1,
  strokeLinecap: "round" as const,
};

function BodySilhouette({ side: _side }: { side: BodySide }) {
  // Subtle outer body outline so the skeleton feels embedded in a body
  return (
    <path
      d="M 200 14
         C 230 14 244 36 244 64
         C 244 80 240 92 232 102
         L 230 112
         C 245 116 260 122 270 130
         L 285 138
         C 295 145 302 158 305 172
         L 318 230
         C 322 248 322 268 314 282
         L 308 290
         C 308 295 305 300 300 302
         L 290 305
         L 290 280
         L 280 235
         L 270 195
         L 268 270
         C 268 280 265 286 260 290
         L 250 295
         L 248 305
         C 246 312 240 316 232 316
         L 220 318
         C 222 348 224 370 224 388
         L 226 430
         C 228 460 230 490 232 530
         L 234 580
         C 235 600 232 612 228 614
         L 215 614
         C 210 612 208 600 208 580
         L 208 540
         L 206 480
         L 204 430
         L 200 395
         L 196 430
         L 194 480
         L 192 540
         L 192 580
         C 192 600 190 612 185 614
         L 172 614
         C 168 612 165 600 166 580
         L 168 530
         C 170 490 172 460 174 430
         L 176 388
         C 176 370 178 348 180 318
         L 168 316
         C 160 316 154 312 152 305
         L 150 295
         L 140 290
         C 135 286 132 280 132 270
         L 130 195
         L 120 235
         L 110 280
         L 110 305
         L 100 302
         C 95 300 92 295 92 290
         L 86 282
         C 78 268 78 248 82 230
         L 95 172
         C 98 158 105 145 115 138
         L 130 130
         C 140 122 155 116 170 112
         L 168 102
         C 160 92 156 80 156 64
         C 156 36 170 14 200 14 Z"
      fill="rgba(255, 255, 255, 0.022)"
      stroke="rgba(255, 255, 255, 0.10)"
      strokeWidth={1}
      strokeLinejoin="round"
    />
  );
}

function SkeletonFront() {
  return (
    <g>
      {/* CRANIUM */}
      <path
        {...boneStyle}
        d="M 200 14
           C 228 14 240 36 240 60
           C 240 76 234 86 226 92
           L 224 96
           L 220 100
           L 180 100
           L 176 96
           L 174 92
           C 166 86 160 76 160 60
           C 160 36 172 14 200 14 Z"
      />
      {/* Eye sockets */}
      <ellipse cx={184} cy={56} rx={7.5} ry={5.5} fill="rgba(40, 50, 70, 0.65)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.6} />
      <ellipse cx={216} cy={56} rx={7.5} ry={5.5} fill="rgba(40, 50, 70, 0.65)" stroke="rgba(255,255,255,0.4)" strokeWidth={0.6} />
      {/* Nasal aperture */}
      <path
        d="M 196 70 L 200 88 L 204 70 Z"
        fill="rgba(40, 50, 70, 0.55)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={0.5}
      />
      {/* Maxilla teeth line */}
      <line x1={184} y1={94} x2={216} y2={94} stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />
      <line x1={184} y1={97} x2={216} y2={97} stroke="rgba(255,255,255,0.25)" strokeWidth={0.5} />
      {/* MANDIBLE */}
      <path
        {...boneStyle}
        d="M 174 95
           Q 174 110 200 116
           Q 226 110 226 95
           L 220 102
           L 180 102 Z"
      />

      {/* CERVICAL SPINE — 7 small vertebrae visible */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={`cv${i}`}
          x={194}
          y={102 + i * 4}
          width={12}
          height={3}
          rx={1}
          {...boneSoftStyle}
        />
      ))}

      {/* CLAVICLES (S-curve from sternum to acromion) */}
      <path
        {...boneStyle}
        d="M 198 128
           Q 175 119 145 130
           L 145 134
           Q 175 124 200 132 Z"
      />
      <path
        {...boneStyle}
        d="M 202 128
           Q 225 119 255 130
           L 255 134
           Q 225 124 200 132 Z"
      />
      {/* Acromion / shoulder joint balls */}
      <circle cx={140} cy={132} r={6} {...jointStyle} />
      <circle cx={260} cy={132} r={6} {...jointStyle} />

      {/* STERNUM — manubrium + body + xiphoid */}
      <path
        {...boneStyle}
        d="M 196 128
           L 204 128
           L 206 138
           L 204 198
           L 200 208
           L 196 198
           L 194 138 Z"
      />

      {/* RIBS — 8 anterior rib pairs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 140 + i * 12;
        const yEnd = y + 14;
        const yMid = y + 8;
        return (
          <g key={`rib${i}`}>
            <path
              {...lineStyle}
              d={`M 192 ${y} Q 155 ${yMid} 138 ${yEnd}`}
            />
            <path
              {...lineStyle}
              d={`M 208 ${y} Q 245 ${yMid} 262 ${yEnd}`}
            />
          </g>
        );
      })}

      {/* THORACIC vertebrae behind sternum (visible at margins) */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect
          key={`tv${i}`}
          x={196}
          y={210 + i * 8}
          width={8}
          height={6}
          rx={1}
          fill="rgba(220, 222, 230, 0.18)"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth={0.5}
        />
      ))}

      {/* HUMERUS (left + right) */}
      <path
        {...boneStyle}
        d="M 134 134
           L 116 200
           L 110 240
           L 116 244
           L 122 240
           L 126 200
           L 142 138 Z"
      />
      <path
        {...boneStyle}
        d="M 266 134
           L 284 200
           L 290 240
           L 284 244
           L 278 240
           L 274 200
           L 258 138 Z"
      />
      {/* Elbow joints */}
      <circle cx={113} cy={244} r={5.5} {...jointStyle} />
      <circle cx={287} cy={244} r={5.5} {...jointStyle} />

      {/* RADIUS + ULNA */}
      {/* Left forearm */}
      <path {...boneStyle} d="M 108 248 L 88 312 L 92 314 L 112 250 Z" />
      <path {...boneStyle} d="M 116 248 L 96 314 L 100 316 L 120 250 Z" />
      {/* Right forearm */}
      <path {...boneStyle} d="M 292 248 L 312 312 L 308 314 L 288 250 Z" />
      <path {...boneStyle} d="M 284 248 L 304 314 L 300 316 L 280 250 Z" />

      {/* WRIST + HAND (carpals + metacarpals + phalanges) */}
      <Hand cx={84} cy={340} flip={false} />
      <Hand cx={316} cy={340} flip={true} />

      {/* PELVIS — Iliac wings + acetabulum + pubic symphysis */}
      <path
        {...boneStyle}
        d="M 158 254
           Q 142 264 138 282
           Q 138 296 150 304
           Q 165 308 175 296
           L 178 280
           L 172 264
           Q 165 256 158 254 Z"
      />
      <path
        {...boneStyle}
        d="M 242 254
           Q 258 264 262 282
           Q 262 296 250 304
           Q 235 308 225 296
           L 222 280
           L 228 264
           Q 235 256 242 254 Z"
      />
      {/* Pubic symphysis bridge */}
      <path
        {...boneStyle}
        d="M 178 282
           L 184 296
           Q 192 304 200 304
           Q 208 304 216 296
           L 222 282
           L 218 280
           Q 208 290 200 290
           Q 192 290 182 280 Z"
      />
      {/* Sacrum (visible center) */}
      <path
        {...boneSoftStyle}
        d="M 188 256
           L 212 256
           L 210 280
           L 200 288
           L 190 280 Z"
      />
      {/* Hip joints (femoral head sockets) */}
      <circle cx={160} cy={296} r={7} {...jointStyle} />
      <circle cx={240} cy={296} r={7} {...jointStyle} />

      {/* FEMUR */}
      <path
        {...boneStyle}
        d="M 154 300
           L 162 360
           L 168 410
           L 178 412
           L 178 360
           L 168 300 Z"
      />
      <path
        {...boneStyle}
        d="M 246 300
           L 238 360
           L 232 410
           L 222 412
           L 222 360
           L 232 300 Z"
      />
      {/* PATELLA */}
      <ellipse cx={172} cy={425} rx={9} ry={7} {...boneStyle} />
      <ellipse cx={228} cy={425} rx={9} ry={7} {...boneStyle} />
      {/* Knee joint markers */}
      <circle cx={172} cy={420} r={4} {...jointStyle} opacity={0.6} />
      <circle cx={228} cy={420} r={4} {...jointStyle} opacity={0.6} />

      {/* TIBIA + FIBULA */}
      {/* Left */}
      <path {...boneStyle} d="M 164 432 L 164 540 L 172 542 L 172 432 Z" />
      <path {...boneStyle} d="M 176 436 L 176 538 L 182 538 L 182 436 Z" />
      {/* Right */}
      <path {...boneStyle} d="M 236 432 L 236 540 L 228 542 L 228 432 Z" />
      <path {...boneStyle} d="M 224 436 L 224 538 L 218 538 L 218 436 Z" />
      {/* Ankle joints */}
      <circle cx={170} cy={544} r={5} {...jointStyle} />
      <circle cx={230} cy={544} r={5} {...jointStyle} />

      {/* FOOT (tarsals + metatarsals + phalanges) */}
      <Foot cx={170} cy={580} />
      <Foot cx={230} cy={580} />
    </g>
  );
}

function SkeletonBack() {
  return (
    <g>
      {/* OCCIPUT — occipital bone, more rounded posteriorly */}
      <path
        {...boneStyle}
        d="M 200 14
           C 230 14 242 36 242 62
           C 242 80 236 92 228 96
           L 226 100
           L 220 102
           L 180 102
           L 174 100
           L 172 96
           C 164 92 158 80 158 62
           C 158 36 170 14 200 14 Z"
      />
      {/* External occipital protuberance */}
      <ellipse cx={200} cy={88} rx={4} ry={2.5} fill="rgba(220,222,230,0.45)" stroke="rgba(255,255,255,0.30)" strokeWidth={0.5} />

      {/* SPINAL COLUMN — all vertebrae visible, with spinous processes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const y = 102 + i * 7;
        // cervical narrower, lumbar wider
        const w = i < 7 ? 10 : i < 19 ? 12 : 16;
        const h = 5;
        return (
          <g key={`vt${i}`}>
            <rect
              x={200 - w / 2}
              y={y}
              width={w}
              height={h}
              rx={1.5}
              {...boneStyle}
            />
            {/* Spinous process tick */}
            <line
              x1={200}
              y1={y + h}
              x2={200}
              y2={y + h + 1.8}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={0.7}
            />
          </g>
        );
      })}

      {/* CLAVICLES (visible from behind too, top edges) */}
      <path
        {...boneSoftStyle}
        d="M 198 128 Q 175 119 145 130 L 145 132 Q 175 124 200 130 Z"
      />
      <path
        {...boneSoftStyle}
        d="M 202 128 Q 225 119 255 130 L 255 132 Q 225 124 200 130 Z"
      />
      <circle cx={140} cy={132} r={6} {...jointStyle} />
      <circle cx={260} cy={132} r={6} {...jointStyle} />

      {/* SCAPULAE — triangular flat bones */}
      <path
        {...boneStyle}
        d="M 148 138
           L 188 142
           L 184 196
           L 154 188
           L 144 158 Z"
      />
      <path
        {...boneStyle}
        d="M 252 138
           L 212 142
           L 216 196
           L 246 188
           L 256 158 Z"
      />
      {/* Scapular spine (horizontal ridge) */}
      <line x1={148} y1={156} x2={186} y2={158} stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />
      <line x1={252} y1={156} x2={214} y2={158} stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />

      {/* RIBS posterior (faint, since spine + scapula dominate) */}
      {Array.from({ length: 7 }).map((_, i) => {
        const y = 150 + i * 11;
        const yEnd = y + 18;
        return (
          <g key={`brib${i}`} opacity={0.45}>
            <path {...lineStyle} d={`M 192 ${y} Q 168 ${y + 8} 138 ${yEnd}`} />
            <path {...lineStyle} d={`M 208 ${y} Q 232 ${y + 8} 262 ${yEnd}`} />
          </g>
        );
      })}

      {/* HUMERI (back) */}
      <path
        {...boneStyle}
        d="M 134 134 L 116 200 L 110 240 L 116 244 L 122 240 L 126 200 L 142 138 Z"
      />
      <path
        {...boneStyle}
        d="M 266 134 L 284 200 L 290 240 L 284 244 L 278 240 L 274 200 L 258 138 Z"
      />
      <circle cx={113} cy={244} r={5.5} {...jointStyle} />
      <circle cx={287} cy={244} r={5.5} {...jointStyle} />

      {/* RADIUS + ULNA (back: ulna is medial here) */}
      <path {...boneStyle} d="M 108 248 L 88 312 L 92 314 L 112 250 Z" />
      <path {...boneStyle} d="M 116 248 L 96 314 L 100 316 L 120 250 Z" />
      <path {...boneStyle} d="M 292 248 L 312 312 L 308 314 L 288 250 Z" />
      <path {...boneStyle} d="M 284 248 L 304 314 L 300 316 L 280 250 Z" />

      {/* HANDS (back) */}
      <Hand cx={84} cy={340} flip={false} />
      <Hand cx={316} cy={340} flip={true} />

      {/* PELVIS posterior — iliac crests + sacrum + ischial tuberosities */}
      <path
        {...boneStyle}
        d="M 158 254
           Q 138 268 140 290
           L 152 308
           L 175 304
           L 184 286
           L 178 264
           Q 168 254 158 254 Z"
      />
      <path
        {...boneStyle}
        d="M 242 254
           Q 262 268 260 290
           L 248 308
           L 225 304
           L 216 286
           L 222 264
           Q 232 254 242 254 Z"
      />
      {/* SACRUM (prominent posterior) */}
      <path
        {...boneStyle}
        d="M 184 264
           L 216 264
           L 214 296
           L 200 308
           L 186 296 Z"
      />
      {/* Sacral foramina */}
      {[0, 1, 2].map((i) => (
        <g key={`sf${i}`}>
          <ellipse
            cx={193}
            cy={272 + i * 7}
            rx={1.5}
            ry={1.5}
            fill="rgba(40,50,70,0.45)"
          />
          <ellipse
            cx={207}
            cy={272 + i * 7}
            rx={1.5}
            ry={1.5}
            fill="rgba(40,50,70,0.45)"
          />
        </g>
      ))}
      {/* Hip joints (greater trochanter projection) */}
      <circle cx={160} cy={296} r={7} {...jointStyle} />
      <circle cx={240} cy={296} r={7} {...jointStyle} />

      {/* FEMUR */}
      <path
        {...boneStyle}
        d="M 154 300 L 162 360 L 168 410 L 178 412 L 178 360 L 168 300 Z"
      />
      <path
        {...boneStyle}
        d="M 246 300 L 238 360 L 232 410 L 222 412 L 222 360 L 232 300 Z"
      />
      {/* Knee joints (back: condyles visible) */}
      <ellipse cx={172} cy={420} rx={11} ry={6} {...boneSoftStyle} />
      <ellipse cx={228} cy={420} rx={11} ry={6} {...boneSoftStyle} />

      {/* TIBIA + FIBULA */}
      <path {...boneStyle} d="M 164 432 L 164 540 L 172 542 L 172 432 Z" />
      <path {...boneStyle} d="M 176 436 L 176 538 L 182 538 L 182 436 Z" />
      <path {...boneStyle} d="M 236 432 L 236 540 L 228 542 L 228 432 Z" />
      <path {...boneStyle} d="M 224 436 L 224 538 L 218 538 L 218 436 Z" />
      {/* Calcaneus / heel */}
      <ellipse cx={170} cy={580} rx={10} ry={9} {...boneStyle} />
      <ellipse cx={230} cy={580} rx={10} ry={9} {...boneStyle} />
      {/* Achilles tendon hint */}
      <line x1={170} y1={548} x2={170} y2={572} stroke="rgba(255,255,255,0.30)" strokeWidth={1.5} strokeLinecap="round" />
      <line x1={230} y1={548} x2={230} y2={572} stroke="rgba(255,255,255,0.30)" strokeWidth={1.5} strokeLinecap="round" />
    </g>
  );
}

function Hand({ cx, cy, flip }: { cx: number; cy: number; flip: boolean }) {
  // Carpals as a small block + 4 metacarpals fanning + thumb to one side
  const dir = flip ? -1 : 1;
  return (
    <g>
      {/* Carpal block */}
      <rect
        x={cx - 8}
        y={cy - 14}
        width={16}
        height={9}
        rx={2}
        {...boneStyle}
      />
      {/* Metacarpals (4 fingers) */}
      {[0, 1, 2, 3].map((i) => {
        const offsetX = (i - 1.5) * 3.5;
        return (
          <g key={`mc${i}`}>
            <line
              x1={cx + offsetX}
              y1={cy - 5}
              x2={cx + offsetX * 1.6}
              y2={cy + 7}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth={2.4}
              strokeLinecap="round"
            />
            {/* Phalanges */}
            <line
              x1={cx + offsetX * 1.6}
              y1={cy + 8}
              x2={cx + offsetX * 1.9}
              y2={cy + 16}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </g>
        );
      })}
      {/* Thumb (lateral) */}
      <line
        x1={cx + dir * 7}
        y1={cy - 4}
        x2={cx + dir * 14}
        y2={cy + 2}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth={2.6}
        strokeLinecap="round"
      />
    </g>
  );
}

function Foot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {/* Tarsals block */}
      <ellipse cx={cx} cy={cy - 4} rx={11} ry={6} {...boneStyle} />
      {/* Metatarsals */}
      {[0, 1, 2, 3, 4].map((i) => {
        const offsetX = (i - 2) * 2.4;
        return (
          <line
            key={`mt${i}`}
            x1={cx + offsetX}
            y1={cy + 2}
            x2={cx + offsetX * 1.4}
            y2={cy + 14}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth={2.2}
            strokeLinecap="round"
          />
        );
      })}
      {/* Phalanges (toes) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const offsetX = (i - 2) * 3;
        return (
          <ellipse
            key={`ph${i}`}
            cx={cx + offsetX}
            cy={cy + 18}
            rx={1.7}
            ry={2.2}
            fill="rgba(245, 244, 240, 0.7)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={0.5}
          />
        );
      })}
    </g>
  );
}
