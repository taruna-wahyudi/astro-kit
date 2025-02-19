"use client"

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileDropzone } from '@/components/file-dropzone';
import JSZip from "jszip";

export default function CompressPage() {
    const [files, setFiles] = useState<File[]>([]);
    const [quality, setQuality] = useState<number>(80);
    const [compressedFiles, setCompressedFiles] = useState<File[]>([]);
    const [isCompressing, setIsCompressing] = useState<boolean>(false);
    const { toast } = useToast();

    const handleFilesDrop = (newFiles: File[]) => {
        setFiles(newFiles);
        setCompressedFiles([]); // Reset compressed files when new files are uploaded
    };

    const handleCompress = async () => {
        if (!files.length || quality < 1 || quality > 100) {
            toast({
                title: "Error",
                description: "Please select files and set a valid quality (1-100)",
                variant: "destructive"
            });
            return;
        }

        setIsCompressing(true);

        const formData = new FormData();
        files.forEach((file) => formData.append('files', file));
        formData.append('quality', quality.toString());

        try {
            const response = await fetch('/api/compress', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Compression failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compressed-images.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast({
                title: "Success",
                description: "Images compressed successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to compress images",
                variant: "destructive"
            });
        } finally {
            setIsCompressing(false);
        }
    };

    const formatFileSize = (size: number) => {
        return (size / 1024 / 1024).toFixed(2) + ' MB'; // Convert bytes to MB
    };

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
                    <h1 className="text-3xl font-bold mb-4">Compress Images</h1>
                    <p className="text-muted-foreground">
                        Reduce the file size of your images without losing quality. Supports multiple files.
                    </p>
                </div>

                <FileDropzone
                    onFilesDrop={handleFilesDrop}
                    accept={{
                        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif']
                    }}
                />

                {files.length > 0 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {files.map((file) => (
                                <div key={file.name} className="flex justify-between">
                                    <p>{file.name}</p>
                                    <p>Size: {formatFileSize(file.size)}</p>
                                </div>
                            ))}
                        </div>

                        <Input
                            type="number"
                            min="1"
                            max="100"
                            value={quality}
                            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                            placeholder="Quality (1-100)"
                            className="w-[200px]"
                        />

                        <Button onClick={handleCompress} disabled={isCompressing}>
                            {isCompressing ? 'Compressing...' : 'Compress'}
                        </Button>
                    </div>
                )}

                {compressedFiles.length > 0 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {compressedFiles.map((file) => (
                                <div key={file.name} className="flex justify-between">
                                    <p>{file.name}</p>
                                    <p>Size: {formatFileSize(file.size)}</p>
                                </div>
                            ))}
                        </div>

                        <Button
                            onClick={() => {
                                const zip = new JSZip();
                                compressedFiles.forEach((file) => {
                                    zip.file(file.name, file);
                                });

                                zip.generateAsync({ type: 'blob' }).then((blob: Blob | MediaSource) => {
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'compressed-images.zip';
                                    document.body.appendChild(a);
                                    a.click();
                                    window.URL.revokeObjectURL(url);
                                    document.body.removeChild(a);
                                });
                            }}
                        >
                            Download Compressed Images
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}