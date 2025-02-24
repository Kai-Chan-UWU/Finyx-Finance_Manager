'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const OCRProcessor = ({ onClose }) => {
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tesseract, setTesseract] = useState(null);

  // Initialize Tesseract lazily
  useEffect(() => {
    const initTesseract = async () => {
      try {
        const { createWorker } = await import('tesseract.js');
        setTesseract({ createWorker });
      } catch (err) {
        console.error('Failed to initialize Tesseract:', err);
        setError('Failed to initialize OCR system');
      }
    };

    initTesseract();
  }, []);

  const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set dimensions
          canvas.width = image.width;
          canvas.height = image.height;
          
          // Optional: Add white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw image
          ctx.drawImage(image, 0, 0);
          
          // Get data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          resolve(dataUrl);
        };
        
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = reader.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedText('');
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: false
  });

  const processImage = async () => {
    if (!selectedFile || !tesseract) {
      setError('Please select an image file first');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Create worker
      const worker = await tesseract.createWorker({
        logger: progress => {
          console.log('OCR Progress:', progress);
        }
      });

      // Initialize worker
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      // Preprocess image
      const processedImage = await preprocessImage(selectedFile);

      // Perform OCR
      const { data: { text } } = await worker.recognize(processedImage);

      // Cleanup
      await worker.terminate();

      if (text) {
        setExtractedText(text.trim());
      } else {
        setError('No text was extracted from the image');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError(`Failed to process image: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Component JSX remains the same as before
  return (
    <div className="max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">OCR Reader</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Picture/File
        </label>
        <div {...getRootProps()} className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
          <input {...getInputProps()} />
          <div className="text-center">
            {isDragActive ? (
              <p className="text-blue-500">Drop the image here...</p>
            ) : (
              <>
                <svg
                  className="w-10 h-10 mx-auto mb-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  ></path>
                </svg>
                <p className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "Drag & drop or click to upload"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="mb-4">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-48 mx-auto rounded-lg"
          />
        </div>
      )}

      {isProcessing && (
        <div className="mb-4 text-blue-600 text-center">
          Processing image... Please wait.
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-600 text-center">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extracted Text
        </label>
        <textarea
          rows="4"
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
          placeholder="Extracted text will appear here..."
          value={extractedText}
          readOnly
        ></textarea>
      </div>

      <div className="flex justify-end space-x-4">
        <button 
          className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={processImage}
          disabled={isProcessing || !selectedFile}
        >
          {isProcessing ? 'Processing...' : 'Process Image'}
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          disabled={isProcessing || !extractedText}
        >
          Edit
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          disabled={isProcessing || !extractedText}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default OCRProcessor;