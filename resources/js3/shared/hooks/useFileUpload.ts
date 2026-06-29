import { useState, useCallback, useRef } from 'react';

// Assuming BASE_URL and token are accessible from somewhere (e.g., context or global config)
const BASE_URL = window.APP_CONFIG.BASE_URL; // Replace with your actual API base URL

/**
 * A custom React hook for managing file uploads with progress tracking
 * and file information.
 *
 * @param {string} endpoint - The API endpoint for uploads (e.g., '/upload').
 * @param {string} method - The HTTP method (e.g., 'POST', 'PUT'). Defaults to 'POST'.
 * @returns {object} - An object containing:
 *   - uploadFile: Function to initiate the file upload.
 *   - cancelUpload: Function to cancel the ongoing upload.
 *   - reset: Function to reset the upload state.
 *   - handleFileSelect: Function to handle file selection from an input element.
 *   - progress: The upload progress percentage (0-100).
 *   - uploadedSize: The size of the uploaded file (in bytes).
 *   - isUploading: Boolean, true if the upload is in progress.
 *   - isSuccess: Boolean, true if the upload was successful.
 *   - isError: Boolean, true if an error occurred.
 *   - responseData: The successful response data from the server.
 *   - error: The error object if something went wrong.
 *   - fileName: The name of the selected file.
 *   - fileSize: The size of the selected file (in bytes).
 *   - file: The selected file object itself (if direct access is needed).
 *   - targetInput: The input element used to select a file
 */
function useFileUpload(endpoint, method = 'POST') {
    const [progress, setProgress] = useState(0);
    const [uploadedSize, setUploadedSize] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    // New states for storing file information
    const [fileName, setFileName] = useState(null);
    const [fileSize, setFileSize] = useState(null);
    const [file, setFile] = useState(null); // The file object
    const [targetInput,setTargetInput] = useState(null)

    // Ref to hold the XMLHttpRequest object for cancellation
    const uploadRequestRef = useRef(null);

    // Callback to update file info states
    const setFileInfo = useCallback((selectedFile) => {
        if (selectedFile) {
            setFileName(selectedFile.name);
            setFileSize(selectedFile.size);
            setFile(selectedFile);
        } else {
            setFileName(null);
            setFileSize(null);
            setFile(null);
        }
    }, []);

    /**
     * Initiates the file upload process.
     * @param {File | null} fileToUpload - The file to upload. If null, uses the file already stored in the hook's state.
     * @param {object} [additionalData={}] - Additional data to send with the form.
     */
    const uploadFile = useCallback(async (fileToUpload, additionalData = {}) => {
        // Use the provided file or the one from the hook's state
        const targetFile = fileToUpload || file;

        if (!targetFile) {
            console.error('No file provided for upload.');
            setError(new Error('No file provided.'));
            setIsError(true);
            return;
        }

        // Update file state if a file is explicitly passed, or if it's the first time setting it
        if(fileToUpload) {
            setFileInfo(fileToUpload);
        } else if (!file) {
            // This case should ideally not happen if file selection is handled correctly
            console.error('No file selected or provided.');
            setError(new Error('No file selected or provided.'));
            setIsError(true);
            return;
        }

        // Reset states before starting new upload
        setIsUploading(true);
        setIsSuccess(false);
        setIsError(false);
        setResponseData(null);
        setError(null);
        setProgress(0);
        setUploadedSize(0);

        const formData = new FormData();
        // The 'file' field name must match what the backend expects
        formData.append('file', targetFile, targetFile.name);

        // Append additional data
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        // Retrieve auth token (adjust retrieval method as needed)
        const token = localStorage.getItem('authToken');

        const xhr = new XMLHttpRequest();
        uploadRequestRef.current = xhr; // Store XHR object for potential cancellation

        // Progress listener for upload progress
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadedSize(event.loaded)
                setProgress(percentComplete);
            }
        });

        // Load listener for completion
        xhr.addEventListener('load', () => {
            uploadRequestRef.current = null; // Clear the ref
            if (xhr.status >= 200 && xhr.status < 300) {
                // Success
                try {
                    const response = JSON.parse(xhr.responseText);
                    setResponseData(response);
                    setIsSuccess(true);
                    setIsUploading(false);
                    setProgress(100); // Ensure progress bar reaches 100%
                    setUploadedSize(fileSize);
                } catch (e) {
                    // Handle JSON parsing error
                    const parseError = new Error(`Failed to parse response JSON. Status: ${xhr.status}, Response: ${xhr.responseText}`);
                    setError(parseError);
                    setIsError(true);
                    setIsUploading(false);
                }
            } else {
                // Handle HTTP errors (non-2xx status codes)
                let errorData = { message: `HTTP error! status: ${xhr.status}` };
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorData = { ...errorData, ...errorResponse };
                } catch (e) {
                    errorData.responseText = xhr.responseText; // Include raw response if not JSON
                }
                console.error('Upload Error Response:', errorData);
                const httpError = new Error(errorData.message || `Upload failed with status: ${xhr.status}`);
                httpError.status = xhr.status; // Attach status code
                httpError.code = errorData.code; // Attach custom error code if available
                httpError.errors = errorData.errors; // Attach detailed errors if available
                setError(httpError);
                setIsError(true);
                setIsUploading(false);
            }
        });

        // Error listener for network errors
        xhr.addEventListener('error', () => {
            uploadRequestRef.current = null; // Clear the ref
            const networkError = new Error('Network error occurred during upload.');
            setError(networkError);
            setIsError(true);
            setIsUploading(false);
        });

        // Abort listener for cancelled uploads
        xhr.addEventListener('abort', () => {
            uploadRequestRef.current = null; // Clear the ref
            const abortError = new Error('Upload aborted.');
            setError(abortError);
            setIsError(true);
            setIsUploading(false);
            setProgress(0); // Reset progress on abort
            setUploadedSize(0);
        });

        // Configure and send the request
        xhr.open(method, `${BASE_URL}${endpoint}`, true);

        // Set Authorization header if token exists
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.send(formData);

    }, [endpoint, method, file, setFileInfo]); // Dependencies for useCallback

    /**
     * Cancels the ongoing upload request if one exists.
     */
    const cancelUpload = useCallback(() => {
        if (uploadRequestRef.current) {
            uploadRequestRef.current.abort();
            // The 'abort' event listener will handle state updates
        }
    }, []);

    /**
     * Resets all upload-related states to their initial values.
     * Also cancels any ongoing upload.
     */
    const reset = useCallback(() => {
        setProgress(0);
        setUploadedSize(0);
        setIsUploading(false);
        setIsSuccess(false);
        setIsError(false);
        setResponseData(null);
        setError(null);
        setFileName(null);   // Reset file name
        setFileSize(null);   // Reset file size
        setFile(null);       // Reset file object
        setTargetInput(null)

        // Abort upload if it's in progress
        if (uploadRequestRef.current) {
            uploadRequestRef.current.abort();
            uploadRequestRef.current = null;
        }
    }, []);

    /**
     * Handles the file selection event from an <input type="file"> element.
     * Updates file state and resets upload status.
     * @param {Event} event - The change event from the file input.
     */
    const handleFileSelect = useCallback((event) => {
        setTargetInput(event.target)
        const selectedFile = event.target.files && event.target.files[0];
        setFileInfo(selectedFile);
    }, [setFileInfo]);

    return {
        uploadFile,
        cancelUpload,
        reset,
        handleFileSelect, // Expose file selection handler
        progress,
        uploadedSize,
        isUploading,
        isSuccess,
        isError,
        responseData,
        error,
        fileName,   // Expose file name state
        fileSize,   // Expose file size state
        file,       // Expose file object state
        targetInput, // Expose target input state
    };
}

export default useFileUpload;
