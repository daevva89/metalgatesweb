import React, { useCallback, useState, useRef, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from './button'

interface FileUploadProps {
  onFileSelect: (base64: string) => void
  accept?: string
  maxSize?: number // in MB
  description?: string
  className?: string
  currentImage?: string // Add support for showing existing image
}

export function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5,
  description = 'Upload an image',
  className = '',
  currentImage
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [userRemovedImage, setUserRemovedImage] = useState(false) // Track if user explicitly removed image
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set preview to currentImage when component mounts or currentImage changes
  // BUT only if user hasn't explicitly removed the image
  useEffect(() => {
    if (currentImage && !preview && !userRemovedImage) {
      setPreview(currentImage)
    }
  }, [currentImage, preview, userRemovedImage])

  // Reset userRemovedImage when currentImage changes (e.g., editing different item)
  useEffect(() => {
    setUserRemovedImage(false)
  }, [currentImage])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        console.log('FileUpload: Base64 conversion successful, length:', result.length)
        resolve(result)
      }
      reader.onerror = (error) => {
        console.error('FileUpload: Base64 conversion failed:', error)
        reject(error)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    console.log('FileUpload: handleFileSelect called with files:', files.length)
    if (files.length === 0) {
      console.log('FileUpload: No files provided')
      return
    }

    const file = files[0]
    console.log('FileUpload: Processing file:', file.name, 'size:', file.size, 'type:', file.type)

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      console.error('FileUpload: File too large:', file.size, 'max:', maxSize * 1024 * 1024)
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    // Check file type
    if (accept !== '*/*' && !file.type.match(accept.replace('*', '.*'))) {
      console.error('FileUpload: Invalid file type:', file.type, 'expected:', accept)
      alert(`Please select a valid file type (${accept})`)
      return
    }

    try {
      console.log('FileUpload: Starting base64 conversion')
      const base64 = await convertToBase64(file)
      console.log('FileUpload: Base64 conversion complete, calling onFileSelect')
      setPreview(base64)
      setUserRemovedImage(false) // Reset the flag when a new file is selected
      onFileSelect(base64)
    } catch (error) {
      console.error('FileUpload: Error converting file to base64:', error)
      alert('Error processing file')
    }
  }, [maxSize, accept, onFileSelect])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('FileUpload: handleInputChange called')
    const files = event.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isDragActive) {
      setIsDragActive(true)
    }
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragActive(false)
    
    console.log('FileUpload: handleDrop called')
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleClick = () => {
    console.log('FileUpload: handleClick called')
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    console.log('FileUpload: removeFile called - clearing image')
    setPreview(null)
    setUserRemovedImage(true) // Mark that the user explicitly removed the image
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Notify parent component that image was removed
    onFileSelect('')
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{description}</p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to browse (max {maxSize}MB)
            </p>
          </div>
        </div>
      </div>

      {preview && (
        <div className="relative">
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <img
              src={preview}
              alt="Preview"
              className="h-16 w-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium">File uploaded</p>
              <p className="text-xs text-muted-foreground">Ready to save</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}