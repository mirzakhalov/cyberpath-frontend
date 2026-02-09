'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ResumeDropzoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  className?: string;
  disabled?: boolean;
}

export function ResumeDropzone({
  onFileSelect,
  selectedFile,
  className,
  disabled = false,
}: ResumeDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: { file: File; errors: { message: string }[] }[]) => {
      setError(null);
      
      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        if (firstError.message.includes('larger than')) {
          setError('File is too large. Maximum size is 10MB.');
        } else if (firstError.message.includes('File type')) {
          setError('Invalid file type. Please upload a PDF or DOCX file.');
        } else {
          setError(firstError.message);
        }
        return;
      }
      
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled,
  });

  const removeFile = () => {
    onFileSelect(null);
    setError(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {selectedFile ? (
        <div className="relative rounded-xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Resume uploaded
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={removeFile}
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer',
            isDragActive
              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:bg-slate-50/50 dark:hover:bg-slate-900/30',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-destructive'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl mb-4 transition-colors',
                isDragActive
                  ? 'bg-orange-100 dark:bg-orange-900/40'
                  : 'bg-slate-100 dark:bg-slate-800'
              )}
            >
              <Upload
                className={cn(
                  'h-8 w-8 transition-colors',
                  isDragActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'
                )}
              />
            </div>
            <p className="text-base font-medium text-foreground mb-1">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">PDF</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">DOCX</span>
              <span>up to 10MB</span>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}



