'use client';

import { useState, useRef, useCallback } from 'react';
import Button from './Button';
import { useToast } from './Toast';

export default function FileUpload({ 
  onFileSelect, 
  accept = '.pdf,.doc,.docx,.txt,.jpg,.png', 
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  className = '',
  showPreview = true 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState({});
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      addToast(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`, 'error');
      return false;
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!acceptedTypes.includes(fileExtension) && !acceptedTypes.includes('*')) {
      addToast(`File type ${fileExtension} is not accepted`, 'error');
      return false;
    }

    return true;
  };

  const generatePreview = useCallback((file) => {
    if (!showPreview) return Promise.resolve(null);

    if (file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }

    // For PDF files, show a generic preview
    if (file.type === 'application/pdf') {
      return Promise.resolve('/pdf-icon.png');
    }

    return Promise.resolve(null);
  }, [showPreview]);

  const handleFiles = useCallback(async (newFiles) => {
    const validFiles = [];
    const newPreviews = {};

    for (const file of newFiles) {
      if (validateFile(file)) {
        validFiles.push(file);
        const preview = await generatePreview(file);
        if (preview) {
          newPreviews[file.name] = preview;
        }
      }
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
      setFiles(updatedFiles);
      setPreviews(prev => ({ ...prev, ...newPreviews }));
      onFileSelect(updatedFiles);
      addToast(`${validFiles.length} file(s) added successfully`, 'success');
    }
  }, [files, multiple, validateFile, generatePreview, onFileSelect, addToast]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFileSelect(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-black">
              {isDragging ? 'Drop files here' : 'Drop files here or click to browse'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Accepted formats: {accept.replace(/\./g, '')} • Max size: {maxSize / 1024 / 1024}MB
            </p>
          </div>

          <Button onClick={openFileDialog} variant="secondary">
            Choose Files
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-black">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-black rounded-lg">
              <div className="flex items-center space-x-3">
                {previews[file.name] && (
                  <img
                    src={previews[file.name]}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-black">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                onClick={() => removeFile(index)}
                variant="danger"
                size="sm"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
