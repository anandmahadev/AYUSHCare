"use client";

import { motion } from "framer-motion";
import { cn } from "../lib/utils";

interface GradualBlurProps {
    className?: string;
    direction?: "top" | "bottom" | "left" | "right";
    blur?: string;
    duration?: number;
}

export function GradualBlur({
    className,
    direction = "bottom",
    blur = "8px",
    duration = 0.5,
}: GradualBlurProps) {
    const variants = {
        hidden: { filter: "blur(0px)", opacity: 0 },
        visible: { filter: `blur(${blur})`, opacity: 1 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration }}
            className={cn(
                "absolute inset-0 z-0 pointer-events-none",
                {
                    "bg-gradient-to-t from-white to-transparent": direction === "bottom",
                    "bg-gradient-to-b from-white to-transparent": direction === "top",
                    "bg-gradient-to-l from-white to-transparent": direction === "right",
                    "bg-gradient-to-r from-white to-transparent": direction === "left",
                },
                className
            )}
            style={{
                backdropFilter: `blur(${blur})`,
                WebkitBackdropFilter: `blur(${blur})`,
                maskImage: `linear-gradient(to ${direction}, transparent, black)`,
                WebkitMaskImage: `linear-gradient(to ${direction}, transparent, black)`,
            }}
        />
    );
}
