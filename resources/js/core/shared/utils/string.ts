export function capitalize(str: string): string {
    // Return empty string if input is empty
    if (!str) return "";

    // Capitalize first letter
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculates a numeric value based on the alphabetical position of characters (a=1, z=26).
 */
export function alphabetSum(str: string): number {
    let sum = 0;
    const lowerStr = str.toLowerCase();

    for (let i = 0; i < lowerStr.length; i++) {
        const code = lowerStr.charCodeAt(i);
        // Only consider a-z
        if (code >= 97 && code <= 122) {
            sum += (code - 96);
        }
    }
    return sum;
}


const str={
    capitalize, alphabetSum
}
export default str
