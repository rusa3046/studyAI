import React, { useState } from 'react';
import axios from 'axios';

const UploadDocument = ({ apiUrl, setOutput }) => {
    const [documentTitle, setDocumentTitle] = useState('');
    const [documentFile, setDocumentFile] = useState(null);
    const [folderName, setFolderName] = useState('');

    const handleUpload = async () => {
        if (!documentTitle || !documentFile || !folderName) {
            alert('Please fill in all fields');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const base64File = reader.result.split(',')[1];
            const fileType = documentFile.type || 'application/octet-stream';
            const fileName = documentFile.name;

            try {
                const response = await axios.post(`${apiUrl}/uploadDocument`, {
                    documentTitle,
                    documentContent: base64File,
                    fileType,
                    fileName,
                    folderName
                });

                setOutput(response.data.message);
            } catch (error) {
                setOutput('Error uploading document');
            }
        };
        reader.readAsDataURL(documentFile);
    };

    return (
        <div>
            <h2>Upload Document</h2>
            <input type="text" value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} placeholder="Document Title" />
            <input type="file" onChange={(e) => setDocumentFile(e.target.files[0])} />
            <input type="text" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Folder Name" />
            <button onClick={handleUpload}>Upload Document</button>
        </div>
    );
};

export default UploadDocument;
