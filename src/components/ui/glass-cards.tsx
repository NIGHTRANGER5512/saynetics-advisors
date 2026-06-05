import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cardData } from '../../lib/utils';
import { Video, BarChart3, Home, MessageSquare, Monitor, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CardProps {
    id: number;
    title: string;
    description: string;
    index: number;
    totalCards: number;
    color: string;
    iconType: string;
    tag: string;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'video':
            return <Video className="w-6 h-6" />;
        case 'chart':
            return <BarChart3 className="w-6 h-6" />;
        case 'home':
            return <Home className="w-6 h-6" />;
        case 'chat':
            return <MessageSquare className="w-6 h-6" />;
        case 'web':
            return <Monitor className="w-6 h-6" />;
        default:
            return <Video className="w-6 h-6" />;
    }
};

const Card: React.FC<CardProps> = ({ title, description, index, totalCards, color, iconType, tag }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        const container = containerRef.current;
        if (!card || !container) return;

        const targetScale = 1 - (totalCards - index) * 0.04;

        // Set initial state
        gsap.set(card, {
            scale: 1,
            transformOrigin: "center top"
        });

        // Create scroll trigger for stacking effect
        const trigger = ScrollTrigger.create({
            trigger: container,
            start: "top center",
            end: "bottom center",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const scale = gsap.utils.interpolate(1, targetScale, progress);

                gsap.set(card, {
                    scale: Math.max(scale, targetScale),
                    transformOrigin: "center top"
                });
            }
        });

        return () => {
            trigger.kill();
        };
    }, [index, totalCards]);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'sticky',
                top: 0
            }}
        >
            <div
                ref={cardRef}
                style={{
                    position: 'relative',
                    width: '90%',
                    maxWidth: '850px',
                    height: '450px',
                    borderRadius: '24px',
                    isolation: 'isolate',
                    top: `calc(-5vh + ${index * 25}px)`,
                    transformOrigin: 'top'
                }}
                className="card-content animate-glow"
            >
                {/* Electric Border Effect */}
                <div
                    style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: '26px',
                        padding: '2px',
                        background: `conic-gradient(
                            from 0deg,
                            transparent 0deg,
                            ${color} 60deg,
                            ${color.replace('0.8', '0.6')} 120deg,
                            transparent 180deg,
                            ${color.replace('0.8', '0.4')} 240deg,
                            transparent 360deg
                        )`,
                        zIndex: -1
                    }}
                />

                {/* Main Card Content */}
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRadius: '24px',
                    background: `
                        linear-gradient(145deg, 
                            rgba(15, 14, 13, 0.9), 
                            rgba(25, 23, 21, 0.95)
                        )
                    `,
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: `
                        0 20px 50px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    overflow: 'hidden',
                    padding: '2.5rem'
                }}>
                    {/* Enhanced Glass reflection overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 50%, transparent 100%)',
                        pointerEvents: 'none',
                        borderRadius: '24px 24px 0 0'
                    }} />

                    {/* Glass shine effect */}
                    <div style={{
                        position: 'absolute',
                        top: '1px',
                        left: '20px',
                        right: '20px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
                        pointerEvents: 'none'
                    }} />

                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-start justify-between w-full z-10">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-burnt-500/10 text-burnt-400 ring-1 ring-burnt-500/15"
                          style={{ 
                            color: color.replace('0.8', '1.0'),
                            borderColor: color.replace('0.8', '0.2'),
                            backgroundColor: color.replace('0.8', '0.08')
                          }}
                        >
                            {getIcon(iconType)}
                        </div>
                        <span
                            className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-white/5 text-white/70 border-white/10"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                            {tag}
                        </span>
                    </div>

                    {/* Center Content: Title + Description */}
                    <div className="flex flex-col gap-4 z-10">
                        <h3
                            className="text-white font-bold text-2xl sm:text-3xl"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                letterSpacing: '-0.01em',
                            }}
                        >
                            {title}
                        </h3>
                        <p 
                          className="text-white/60 text-base sm:text-lg leading-relaxed max-w-[680px]"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {description}
                        </p>
                    </div>

                    {/* Bottom Row: CTA Link */}
                    <div className="z-10">
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:gap-2.5 text-burnt-400 hover:text-burnt-300"
                            style={{ 
                              fontFamily: 'Space Grotesk, sans-serif', 
                              color: color.replace('0.8', '1.0') 
                            }}
                        >
                            Learn more
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Frosted glass texture */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `
                            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 1px, transparent 2px),
                            radial-gradient(circle at 80% 70%, rgba(255,255,255,0.02) 1px, transparent 2px),
                            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.02) 1px, transparent 2px)
                        `,
                        backgroundSize: '35px 35px, 28px 28px, 40px 40px',
                        pointerEvents: 'none',
                        borderRadius: '24px',
                        opacity: 0.6
                    }} />
                </div>
            </div>
        </div>
    );
};

export const StackedCards: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.fromTo(container,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.2,
                ease: "power2.out"
            }
        );
    }, []);

    return (
        <section ref={containerRef} className="w-full relative z-10">
            {/* Cards List */}
            <div className="w-full">
                {cardData.map((card, index) => (
                    <Card
                        key={card.id}
                        id={card.id}
                        title={card.title}
                        description={card.description}
                        index={index}
                        totalCards={cardData.length}
                        color={card.color}
                        iconType={card.iconType}
                        tag={card.tag}
                    />
                ))}
            </div>
        </section>
    );
};
