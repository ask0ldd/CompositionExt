import { useEffect, useState } from "react";

type GridType =
  | "thirds"
  | "phi"
  | "center"
  | "spiral"
  | "diagonal"
  | "triangle"
  | "dynamic";

const gridTypes = [
"thirds",
"phi",
"center",
"spiral",
"diagonal",
"triangle",
"dynamic"
] as const;

export function Overlay2() {
    const [gridType, setGridType] = useState<GridType>("thirds");

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
          // ignore when focus is in an input/textarea
          if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') return; 
          if (e.code === 'KeyG') {
            // advance to next grid type
            setGridType((prev) => {
            const idx = gridTypes.indexOf(prev);
            const next = gridTypes[(idx + 1) % gridTypes.length];
            // optionally persist to storage here
            return next;
            });
          }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const opacity = 0.3;
    const stroke = `rgba(255, 0, 0, ${opacity})`;

    return (
        <>
        <div
            style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483646,
            pointerEvents: "none",
            }}
        >
            <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{
                display: "block",
                overflow: "visible",
            }}
            >
            {gridType === "thirds" && (
                <ThirdsGrid stroke={stroke} />
            )}

            {gridType === "phi" && (
                <PhiGrid stroke={stroke} />
            )}

            {gridType === "center" && (
                <CenterGrid stroke={stroke} />
            )}

            {gridType === "spiral" && (
                <GoldenSpiral stroke={stroke} />
            )}

            {gridType === "diagonal" && (
                <DiagonalGrid stroke={stroke} />
            )}

            {gridType === "triangle" && (
                <GoldenTriangle stroke={stroke} />
            )}

            {gridType === "dynamic" && (
                <DynamicSymmetryGrid stroke={stroke} />
            )}
            </svg>
        </div>
        </>
  );
}

type GridProps = {
  stroke: string;
};

const commonLineProps = {
  fill: "none",
  strokeWidth: 0.2,
  vectorEffect: "non-scaling-stroke" as const,
};

// 1. Rule of thirds
function ThirdsGrid({ stroke }: GridProps) {
  return (
    <g stroke={stroke} {...commonLineProps}>
      <line x1="33.333" y1="0" x2="33.333" y2="100" />
      <line x1="66.667" y1="0" x2="66.667" y2="100" />

      <line x1="0" y1="33.333" x2="100" y2="33.333" />
      <line x1="0" y1="66.667" x2="100" y2="66.667" />
    </g>
  );
}

// 2. Phi grid / golden-ratio grid
function PhiGrid({ stroke }: GridProps) {
  return (
    <g stroke={stroke} {...commonLineProps}>
      <line x1="38.2" y1="0" x2="38.2" y2="100" />
      <line x1="61.8" y1="0" x2="61.8" y2="100" />

      <line x1="0" y1="38.2" x2="100" y2="38.2" />
      <line x1="0" y1="61.8" x2="100" y2="61.8" />
    </g>
  );
}

// 3. Center framing and symmetry axes
function CenterGrid({ stroke }: GridProps) {
  return (
    <g stroke={stroke} {...commonLineProps}>
      <line x1="50" y1="0" x2="50" y2="100" />
      <line x1="0" y1="50" x2="100" y2="50" />

      {/* Inner symmetry guides */}
      <line x1="25" y1="0" x2="25" y2="100" opacity="0.5" />
      <line x1="75" y1="0" x2="75" y2="100" opacity="0.5" />
      <line x1="0" y1="25" x2="100" y2="25" opacity="0.5" />
      <line x1="0" y1="75" x2="100" y2="75" opacity="0.5" />
    </g>
  );
}

// 4. Golden spiral approximation
function GoldenSpiral({ stroke }: GridProps) {
  return (
    <g
      fill="none"
      stroke={stroke}
      strokeWidth="0.35"
      vectorEffect="non-scaling-stroke"
    >
      {/* Golden rectangles */}
      <rect x="0" y="0" width="61.8" height="100" opacity="0.25" />
      <rect x="61.8" y="0" width="38.2" height="61.8" opacity="0.25" />
      <rect x="61.8" y="61.8" width="23.6" height="38.2" opacity="0.25" />
      <rect x="85.4" y="61.8" width="14.6" height="23.6" opacity="0.25" />

      {/* Approximate Fibonacci / golden spiral */}
      <path
        d="
          M 100 61.8
          A 38.2 38.2 0 0 1 61.8 100
          A 23.6 23.6 0 0 1 38.2 76.4
          A 14.6 14.6 0 0 1 52.8 61.8
          A 9 9 0 0 1 61.8 70.8
          A 5.6 5.6 0 0 1 56.2 76.4
          A 3.4 3.4 0 0 1 52.8 73
          A 2.1 2.1 0 0 1 54.9 70.9
        "
      />
    </g>
  );
}

// 5. Diagonal grid
function DiagonalGrid({ stroke }: GridProps) {
  return (
    <g stroke={stroke} {...commonLineProps}>
      <line x1="0" y1="0" x2="100" y2="100" />
      <line x1="100" y1="0" x2="0" y2="100" />

      <line x1="0" y1="50" x2="100" y2="0" opacity="0.65" />
      <line x1="0" y1="100" x2="100" y2="50" opacity="0.65" />

      <line x1="0" y1="0" x2="50" y2="100" opacity="0.65" />
      <line x1="50" y1="0" x2="100" y2="100" opacity="0.65" />
    </g>
  );
}

// 6. Golden triangle
function GoldenTriangle({ stroke }: GridProps) {
  return (
    <g stroke={stroke} {...commonLineProps}>
      {/* Main diagonal */}
      <line x1="0" y1="100" x2="100" y2="0" />

      {/* Perpendicular guide from opposite corners */}
      <line x1="0" y1="0" x2="61.8" y2="61.8" />
      <line x1="100" y1="100" x2="38.2" y2="38.2" />

      {/* Secondary triangular divisions */}
      <line x1="0" y1="100" x2="38.2" y2="38.2" opacity="0.65" />
      <line x1="100" y1="0" x2="61.8" y2="61.8" opacity="0.65" />
    </g>
  );
}

// 7. Dynamic symmetry
function DynamicSymmetryGrid({ stroke }: GridProps) {
  return (
    <g stroke={stroke} {...commonLineProps}>
      {/* Main diagonals */}
      <line x1="0" y1="0" x2="100" y2="100" />
      <line x1="100" y1="0" x2="0" y2="100" />

      {/* Dynamic-symmetry vertical divisions */}
      <line x1="38.2" y1="0" x2="38.2" y2="100" />
      <line x1="61.8" y1="0" x2="61.8" y2="100" />

      {/* Dynamic-symmetry horizontal divisions */}
      <line x1="0" y1="38.2" x2="100" y2="38.2" />
      <line x1="0" y1="61.8" x2="100" y2="61.8" />

      {/* Secondary diagonals */}
      <line x1="0" y1="38.2" x2="61.8" y2="100" opacity="0.65" />
      <line x1="38.2" y1="0" x2="100" y2="61.8" opacity="0.65" />
      <line x1="61.8" y1="0" x2="0" y2="61.8" opacity="0.65" />
      <line x1="100" y1="38.2" x2="38.2" y2="100" opacity="0.65" />
    </g>
  );
}