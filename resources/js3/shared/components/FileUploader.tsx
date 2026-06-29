import React from 'react';
import useFileUpload from '@/shared/hooks/useFileUpload';
import formatBytes from "@/shared/utils/formatBytes";

/**
 * FileUploader: A React component that demonstrates the usage of the useFileUpload hook.
 * It allows users to select a file, upload it, and displays the upload progress, status, and response.
 * Includes features like file info display, upload cancellation, and reset.
 */
function FileUploader() {
    // Initialize the useFileUpload hook with the API endpoint and method.
    // Replace '/upload' with your actual API endpoint.
    const {
        uploadFile,
        cancelUpload,
        reset,
        handleFileSelect, // Function to handle file selection
        progress,
        uploadedSize,
        isUploading,
        isSuccess,
        isError,
        responseData,
        error,
        fileName,   // File name from the hook's state
        fileSize,   // File size from the hook's state
        file,       // The file object itself
        targetInput
    } = useFileUpload('/upload', 'POST'); // Specify your upload endpoint and method
    // Handler for the upload button click.
    // It calls the uploadFile function from the hook, passing any additional data if needed.
    const handleUploadClick = () => {
        // Example: You can pass additional form data here if your API expects it.
        // For instance, if you have other input fields for description, tags, etc.
        const additionalData = {
            userId: '12345', // Example additional data
            // description: 'This is a test file upload.'
        };
        uploadFile(file, additionalData); // Pass the file and additional data
    };

    // Determine if the upload button should be disabled.
    // Disabled if a file is not selected or if an upload is already in progress.
    const isUploadDisabled = !fileName || isUploading;
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>File Uploader</h2>

            {/* File Input Section */}
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="fileInput" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Select File:
                </label>
                <input
                    id="fileInput"
                    type="file"
                    onChange={handleFileSelect} // Use the hook's handler for file selection
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: 'calc(100% - 18px)' }}
                    disabled={isUploading} // Disable input during upload
                />
            </div>

            {/* File Information Display */}
            {fileName && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#eef', borderRadius: '4px' }}>
                    <p><strong>File Name:</strong> {fileName}</p>
                    <p><strong>File Size:</strong> {formatBytes(fileSize)}</p>
                </div>
            )}

            {/* Action Buttons Section */}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={handleUploadClick}
                    disabled={isUploadDisabled} // Disable based on selection and upload status
                    style={{
                        padding: '10px 15px',
                        backgroundColor: isUploadDisabled ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isUploadDisabled ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                    }}
                >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                </button>

                {isUploading && (
                    <button
                        onClick={cancelUpload}
                        style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
                    >
                        Cancel Upload
                    </button>
                )}

                <button
                    onClick={()=>{reset();targetInput.value=null}}
                    disabled={!fileName && !isUploading && !isSuccess && !isError} // Enable only if there's something to reset
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Progress Bar */}
            {isUploading && (
                <div style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '5px', marginBottom: '15px' }}>
                    <div
                        style={{
                            width: `${progress}%`,
                            height: '25px',
                            backgroundColor: '#4CAF50',
                            borderRadius: '5px',
                            textAlign: 'center',
                            lineHeight: '25px',
                            color: 'white',
                            transition: 'width 0.3s ease-in-out',
                        }}
                    >
                        {Math.round(progress)}%
                    </div>
                </div>
            )}

            {/* Status Messages (Success, Error, Response) */}
            {isSuccess && responseData && (
                <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px', marginBottom: '15px' }}>
                    <h4>Upload Successful!</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}

            {isError && error && (
                <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px', marginBottom: '15px' }}>
                    <h4>Upload Failed!</h4>
                    <p><strong>Error:</strong> {error.message}</p>
                    {error.status && <p><strong>Status Code:</strong> {error.status}</p>}
                    {error.code && <p><strong>Error Code:</strong> {error.code}</p>}
                    {error.errors && <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(error.errors, null, 2)}</pre>}
                    {error.responseText && <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>Raw response: {error.responseText}</pre>}
                </div>
            )}
        </div>
    );
}

export default FileUploader;
