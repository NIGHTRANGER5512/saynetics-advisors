import React from "react";
import { useIsCoarsePointer } from "@/lib/utils";

// Types
interface GlassEffectProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  target?: string;
  bgOverlay?: string; // Optional custom background tint
  blurAmount?: string; // Optional custom blur strength
}

interface DockIcon {
  src: string;
  alt: string;
  onClick?: () => void;
}

// Glass Effect Wrapper Component
export const GlassEffect: React.FC<GlassEffectProps> = ({
  children,
  className = "",
  style = {},
  href,
  target = "_blank",
  bgOverlay,
  blurAmount = "20px",
}) => {
  /* Mobile perf: SVG displacement filters on fixed, always-on-screen chips are
     repainted every scroll frame and are slow/buggy on phone GPUs (esp. iOS).
     On coarse pointers we drop the distortion and use a lighter blur. */
  const coarse = useIsCoarsePointer();
  const effectiveBlur = coarse ? "10px" : blurAmount;

  const glassStyle = {
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    ...style,
  };

  const content = (
    <div
      className={`relative flex font-semibold overflow-hidden cursor-pointer transition-all duration-300 ${className}`}
      style={glassStyle}
    >
      {/* Glass Layers */}
      {/* 1. Backdrop refraction (SVG distortion desktop-only) */}
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-inherit"
        style={{
          backdropFilter: `blur(${effectiveBlur}) saturate(180%)`,
          WebkitBackdropFilter: `blur(${effectiveBlur}) saturate(180%)`,
          ...(coarse ? {} : { filter: "url(#glass-distortion)", isolation: "isolate" as const }),
        }}
      />
      {/* 2. Glass Base overlay (semi-transparent tint) */}
      <div
        className="absolute inset-0 z-10 rounded-inherit transition-all duration-500"
        style={{
          background: bgOverlay || "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
        }}
      />
      {/* 3. Outer Edge Highlights / Refraction lines */}
      <div
        className="absolute inset-0 z-20 rounded-inherit overflow-hidden pointer-events-none"
        style={{
          boxShadow:
            "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.15), inset -1px -1px 1px 0 rgba(0, 0, 0, 0.08)",
        }}
      />

      {/* Content */}
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );

  return href ? (
    <a href={href} target={target} rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    content
  );
};

// Dock Component
export const GlassDock: React.FC<{ icons: DockIcon[]; href?: string }> = ({
  icons,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl p-3 hover:p-4 hover:rounded-4xl"
  >
    <div className="flex items-center justify-center gap-2 rounded-3xl p-3 py-0 px-0.5 overflow-hidden">
      {icons.map((icon, index) => (
        <img
          key={index}
          src={icon.src}
          alt={icon.alt}
          className="w-16 h-16 transition-all duration-300 hover:scale-110 cursor-pointer"
          style={{
            transformOrigin: "center center",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={icon.onClick}
        />
      ))}
    </div>
  </GlassEffect>
);

// Button Component
export const GlassButton: React.FC<{ children: React.ReactNode; href?: string }> = ({
  children,
  href,
}) => (
  <GlassEffect
    href={href}
    className="rounded-3xl px-10 py-6 hover:px-11 hover:py-7 hover:rounded-4xl overflow-hidden"
  >
    <div
      className="transition-all duration-300 hover:scale-95"
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  </GlassEffect>
);

// SVG Filter — render once at page root level
export const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }} aria-hidden="true">
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="12"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

// Main demo Component (kept for reference)
export const Component = () => {
  const dockIcons: DockIcon[] = [
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/a13d1acfd046f503f987c1c95af582c8_low_res_Claude.png",
      alt: "Claude",
    },
    {
      src: "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHhPYv8boI1Rc/9e80c50a5802d3b0a7ec66f3fe4ce348_low_res_Finder.png",
      alt: "Finder",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <GlassFilter />
      <GlassDock icons={dockIcons} />
    </div>
  );
};
