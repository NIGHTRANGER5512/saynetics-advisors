import { useRef, type ReactNode } from "react";
import { useScroll, useTransform, motion, useReducedMotion } from "framer-motion";
import { Video, Box, Sofa, MessageSquare, Monitor, ArrowRight } from "lucide-react";

// ─── types ───────────────────────────────────────────────────────────────────
interface ServiceCard {
  id: number | string;
  title: string;
  description: string;
  tag: string;
  src: string;
  link: string;
  color: string;
  iconType: string;
}

interface Props { cards: ServiceCard[] }

// ─── icon resolver ────────────────────────────────────────────────────────────
const getIcon = (type: string): ReactNode => {
  switch (type) {
    case "video":   return <Video         className="w-6 h-6" strokeWidth={1.75} />;
    case "home":    return <Box           className="w-6 h-6" strokeWidth={1.75} />;
    case "staging": return <Sofa         className="w-6 h-6" strokeWidth={1.75} />;
    case "chat":    return <MessageSquare className="w-6 h-6" strokeWidth={1.75} />;
    case "web":     return <Monitor       className="w-6 h-6" strokeWidth={1.75} />;
    default:        return <Video         className="w-6 h-6" strokeWidth={1.75} />;
  }
};

// ─── single card ─────────────────────────────────────────────────────────────
function ServiceCardItem({
  card, index, total, scrollYProgress,
}: {
  card: ServiceCard;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const reduced = useReducedMotion();
  const num     = String(index + 1).padStart(2, "0");

  // Each card occupies its own 1/(total-1) slice of the scroll range.
  // Card 0 is never incoming; card N-1 is never outgoing.
  const segStart = index / total;
  const segEnd   = (index + 1) / total;

  // translateY: incoming from below (100% → 0%) during this card's segment.
  const y = useTransform(
    scrollYProgress,
    [segStart, segEnd],
    index === 0 ? ["0%", "0%"] : ["100%", "0%"],
  );

  // Scale + rotation: outgoing card shrinks during the NEXT segment.
  const nextStart = segEnd;
  const nextEnd   = (index + 2) / total;
  const scale = useTransform(
    scrollYProgress,
    index < total - 1 ? [nextStart, nextEnd] : [1, 1],
    index < total - 1 ? [1, 0.75] : [1, 1],
  );
  const rotate = useTransform(
    scrollYProgress,
    index < total - 1 ? [nextStart, nextEnd] : [1, 1],
    index < total - 1 ? [0, 4] : [0, 0],
  );

  return (
    <motion.div
      className="absolute inset-0 w-full h-full will-change-transform"
      style={reduced ? {} : { y, scale, rotate, transformOrigin: "top center" }}
    >
      <div
        className="group relative flex flex-col md:flex-row w-full h-full overflow-hidden
          rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
        style={{ background: "linear-gradient(135deg, #211c18 0%, #15110e 100%)" }}
      >
        {/* top inner highlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px z-30"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
        />

        {/* ── Content panel ── */}
        <div className="relative z-20 flex flex-col justify-between p-8 sm:p-10 md:w-[56%]">
          {/* watermark number */}
          <span
            aria-hidden
            className="absolute top-6 right-6 font-black leading-none select-none pointer-events-none"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize:   "3.5rem",
              color:      `${card.color}1f`,
            }}
          >
            {num}
          </span>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center ring-1"
              style={{ color: card.color, borderColor: `${card.color}40`, backgroundColor: `${card.color}1a` }}
            >
              {getIcon(card.iconType)}
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full border
                bg-white/5 text-white/75 border-white/10 uppercase tracking-wider"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {card.tag}
            </span>
          </div>

          <div className="flex flex-col gap-3 mt-7">
            <h3
              className="text-white font-bold text-2xl sm:text-[1.75rem] leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.015em" }}
            >
              {card.title}
            </h3>
            <p className="text-white/75 text-[15px] leading-relaxed">{card.description}</p>
          </div>

          <div className="mt-8">
            <a
              href={card.link}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold
                tracking-wider uppercase text-white transition-all duration-300 hover:gap-3"
              style={{
                fontFamily:      "Space Grotesk, sans-serif",
                backgroundColor: card.color,
                boxShadow:       `0 8px 24px ${card.color}40`,
              }}
            >
              Learn more
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── Image panel ── */}
        <div className="relative md:w-[44%] h-44 md:h-auto overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={card.src}
            alt={card.title}
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 md:bg-[linear-gradient(90deg,#1b1714_0%,rgba(27,23,20,0.15)_42%,transparent_100%)]
              bg-[linear-gradient(0deg,#1b1714_0%,transparent_55%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-soft-light"
            style={{ background: card.color, opacity: 0.18 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
// Uses CSS `position: sticky` — zero JS scroll manipulation, no page-lock risk.
// The outer track provides the scroll height; the sticky scene stays in view.
const SkiperServiceStack = ({ cards }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress across the entire track (start → end)
  const { scrollYProgress } = useScroll({
    target:  trackRef,
    offset:  ["start start", "end end"],
  });

  return (
    // Outer track — sets total scroll height for the section (1 vh per card)
    <div
      ref={trackRef}
      style={{ height: `${cards.length * 100}vh` }}
      className="relative"
    >
      {/* Sticky scene — stays fixed in view while the track scrolls past */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 py-8">

        {/* Card stack container */}
        <div className="relative w-full max-w-[960px] h-[480px] sm:h-[420px] md:h-[380px]">
          {cards.map((card, i) => (
            <ServiceCardItem
              key={card.id}
              card={card}
              index={i}
              total={cards.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          {cards.map((card) => (
            <div
              key={card.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { SkiperServiceStack, type ServiceCard };
