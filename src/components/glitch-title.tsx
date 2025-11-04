
"use client";

import { cn } from "@/lib/utils";

interface GlitchTitleProps extends React.HTMLAttributes<HTMLDivElement> {
    text: string;
}

const GlitchTitle: React.FC<GlitchTitleProps> = ({ text, className }) => {
    return (
        <div className={cn("flex justify-center", className)}>
            <h1 
                className="font-headline text-4xl sm:text-5xl font-bold glitch"
                data-text={text}
            >
                {text}
            </h1>
        </div>
    );
};

export default GlitchTitle;
