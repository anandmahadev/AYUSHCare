import { cn } from "@/lib/utils";

interface GradualBlurProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: "top" | "bottom" | "left" | "right";
    maxBlur?: number;
    layers?: number;
    className?: string;
    duration?: number;
}

export function GradualBlur({
    direction = "bottom",
    maxBlur = 8,
    layers = 8,
    className,
    duration = 0,
    style,
    ...props
}: GradualBlurProps) {
    // Generate gradient direction for CSS
    const getGradientDirection = (dir: string) => {
        switch (dir) {
            case "top":
                return "to top";
            case "bottom":
                return "to bottom";
            case "left":
                return "to left";
            case "right":
                return "to right";
            default:
                return "to bottom";
        }
    };

    const gradientDirection = getGradientDirection(direction);

    // Generate masks and blur values for layers
    // Based on the progressive blur technique
    const layerData = Array.from({ length: layers }, (_, i) => {
        const progress = i / (layers - 1); // 0 to 1
        const blurAmount = progress * maxBlur;

        // Calculate smooth stops
        // We want the mask to reveal this blur layer gradually
        // Each layer covers a bit more or starts a bit later?
        // Standard approach:
        // Layer 0: Blur 0. Not needed if we overlay on content, but here we are modifying the "view" of content below?
        // Actually, usually this component is an OVERLAY on top of content to obscure it.
        // So distinct layers with backdrop-filter.

        const start = (i / layers) * 100;
        const end = ((i + 1) / layers) * 100;

        // To minimize banding, we can make gradients overlap or be simpler:
        // Layer i has blur B_i.
        // Mask: linear-gradient(to dir, transparent Start%, black End%)
        // But this would stack opacity.
        // 
        // Simpler efficient approch:
        // Use backdrop-filter: blur() with mask-image.

        // Ref: Progressive Blur often uses:
        // z-index: i
        // backdrop-filter: blur(Xpx)
        // mask-image: linear-gradient(...)

        // Let's use a non-linear distribution for smoother look
        const val = i;
        const percentage = ((val + 1) / layers) * 100;
        const prevPercentage = (val / layers) * 100;

        return {
            blur: blurAmount,
            // We want the filter to apply increasingly.
            // Layer N is heavily blurred. We want it fully visible at the "blurred" end, and invisible at the "sharp" end.
            // And we want the transition to be controlled.
            // Standard Mask:
            // black at 0% (transparent), black at 100% (opaque).
            // wait, mask-image: black = visible.
            // So if "transparent" -> "black", it means "invisible" -> "visible".
            // At "sharp" end (e.g. top), we want NO blur layers visible.
            // At "blurred" end (e.g. bottom), we want ALL (Max) blur layers visible.

            // Layer i (blur slightly) should be visible earlier.
            // Layer N (blur heavy) should be visible only at the very end.

            // Let's try:
            // Layer i mask: linear-gradient(dir, transparent 0%, transparent Start%, black End%, black 100%)
            mask: `linear-gradient(${gradientDirection}, transparent ${Math.max(0, start - 15)}%, black ${Math.min(100, end + 15)}%)`
        };
    });

    return (
        <div
            className={cn("absolute inset-0 pointer-events-none select-none", className)}
            style={style}
            aria-hidden="true"
            {...props}
        >
            {layerData.map((layer, i) => (
                <div
                    key={i}
                    className="absolute inset-0 h-full w-full"
                    style={{
                        backdropFilter: `blur(${layer.blur}px)`,
                        WebkitBackdropFilter: `blur(${layer.blur}px)`,
                        maskImage: layer.mask,
                        WebkitMaskImage: layer.mask,
                        zIndex: i + 1,
                    }}
                />
            ))}
            {/* Optional: Add a gradient for fading content out if needed, but this is just blur */}
        </div>
    );
}
