import React from 'react';

interface TechIconProps {
    component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const TechIcon: React.FC<TechIconProps> = ({ component: Component }) => {
    return (
        <>
            <Component className="size-10" style={{ fill: 'url(#tech-icon-gradient)' }} />
            <svg className="size-0 absolute ">
                <linearGradient id="tech-icon-gradient">
                    <stop offset="0%" stopColor="rgb(110 231 183)" />
                    <stop offset="100%" stopColor="rgb(56 189 248)" />  
                </linearGradient>
            </svg>
        </>
    );
}
