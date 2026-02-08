import { useCallback, useState } from 'react';
import { Upload, X, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';

export default function FileUpload({ onUpload, accept = '.xlsx,.xls,.csv', loading }) {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile) => {
        setFile(selectedFile);
        setUploadStatus(null);

        try {
            const result = await onUpload(selectedFile);
            setUploadStatus({ success: true, message: result.message });
        } catch (error) {
            setUploadStatus({
                success: false,
                message: error.response?.data?.message || 'Upload failed'
            });
        }
    };

    const clearFile = () => {
        setFile(null);
        setUploadStatus(null);
    };

    return (
        <div className="space-y-4">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive
                        ? 'border-royal bg-royal/10'
                        : 'border-amethyst/50 hover:border-amethyst'
                    }
          ${loading ? 'opacity-50 pointer-events-none' : ''}
        `}
            >
                <input
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                />

                <div className="flex flex-col items-center">
                    <div className={`
            w-16 h-16 rounded-full flex items-center justify-center mb-4
            ${dragActive ? 'bg-royal/20' : 'bg-lavender/50'}
          `}>
                        <Upload className={`w-8 h-8 ${dragActive ? 'text-royal' : 'text-plum/40'}`} />
                    </div>
                    <p className="text-plum font-medium mb-1">
                        {dragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-sm text-plum/60">
                        Supports Excel (.xlsx, .xls) and CSV files
                    </p>
                </div>
            </div>

            {file && (
                <div className="glass-card p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                            <div>
                                <p className="text-plum font-medium">{file.name}</p>
                                <p className="text-sm text-plum/60">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 rounded-lg text-plum/40 hover:text-plum hover:bg-lavender transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {loading && (
                        <div className="mt-4">
                            <div className="h-2 bg-lavender rounded-full overflow-hidden">
                                <div className="h-full bg-royal rounded-full animate-pulse" style={{ width: '75%' }} />
                            </div>
                            <p className="text-sm text-plum/60 mt-2">Uploading...</p>
                        </div>
                    )}

                    {uploadStatus && (
                        <div className={`
              mt-4 p-3 rounded-lg flex items-center gap-2
              ${uploadStatus.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
            `}>
                            {uploadStatus.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <span>{uploadStatus.message}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
