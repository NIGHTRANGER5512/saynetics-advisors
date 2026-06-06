"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { useRef, type ReactNode } from "react";
import { Video, Box, Sofa, MessageSquare, Monitor, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── types ──────────────────────────────────────────────────────────────────
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

// ─── icon resolver ───────────────────────────────────────────────────────────
const getIcon = (type: string): ReactNode => {
  switch (type) {
    case "video":   return <Video   className="w-6 h-6" strokeWidth={1.75} />;
    case "home":    return <Box     className="w-6 h-6" strokeWidth={1.75} />;
    case "staging": return <Sofa   className="w-6 h-6" strokeWidth={1.75} />;
    case "chat":    return <MessageSquare className="w-6 h-6" strokeWidth={1.75} />;
    case "web":     return <Monitor className="w-6 h-6" strokeWidth={1.75} />;
    default:        return <Video   className="w-6 h-6" strokeWidth={1.75} />;
  }
};

// ─── main component ──────────────────────────────────────────────────────────
interface StickyServiceCardsProps {
  cards: ServiceCard[];
}

const StickyServiceCards = ({ cards }: StickyServiceCardsProps) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cardEls  = cardRefs.current;
      const total    = cardEls.length;

      if (!cardEls[0]) return;

      // initial positions
      gsap.set(cardEls[0], { y: "0%", scale: 1, rotation: 0, opacity: 1 });
      for (let i = 1; i < total; i++) {
        if (!cardEls[i]) continue;
        gsap.set(cardEls[i], { y: "105%", scale: 1, rotation: 0, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".skiper-sticky-scene",
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          pin: true,
          scrub: 0.6,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < total - 1; i++) {
        const cur  = cardEls[i];
        const next = cardEls[i + 1];
        if (!cur || !next) continue;

        // outgoing card: shrink + rotate (skiper signature)
        tl.to(cur,  { scale: 0.72, rotation: 4, duration: 1, ease: "none" }, i);
        // incoming card: slide in from below
        tl.to(next, { y: "0%",    duration: 1, ease: "none" },               i);
      }

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) ro.observe(container.current);

      return () => {
        ro.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: container },
  );

  return (
    <div ref={container} className="relative h-full w-full">
      {/* The sticky scene — pinned by ScrollTrigger */}
      <div
        className="skiper-sticky-scene relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-8"
      >
        {/* card stack — all absolutely positioned so they overlap */}
        <div className="relative w-full max-w-[960px] h-[480px] sm:h-[400px] md:h-[380px]">
          {cards.map((card, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={card.id}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="absolute inset-0 w-full h-full"
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
                        fontSize: "3.5rem",
                        color: `${card.color}1f`,
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
                          fontFamily: "Space Grotesk, sans-serif",
                          backgroundColor: card.color,
                          boxShadow: `0 8px 24px ${card.color}40`,
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
                    {/* gradient blend */}
                    <div
                      aria-hidden
                      className="absolute inset-0 md:bg-[linear-gradient(90deg,#1b1714_0%,rgba(27,23,20,0.15)_42%,transparent_100%)]
                        bg-[linear-gradient(0deg,#1b1714_0%,transparent_55%)]"
                    />
                    {/* warm accent wash */}
                    <div
                      aria-hidden
                      className="absolute inset-0 mix-blend-soft-light"
                      style={{ background: card.color, opacity: 0.18 }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* progress dots */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i === 0 ? card.color : "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── wrapper with Lenis smooth scroll ────────────────────────────────────────
const SkiperServiceStack = ({ cards }: StickyServiceCardsProps) => (
  <ReactLenis root options={{ lerp: 0.08, duration: 1.2 }}>
    <StickyServiceCards cards={cards} />
  </ReactLenis>
);

export { SkiperServiceStack, StickyServiceCards, type ServiceCard };
