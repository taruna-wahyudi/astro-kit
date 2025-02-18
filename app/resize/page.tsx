"use client"

import { useState } from 'react'
import { FileDropzone } from '@/components/file-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ProgressBar } from '@/components/progress-bar'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function ResizePage() {
  const [files, setFiles] = useState<File[]>([])
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const { toast } = useToast()

  const handleFilesDrop = (newFiles: File[]) => {
    setFiles(newFiles)
    const initialProgress = newFiles.reduce((acc, file) => {
      acc[file.name] = 0
      return acc
    }, {} as Record<string, number>)
    setProgress(initialProgress)
  }

  const handleResize = async () => {
    if (!files.length || !width || !height) {
      toast({
        title: "Error",
        description: "Please select files and specify dimensions",
        variant: "destructive"
      })
      return
    }

    const formData = new FormData()
    files.forEach(file => formData.append('files', file))
    formData.append('width', width)
    formData.append('height', height)
    formData.append('maintainAspectRatio', String(maintainAspectRatio))

    try {
      const response = await fetch('/api/resize', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Resize failed')

      setProgress(prevProgress => {
        const newProgress = { ...prevProgress };
        files.forEach(file => newProgress[file.name] = 100);
        return newProgress;
      });

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resized-images.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: "Images resized successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resize images",
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
          <h1 className="text-3xl font-bold mb-4">Resize Images</h1>
          <p className="text-muted-foreground">
            Resize your images while maintaining quality. Supports bulk resizing with multiple files.
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="width">Width (px)</Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={e => setWidth(e.target.value)}
              placeholder="Enter width"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder="Enter height"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="aspect-ratio"
            checked={maintainAspectRatio}
            onCheckedChange={setMaintainAspectRatio}
          />
          <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
        </div>

        <Button onClick={handleResize} disabled={!files.length || !width || !height}>
          Resize
        </Button>
      </div>
    </div>
  )
}
