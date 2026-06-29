/**
 * Generate random hex string with desired length.
 */
export function generateHexId(length: number): string {
    if (length <= 0) return "";
    const bytes = new Uint8Array(Math.ceil(length / 2));
    crypto.getRandomValues(bytes);
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, length);
}
