import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const FileUpload = ({ 
  onFileSelect, 
  onUpload, 
  accept = ".pdf,.doc,.docx,.txt,.jpg,.png",
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  className 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    if (file.size > maxSize) {
      alert(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !onUpload) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      await onUpload(selectedFile);
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
          dragActive && !disabled ? "border-blue-400 bg-blue-50" : "border-slate-300",
          disabled ? "bg-slate-50 cursor-not-allowed" : "hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Upload" className="h-6 w-6 text-blue-600" />
          </div>
          
          {!disabled ? (
            <>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Drop your file here, or <span className="text-blue-600 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports: PDF, DOC, DOCX, TXT, JPG, PNG (Max {Math.round(maxSize / 1024 / 1024)}MB)
                </p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-slate-500">Submission deadline has passed</p>
              <p className="text-xs text-slate-400">File upload is no longer available</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {!uploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                icon="X"
              />
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!uploading && (
            <div className="mt-3 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={!selectedFile}
                icon="Upload"
                size="sm"
              >
                Submit File
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;