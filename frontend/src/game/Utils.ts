export function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
}
export function degToRad(d: number) {
    return d * (Math.PI / 180);
}
export function radToDeg(r: number) {
    return r * (180 / Math.PI);
}

// Mulberry32 seeded PRNG
export function createSeededRandom(seed: number): () => number {
    return function () {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
