export function capitalize(str: string): string {
    // Return empty string if input is empty
    if (!str) return "";

    // Capitalize first letter
    return str.charAt(0).toUpperCase() + str.slice(1);
}


const str={
    capitalize
}
export default str
