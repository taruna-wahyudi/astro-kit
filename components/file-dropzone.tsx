import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from './ui/card'
import { Upload } from 'lucide-react'

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void
  accept?: Record<string, string[]>
  maxFiles?: number
}

export function FileDropzone({ onFilesDrop, accept, maxFiles = 9999 }: FileDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesDrop(acceptedFiles)
  }, [onFilesDrop])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles
  })

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-center text-muted-foreground">Drop the files here...</p>
        ) : (
          <p className="text-center text-muted-foreground">
            Drag & drop files here, or click to select files
          </p>
        )}
      </div>
    </Card>
  )
}