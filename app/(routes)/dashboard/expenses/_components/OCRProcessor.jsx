'use client';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, FileText, Check, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ReceiptProcessor from "@/utils/receiptProcessing";

const OCRProcessor = ({ budgetId, onProcessComplete }) => {
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tesseract, setTesseract] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isExpandedText, setIsExpandedText] = useState(false);

  const { processReceipt } = ReceiptProcessor({ budgetId });

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

  // Clean up preview URL and camera when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      stopCamera();
    };
  }, [previewUrl]);

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

  // Camera functionality
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(blob));
        stopCamera();
      }, 'image/jpeg', 0.95);
    }
  };

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Clear previous state
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedText('');
      setProcessingResult(null);
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

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setProcessingResult(null);
    setError(null);
    setOcrProgress(0);
    setProcessingStep('');
  };

  const processImage = async () => {
    if (!selectedFile || !tesseract) {
      setError('Please select an image file first');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setOcrProgress(0);
      setProcessingStep('initializing');

      // Create worker
      const worker = await tesseract.createWorker({
        logger: progress => {
          console.log('OCR Progress:', progress);
          
          if (progress.status === 'recognizing text') {
            setOcrProgress(progress.progress * 100);
          }
          
          setProcessingStep(progress.status);
        }
      });

      // Initialize worker
      setProcessingStep('loading language');
      await worker.loadLanguage('eng');
      
      setProcessingStep('initializing engine');
      await worker.initialize('eng');

      // Preprocess image
      setProcessingStep('preprocessing');
      const processedImage = await preprocessImage(selectedFile);

      // Perform OCR
      setProcessingStep('recognizing text');
      const { data: { text } } = await worker.recognize(processedImage);

      // Cleanup
      await worker.terminate();

      if (text && text.trim()) {
        setExtractedText(text.trim());
        
        // Process the extracted text using our receipt processor
        setProcessingStep('processing receipt');
        try {
          const response = await processReceipt(text.trim());
          setProcessingResult(response);
          
          if (response.success) {
            setProcessingStep('complete');
            // Delay navigation to allow user to see the result
            setTimeout(() => {
              if (onProcessComplete) onProcessComplete();
            }, 2000);
          } else {
            setProcessingStep('failed');
          }
        } catch (processingError) {
          console.error('Error processing receipt:', processingError);
          setError('Failed to process the extracted text. Please try again.');
          setProcessingStep('failed');
        }
      } else {
        setError('No text was extracted from the image');
        setProcessingStep('failed');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError(`Failed to process image: ${err.message}`);
      setProcessingStep('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto space-y-6">
      {isCameraActive ? (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-h-80 object-contain mx-auto"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-4 bg-gradient-to-t from-black/70 to-transparent">
            <button
              onClick={captureImage}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Take Photo"
            >
              <Camera className="w-6 h-6 text-green-600" />
            </button>
            <button
              onClick={stopCamera}
              className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Cancel"
            >
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Receipt Image
              </label>
              <div className="space-y-4">
                <div 
                  {...getRootProps()} 
                  className={`border-2 ${isDragActive ? 'border-green-400 bg-green-50' : 'border-dashed border-gray-300 bg-gray-50'} 
                    rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer text-center`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {isDragActive 
                      ? "Drop the image here..."
                      : selectedFile 
                        ? selectedFile.name 
                        : "Drag & drop or click to upload receipt"
                    }
                  </p>
                </div>
                
                <button
                  onClick={!isCameraActive ? startCamera : null}
                  className="w-full py-3 px-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors"
                  disabled={isProcessing || isCameraActive}
                >
                  <Camera className="w-5 h-5" />
                  <span>Take a Photo</span>
                </button>
              </div>
            </div>
            
            <div>
              {previewUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Receipt Preview
                  </label>
                  <div className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center h-40">
                    <img
                      src={previewUrl}
                      alt="Receipt Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={resetForm}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Loader2 className="w-5 h-5 mr-2 text-blue-500 animate-spin" />
                    <span className="text-blue-700 font-medium capitalize">
                      {processingStep.replace(/[_-]/g, ' ')}...
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${ocrProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}
            </div>
          </div>

          {extractedText && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Extracted Text
                </label>
                <button 
                  onClick={() => setIsExpandedText(!isExpandedText)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {isExpandedText ? "Show Less" : "Show More"}
                </button>
              </div>
              <textarea
                rows={isExpandedText ? "8" : "3"}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-sm bg-gray-50"
                placeholder="Extracted text will appear here..."
                value={extractedText}
                readOnly
              ></textarea>
            </div>
          )}

          {processingResult && (
            <div className={`p-4 rounded-lg border ${processingResult.success ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <div className="flex items-center mb-3">
                {processingResult.success ? (
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                )}
                <h3 className="font-bold">
                  {processingResult.success ? 'Receipt Processed Successfully!' : 'Processing Error'}
                </h3>
              </div>
              
              <p className="mb-3">{processingResult.message || (processingResult.success ? 'Receipt expenses have been extracted.' : 'Failed to process receipt')}</p>
              
              {processingResult.success && processingResult.expenses && processingResult.expenses.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-medium mb-2">Extracted Expenses:</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {processingResult.expenses.map((expense, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-all">
                        <div className="font-medium text-gray-800">{expense.name}</div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="font-semibold text-green-600">${Number(expense.amount).toFixed(2)}</span>
                          <span className="text-gray-500">{new Date(expense.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            {extractedText && !processingResult && (
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center"
                onClick={resetForm}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </button>
            )}
            
            <button 
              className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-colors flex items-center shadow-md ${
                isProcessing || !selectedFile ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
              onClick={processImage}
              disabled={isProcessing || !selectedFile}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Process Receipt
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OCRProcessor;