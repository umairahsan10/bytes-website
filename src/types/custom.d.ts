declare module '*.png' {
    const content: any;
    export default content;
}

declare module '*.jpg' {
    const content: any;
    export default content;
}

declare module '*.svg' {
    const content: any;
    export default content;
}

declare global {
    interface Window {
        lenis?: any;
    }
}

declare module '@splinetool/runtime' {
  export class Application {
    constructor(canvas: HTMLCanvasElement);
    load(url: string): Promise<void>;
    dispose?(): void;
  }
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.mp3" {
  const src: string;
  export default src;
}

// Declaration for Spline React component when used in Next.js
// This prevents TypeScript errors when importing from '@splinetool/react-spline/next'.
declare module '@splinetool/react-spline/next' {
  import { ComponentType } from 'react';
  const Spline: ComponentType<{ scene: string; className?: string }>;
  export default Spline;
} 