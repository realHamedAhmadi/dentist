/**
 * Helper function to format file size in bytes to a human-readable string.
 * For example, 1024 bytes becomes "1 KB", 1572864 bytes becomes "1.5 MB".
 * @param {number} bytes - The file size in bytes.
 * @param {number} decimals - Number of decimal places to display. Defaults to 2.
 * @returns {string} - The formatted file size string.
 */
export default function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
