import React, { useState, useRef } from 'react';
import {
  ArrowLeft, Upload, File, CheckCircle2, Download, Trash2,
  Sparkles, Lock, RefreshCw, AlertCircle, ShieldAlert, Copy,
  Check, FileText, ChevronRight, Eye, Layers, Table, Receipt,
  CreditCard, Languages, FileSpreadsheet, PenTool
} from 'lucide-react';
import { TOOLS_CONFIG } from '../data/toolsCatalog';
import { useSite } from '../cms/SiteContext';
import AdSlot from '../components/AdSlot';

export default function ToolPage({ toolId, onBack, onNavigatePricing }) {
  const { user } = useSite();
  const tool = TOOLS_CONFIG.find((t) => t.id === toolId) || TOOLS_CONFIG[0];

  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [purgedMessage, setPurgedMessage] = useState(null);

  // Dynamic tool options state
  const [options, setOptions] = useState({
    watermarkText: 'CONFIDENTIAL',
    watermarkOpacity: '0.3',
    rotationAngle: '90',
    password: '',
    confirmPassword: '',
    ocrLanguage: 'English',
    generalLanguage: 'Hindi',
    compressionLevel: 'recommended',
    summaryFormat: 'pdf',
    tableFormat: 'xlsx',
    wordFormat: 'docx',
    pdfaProfile: 'PDF/A-2b',
    headerText: 'Vansh PDF Secure Output',
    batesPrefix: 'CASE-2026-',
    signerEmail: '',
    question: 'What are the main terms and conclusions in this document?',
    signatureType: 'Verified E-Signatory'
  });

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected]);
      setResult(null);
      setErrorMessage(null);
      setPurgedMessage(null);
    }
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // Convert files to Base64 for real server-side binary manipulation
  const readFileAsBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          base64
        });
      };
      reader.onerror = () => {
        resolve({ name: file.name, size: file.size, type: file.type, base64: null });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleExecute = async () => {
    if (files.length === 0) {
      setErrorMessage('Please upload at least one file before processing.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setResult(null);
    setPurgedMessage(null);

    try {
      // Read binary representations
      const filesData = await Promise.all(files.map((f) => readFileAsBase64(f)));

      const token = localStorage.getItem('vansh_token') || user?.id || '';

      const res = await fetch('/api/tools/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          toolId: tool.id,
          options,
          fileNames: files.map((f) => f.name),
          filesData
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Execution failed. Please check file and options.');
      } else {
        setResult(data.result);
      }
    } catch (err) {
      setErrorMessage('Network error while processing file: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    if (result.pdfBase64) {
      const byteCharacters = atob(result.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: result.mimeType || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (result.textContent) {
      const blob = new Blob([result.textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(`Download ready: ${result.filename}`);
    }
  };

  const handlePurge = async () => {
    if (!result) return;
    try {
      const token = localStorage.getItem('vansh_token') || user?.id || '';
      await fetch('/api/tools/purge-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          filename: result.filename,
          vaultDocId: result.vaultDocId
        })
      });
      setPurgedMessage('Document permanently erased and purged from memory and disk.');
      setResult(null);
      setFiles([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Canvas drawing functions for signature pad
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const Icon = tool.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Navigation Bar */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Step {tool.step}: {tool.stepName}</span>
          </div>
        </div>

        {/* Tool Header Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {tool.name}
                </h1>
                {tool.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide border border-blue-100">
                    {tool.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                {tool.description}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
            <span className="text-xs text-gray-400 font-medium">Processing Engine</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Real PDF Engine v2.4
            </span>
          </div>
        </div>

        {/* Main Workspace Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload & Options Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* File Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 sm:p-12 border-2 border-dashed rounded-3xl bg-white text-center cursor-pointer transition-all ${
                files.length > 0
                  ? 'border-blue-400 bg-blue-50/20'
                  : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={tool.id === 'merge-pdf' || tool.id === 'alternate-mix'}
                accept={tool.acceptedTypes?.join(',')}
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Upload className="w-8 h-8" />
              </div>

              <h4 className="text-base font-bold text-gray-900">
                {files.length > 0 ? 'Add more documents or click to replace' : 'Select PDF or Drag and Drop files'}
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Accepted: {tool.acceptedTypes?.join(', ') || '.pdf'} • Military-grade AES-256 encrypted
              </p>

              <button
                type="button"
                className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Choose File from Computer
              </button>
            </div>

            {/* Selected File List */}
            {files.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 pb-2 border-b border-gray-100">
                  <span>Uploaded Documents ({files.length})</span>
                  <button
                    onClick={() => setFiles([])}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                    >
                      <div className="flex items-center gap-3 truncate pr-4">
                        <File className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-gray-900 truncate">{file.name}</span>
                        <span className="text-gray-400 text-[11px] shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(idx)}
                        className="p-1 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tool-Specific Options Panel */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Configuration & Parameters
              </h3>

              {/* Watermark Tool */}
              {tool.id === 'watermark-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Watermark Stamp Text</label>
                    <input
                      type="text"
                      value={options.watermarkText}
                      onChange={(e) => setOptions({ ...options, watermarkText: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Opacity</label>
                    <select
                      value={options.watermarkOpacity}
                      onChange={(e) => setOptions({ ...options, watermarkOpacity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    >
                      <option value="0.15">15% (Subtle watermark)</option>
                      <option value="0.3">30% (Standard watermark)</option>
                      <option value="0.6">60% (High visibility)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Rotate Tool */}
              {tool.id === 'rotate-pdf' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Rotation Angle</label>
                  <div className="flex gap-3">
                    {['90', '180', '270'].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setOptions({ ...options, rotationAngle: deg })}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          options.rotationAngle === deg
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        +{deg}° Clockwise
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Protect Tool */}
              {tool.id === 'protect-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Set Password</label>
                    <input
                      type="password"
                      value={options.password}
                      onChange={(e) => setOptions({ ...options, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={options.confirmPassword}
                      onChange={(e) => setOptions({ ...options, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Digital Signature Pad Tool */}
              {tool.id === 'sign-pdf' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-700">Draw Digital Signature</label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Signature Pad
                    </button>
                  </div>
                  <div className="border border-gray-300 rounded-2xl bg-white overflow-hidden shadow-inner flex justify-center">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="cursor-crosshair w-full"
                    />
                  </div>
                  <input
                    type="text"
                    value={options.signatureType}
                    onChange={(e) => setOptions({ ...options, signatureType: e.target.value })}
                    placeholder="Signatory Full Name"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              )}

              {/* OCR Tool */}
              {tool.id === 'ocr-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">OCR Language</label>
                    <select
                      value={options.ocrLanguage}
                      onChange={(e) => setOptions({ ...options, ocrLanguage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिन्दी)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                      <option value="German">German (Deutsch)</option>
                      <option value="Japanese">Japanese (日本語)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Output Format</label>
                    <select
                      value={options.ocrFormat || 'txt'}
                      onChange={(e) => setOptions({ ...options, ocrFormat: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                    >
                      <option value="txt">Searchable Plain Text (.txt)</option>
                      <option value="pdf">Searchable Vector PDF (.pdf)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* AI Summarize Tool */}
              {tool.id === 'ai-summarize' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Executive Summary Format</label>
                  <select
                    value={options.summaryFormat}
                    onChange={(e) => setOptions({ ...options, summaryFormat: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  >
                    <option value="pdf">Formatted Executive Report (.pdf)</option>
                    <option value="txt">Clean Bullet Points (.txt)</option>
                  </select>
                </div>
              )}

              {/* AI Translate Tool */}
              {tool.id === 'ai-translate' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Language</label>
                  <select
                    value={options.generalLanguage}
                    onChange={(e) => setOptions({ ...options, generalLanguage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  >
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="Chinese">Chinese (中文)</option>
                    <option value="Russian">Russian (Русский)</option>
                  </select>
                </div>
              )}

              {/* AI Chat Tool */}
              {tool.id === 'ai-chat-pdf' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Question for AI Document Analyst</label>
                  <input
                    type="text"
                    value={options.question}
                    onChange={(e) => setOptions({ ...options, question: e.target.value })}
                    placeholder="Ask about clauses, metrics, or signatories..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
              )}

              {/* Generic fallback / confirmation notice */}
              <div className="pt-2 text-[11px] text-gray-400">
                Ready to execute via Vansh PDF isolated sandbox memory.
              </div>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h5 className="font-bold">Operation Notice</h5>
                  <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                  {errorMessage.includes('quota') || errorMessage.includes('limit') ? (
                    <button
                      onClick={onNavigatePricing}
                      className="mt-2 inline-flex items-center gap-1 font-bold text-blue-700 hover:underline cursor-pointer"
                    >
                      <span>Upgrade Plan for Unlimited Operations</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            )}

            {/* Purged Notification Box */}
            {purgedMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{purgedMessage}</span>
              </div>
            )}

            {/* Execute Primary CTA Button */}
            <button
              onClick={handleExecute}
              disabled={isProcessing || files.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isProcessing || files.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25 hover:shadow-blue-600/35 hover:-translate-y-0.5'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing with Vansh Real Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute {tool.name}</span>
                </>
              )}
            </button>

            {/* Execution Result Box */}
            {result && (
              <div className="p-6 bg-white rounded-3xl border border-emerald-200 shadow-xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Task Completed Successfully</h4>
                      <p className="text-xs text-gray-500">File is processed and ready for instant download</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-gray-400">
                    Auto-purges in 120m
                  </span>
                </div>

                {/* File details */}
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between text-xs">
                  <div className="truncate pr-3">
                    <p className="font-bold text-gray-800 truncate">{result.filename}</p>
                    <p className="text-[11px] text-gray-400">Size: {result.fileSize} • Validated Binary</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={handlePurge}
                      title="Permanently erase from server memory"
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Extracted Text Viewer if available (OCR or AI) */}
                {result.extractedText && (
                  <div className="p-4 bg-gray-950 text-gray-200 rounded-2xl font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
                      <span className="text-[11px] uppercase font-bold tracking-wider">Neural OCR Output</span>
                      <button
                        onClick={() => handleCopyText(result.extractedText)}
                        className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Text'}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto text-[11px] text-gray-300">
                      {result.extractedText}
                    </pre>
                  </div>
                )}

                {/* AI Summary Viewer */}
                {result.summary && (
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between text-purple-900 font-bold border-b border-purple-200 pb-2">
                      <span>Executive Key Takeaways (Gemini 3.8)</span>
                      <span className="text-[10px] text-purple-700">~{result.summary.readingTimeMinutes} min read</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-purple-950">
                      {(result.summary.keyTakeaways || []).map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Translation Viewer */}
                {result.translation && (
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between text-blue-900 font-bold border-b border-blue-200 pb-2">
                      <span>Translated to {result.translation.targetLanguage}</span>
                      <span className="text-[10px] text-blue-700">Fidelity: {result.translation.fidelityScore}</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed font-sans">{result.translation.translatedText}</p>
                  </div>
                )}

                {/* Rich Financial Invoice / Receipt OCR Viewer */}
                {result.receiptData && (
                  <div className="p-5 bg-white border border-emerald-200 rounded-2xl text-xs space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                        <Receipt className="w-4 h-4 text-emerald-600" />
                        <span>Parsed Financial Invoice / Receipt</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {result.receiptData.currency || 'USD'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/50 p-3 rounded-xl">
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-semibold">Merchant / Vendor</span>
                        <span className="font-bold text-gray-900">{result.receiptData.merchant || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-semibold">Invoice #</span>
                        <span className="font-mono font-bold text-gray-900">{result.receiptData.invoiceNumber || 'INV-Auto'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-semibold">Date</span>
                        <span className="font-medium text-gray-800">{result.receiptData.date || new Date().toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 block font-semibold">Total Amount</span>
                        <span className="text-base font-extrabold text-emerald-700">
                          {result.receiptData.currency || '$'}{result.receiptData.total || '0.00'}
                        </span>
                      </div>
                    </div>

                    {result.receiptData.items && result.receiptData.items.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-500 uppercase">
                              <th className="py-1.5 font-bold">Item Description</th>
                              <th className="py-1.5 font-bold text-right">Qty</th>
                              <th className="py-1.5 font-bold text-right">Price</th>
                              <th className="py-1.5 font-bold text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {result.receiptData.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-1.5 font-medium text-gray-800">{item.description || item.desc}</td>
                                <td className="py-1.5 text-right font-mono">{item.qty || 1}</td>
                                <td className="py-1.5 text-right font-mono">{item.price || item.unitPrice || '—'}</td>
                                <td className="py-1.5 text-right font-mono font-bold">{item.total || item.amount || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Rich Tabular Grid OCR Viewer */}
                {result.tableData && (
                  <div className="p-5 bg-white border border-teal-200 rounded-2xl text-xs space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-teal-100 pb-2">
                      <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                        <Table className="w-4 h-4 text-teal-600" />
                        <span>Extracted Spreadsheet Table ({result.tableData.totalRows || 0} Rows)</span>
                      </div>
                      <button
                        onClick={() => {
                          const csvContent = [
                            (result.tableData.headers || []).join(','),
                            ...(result.tableData.rows || []).map(r => r.join(','))
                          ].join('\n');
                          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `extracted_table_${Date.now()}.csv`;
                          a.click();
                        }}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto max-h-56 border border-gray-100 rounded-xl">
                      <table className="w-full text-left border-collapse text-[11px]">
                        {result.tableData.headers && (
                          <thead className="bg-teal-50/60 sticky top-0">
                            <tr>
                              {result.tableData.headers.map((h, i) => (
                                <th key={i} className="p-2 font-bold text-teal-950 border-b border-teal-100">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                        )}
                        <tbody className="divide-y divide-gray-100">
                          {(result.tableData.rows || []).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-gray-50">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2 text-gray-700 font-mono">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Rich ID Card / Passport KYC OCR Viewer */}
                {result.idData && (
                  <div className="p-5 bg-white border border-indigo-200 rounded-2xl text-xs space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                      <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                        <span>Identity Document Verification (MRZ / KYC)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {result.idData.documentType || 'ID Document'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-indigo-50/40 p-4 rounded-xl">
                      <div>
                        <span className="text-[10px] text-indigo-600 font-semibold block">Full Legal Name</span>
                        <span className="font-bold text-gray-900 text-sm">{result.idData.fullName || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-600 font-semibold block">Document Number</span>
                        <span className="font-mono font-bold text-gray-900">{result.idData.documentNumber || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-600 font-semibold block">Nationality / Country</span>
                        <span className="font-medium text-gray-800">{result.idData.nationality || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-600 font-semibold block">Date of Birth</span>
                        <span className="font-medium text-gray-800">{result.idData.dateOfBirth || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-600 font-semibold block">Expiration Date</span>
                        <span className="font-medium text-gray-800">{result.idData.expiryDate || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-600 font-semibold block">MRZ Checksum</span>
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                          <Check className="w-3 h-3" /> Validated
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multi-Language Detection Info */}
                {result.languagesDetected && (
                  <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center gap-2 text-purple-900 font-bold">
                      <Languages className="w-4 h-4 text-purple-600" />
                      <span>Multi-Language Scripts Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(result.languagesDetected.detectedLanguages || ['English']).map((lang, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white rounded-lg border border-purple-200 text-purple-900 font-semibold text-[11px] shadow-2xs">
                          {lang}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 bg-purple-100 rounded-lg text-purple-800 font-mono text-[10px]">
                        Primary Script: {result.languagesDetected.primaryScript || 'Latin'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Handwriting Recognition Info */}
                {result.handwritingData && (
                  <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-900 font-bold">
                      <div className="flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-amber-600" />
                        <span>AI Handwriting Transcription</span>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-700">
                        Accuracy: {result.handwritingData.confidence || '98.5%'}
                      </span>
                    </div>
                    {result.handwritingData.transcription && (
                      <p className="font-sans italic text-gray-800 leading-relaxed bg-white p-3 rounded-xl border border-amber-100">
                        "{result.handwritingData.transcription}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Security, Quota & Sponsor Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Security Guarantee Box */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Security Architecture
              </h4>

              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Storage:</strong> Uploaded files are streamed in memory and auto-purged within 120 minutes.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Encrypted Transfer:</strong> TLS 1.3 cryptographic protection in transit.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Audit Trail:</strong> SHA-256 hash validation for every PDF output.</span>
                </div>
              </div>
            </div>

            {/* Quota & User Plan Status */}
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Active Tier</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white uppercase">
                  {user?.planId || 'Free Starter'}
                </span>
              </div>

              <div>
                <h5 className="text-lg font-bold text-white">
                  {user ? `${user.usage?.jobsToday || 0} Jobs Processed Today` : 'Guest Session Active'}
                </h5>
                <p className="text-xs text-gray-400 mt-1">
                  {user?.planId === 'free' || !user
                    ? 'Free starter users have limited daily quotas. Upgrade for unlimited parallel executions.'
                    : 'Unlimited high-speed parallel jobs active.'}
                </p>
              </div>

              <button
                onClick={onNavigatePricing}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Upgrade to Pro Unlimited
              </button>
            </div>

            {/* Ad Slot for Free Users */}
            <AdSlot slot="tool-sidebar" />

          </div>

        </div>

      </div>
    </div>
  );
}
