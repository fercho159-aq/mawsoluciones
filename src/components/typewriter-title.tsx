
"use client";

import { cn } from "@/lib/utils";

interface TypewriterTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
}

const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ text, className }) => {
    const steps = text.length;
    const animationDuration = `${steps * 0.06}s`;

    return (
        <div className={cn("flex justify-center", className)}>
            <h1 
                className="font-headline text-4xl sm:text-5xl font-bold typewriter w-fit"
                style={{
                    animationDuration: `${animationDuration}, 0.75s`,
                    animationTimingFunction: `steps(${steps}, end), step-end`,
                    animationIterationCount: '1, infinite',
                    width: 'auto'
                }}
            >
                {text}
            </h1>
        </div>
    );
};

export default TypewriterTitle;
