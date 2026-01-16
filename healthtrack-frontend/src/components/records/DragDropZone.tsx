import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DragDropZoneProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
}

export default function DragDropZone({ onFileSelect, selectedFile }: DragDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
            />

            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                animate={{
                    scale: isDragging ? 0.98 : 1,
                    borderColor: isDragging ? 'rgba(20, 184, 166, 0.5)' : 'rgba(226, 232, 240, 0.5)',
                    backgroundColor: isDragging ? 'rgba(20, 184, 166, 0.05)' : 'transparent',
                }}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed py-12 px-6 text-center transition-all ${isDragging ? 'shadow-2xl shadow-teal-500/10' : 'hover:border-teal-500/30'
                    }`}
            >
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={{ y: isDragging ? -5 : 0 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? 'bg-teal-500 text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-teal-500'
                            }`}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </motion.div>

                    <div className="space-y-1">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                            {selectedFile ? 'Change Document' : 'Drop Health Record'}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium">
                            PDF, JPEG, or PNG up to 10MB
                        </p>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedFile && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 p-4 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-between"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{selectedFile.name}</p>
                                    <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); onFileSelect(null as any); }}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
