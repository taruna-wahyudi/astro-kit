"use client"

import { useState } from 'react'
import { FileDropzone } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProgressBar } from '@/components/progress-bar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'webp', 'avif']

export default function ConvertPage() {
  const [files, setFiles] = useState<File[]>([])
  const [format, setFormat] = useState<string>('')
  const [progress, setProgress] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const handleFilesDrop = (newFiles: File[]) => {
    setFiles(newFiles)

    newFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentLoaded = (event.loaded / event.total) * 100
          setProgress((prev) => ({
            ...prev,
            [file.name]: percentLoaded
          }))
        }
      }

      reader.onloadend = () => {
        setProgress((prev) => ({
          ...prev,
          [file.name]: 100
        }))
      }

      reader.readAsArrayBuffer(file)
    })
  }

  const handleConvert = async () => {
    if (!files.length || !format) {
      toast({
        title: "Error",
        description: "Please select files and output format",
        variant: "destructive"
      })
      return
    }

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('format', format)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Conversion failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'converted-images.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Images converted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert images",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Convert Images</h1>
          <p className="text-muted-foreground">
            Convert your images to different formats. Supports bulk conversion with multiple files.
          </p>
        </div>

        <FileDropzone
            onFilesDrop={handleFilesDrop}
            accept={{
              'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif']
            }}
        />

        <div className="space-y-4">
          {files.map(file => (
            <ProgressBar
              key={file.name}
              fileName={file.name}
              progress={progress[file.name] || 0}
            />
          ))}
        </div>


        <div className="flex gap-4">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select format"/>
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_FORMATS.map(format => (
                  <SelectItem key={format} value={format}>
                    {format.toUpperCase()}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleConvert} disabled={!files.length || !format}>
            Convert
          </Button>
        </div>
      </div>
    </div>
  )
}