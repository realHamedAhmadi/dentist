const BASE_URL =''

/**
 * Makes a request to the API. Supports JSON bodies and FormData for file uploads.
 * @param {string} endpoint - The API endpoint to request.
 * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE'). Defaults to 'GET'.
 * @param {object|FormData|null} body - The request body. Can be a JSON object or a FormData object for file uploads. Defaults to null.
 * @returns {Promise<object>} A promise that resolves with the JSON response data on success.
 * @throws {Error} Throws an error if the request fails due to network issues or server-side errors.
 */
async function request(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('authToken');

    // Prepare headers
    const headers = {
        // 'Content-Type' will be set automatically by the browser for FormData
        // Otherwise, set it to application/json
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers,
            // If body is FormData, it's sent as is. Otherwise, stringify it.
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : null),
        });

        // Try to parse JSON response. If the response is not JSON (e.g., sometimes error responses are plain text)
        // or if the content type is not JSON, this might fail.
        let responseData;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            responseData = await response.json();
        } else {
            // Handle non-JSON responses, maybe it's an error message or a file download
            // For simplicity here, we'll just assume it's an error if not JSON and response.ok is false
            if (!response.ok) {
                // Try to get text if it's not JSON and an error occurred
                const errorText = await response.text();
                console.error('Non-JSON Error Response:', errorText);
                // Create a generic error or use the text if meaningful
                throw new Error(`Server error: ${response.status}. ${errorText || 'Unknown error.'}`);
            }
            // If response is OK but not JSON, what should we return? Depends on API.
            // For now, let's assume successful non-JSON responses are rare for this API
            // or the caller knows how to handle them.
            responseData = { success: true, data: null, message: "Non-JSON response received." }; // Example handling
        }


        // Check if the response is not OK (HTTP status code >= 400)
        // OR if the response indicates a logical error (success: false)
        if (!response.ok || !responseData?.success) {
            const errorData = responseData;
            console.error('API Server Error Response:', errorData);

            const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
            error.code = errorData.code;
            error.errors = errorData.errors;
            error.status = response.status;
            error.isServerError = true;
            throw error;
        }

        // If response is OK and indicates success, return the data
        return responseData;

    } catch (error) {
        console.error('API Request Error:', error);

        // Distinguish between network errors and previously thrown server errors
        if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            const networkError = new Error("Network error: Could not connect to the server. Please check your internet connection.");
            networkError.code = 'NETWORK_ERROR';
            networkError.status = 0;
            networkError.isNetworkError = true;
            throw networkError;
        } else if (!error.isServerError && error.status === undefined) {
            // Handle other unexpected errors that are not server errors
            // and don't have a status code (e.g., JSON parsing error if not handled above)
            const clientError = new Error(error.message || "An unexpected client-side error occurred.");
            clientError.isClientError = true;
            throw clientError;
        }
        // Re-throw server errors or network errors that were already formatted
        throw error;
    }
}

export default request;
