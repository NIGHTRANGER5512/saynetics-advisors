import { type FC, type ReactNode, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { Video, Box, Sofa, MessageSquare, Monitor, ArrowRight } from "lucide-react";

// Types
interface iCardItem {
	title: string;
	description: string;
	tag: string;
	src: string;
	link: string;
	color: string;
	textColor: string;
	iconType: string;
}

interface iCardProps extends Omit<iCardItem, "src"> {
	i: number;
	src: string;
	total: number;
	progress: MotionValue<number>;
}

const getIcon = (type: string): ReactNode => {
    switch (type) {
        case 'video':   return <Video className="w-6 h-6" strokeWidth={1.75} />;
        case 'home':    return <Box className="w-6 h-6" strokeWidth={1.75} />;
        case 'staging': return <Sofa className="w-6 h-6" strokeWidth={1.75} />;
        case 'chat':    return <MessageSquare className="w-6 h-6" strokeWidth={1.75} />;
        case 'web':     return <Monitor className="w-6 h-6" strokeWidth={1.75} />;
        default:        return <Video className="w-6 h-6" strokeWidth={1.75} />;
    }
};

// Components
const Card: FC<iCardProps> = ({
	title,
	description,
	color,
	i,
	src,
    tag,
    link,
    iconType,
    total,
    progress,
}) => {
	const num = String(i + 1).padStart(2, "0")
	const reduce = useReducedMotion()
	// As later cards stack on top, this card scales down a touch (deck depth).
	// Scroll-linked so it reverses seamlessly when scrolling back up.
	const targetScale = 1 - (total - 1 - i) * 0.045
	const scale = useTransform(progress, [i / total, 1], [1, targetScale])

	return (
		<div className="h-screen flex items-center justify-center sticky top-0 px-4">
			<motion.div
				className="group relative flex flex-col md:flex-row w-[92%] max-w-[960px] overflow-hidden
                rounded-2xl border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] origin-top"
				style={{
                    top: `calc(-6vh + ${i * 26}px)`,
                    scale: reduce ? undefined : scale,
                    background: "linear-gradient(135deg, #211c18 0%, #15110e 100%)",
                }}
			>
                {/* top inner highlight */}
                <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px z-30"
                     style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }} />

                {/* ── Content panel ── */}
                <div className="relative z-20 flex flex-col justify-between p-8 sm:p-10 md:w-[56%]">
                    {/* big watermark number */}
                    <span aria-hidden className="absolute top-6 right-6 font-black leading-none select-none"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "3.5rem", color: `${color}1f` }}>
                        {num}
                    </span>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center ring-1"
                             style={{ color, borderColor: `${color}40`, backgroundColor: `${color}1a` }}>
                            {getIcon(iconType)}
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-white/5 text-white/75 border-white/10 uppercase tracking-wider"
                              style={{ fontFamily: "JetBrains Mono, monospace" }}>
                            {tag}
                        </span>
                    </div>

                    <div className="flex flex-col gap-3 mt-7">
                        <h3 className="text-white font-bold text-2xl sm:text-[1.75rem] leading-tight"
                            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.015em" }}>
                            {title}
                        </h3>
                        <p className="text-white/75 text-[15px] leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="mt-8">
                        <a href={link}
                           className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:gap-3"
                           style={{ fontFamily: "Space Grotesk, sans-serif", backgroundColor: color, boxShadow: `0 8px 24px ${color}40` }}>
                            Learn more
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* ── Image panel (real, full colour) ── */}
                <div className="relative md:w-[44%] h-44 md:h-auto overflow-hidden">
                    <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={src}
                        alt={title}
                        loading="lazy"
                    />
                    {/* blend the image seam into the content panel */}
                    <div aria-hidden className="absolute inset-0 md:bg-[linear-gradient(90deg,#1b1714_0%,rgba(27,23,20,0.15)_42%,transparent_100%)] bg-[linear-gradient(0deg,#1b1714_0%,transparent_55%)]" />
                    {/* subtle warm accent wash */}
                    <div aria-hidden className="absolute inset-0 mix-blend-soft-light" style={{ background: color, opacity: 0.18 }} />
                </div>
			</motion.div>
		</div>
	);
};

/**
 * CardSlide component displays a series of cards in a vertical scroll layout
 * Each card contains a title, description, and decorative elements
 */
interface iCardSlideProps {
	items: iCardItem[];
}

const CardsParallax: FC<iCardSlideProps> = ({items}) => {
	const container = useRef<HTMLDivElement>(null)
	// scroll progress across the whole stack track (drives the scrubbed scaling)
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ["start start", "end end"],
	})
	return (
		<div ref={container} className="relative w-full">
			{items.map((project, i) => (
				<Card
					key={`p_${i}`}
					{...project}
					i={i}
					total={items.length}
					progress={scrollYProgress}
				/>
			))}
		</div>
	);
};

export {CardsParallax, type iCardItem};
