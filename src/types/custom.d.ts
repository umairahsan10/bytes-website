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