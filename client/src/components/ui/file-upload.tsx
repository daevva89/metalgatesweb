import { useState, useCallback, ReactNode, useEffect } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { FaUpload, FaTimes, FaImage } from "react-icons/fa"
import { useToast } from "../../hooks/useToast"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  description?: ReactNode
  accept?: string
  maxSize?: number
  currentImage?: string | null
}

export function FileUpload({
  onFileSelect,
  description = "Drag 'n' drop some files here, or click to select files",
  accept = "image/*",
  maxSize = 5,
  currentImage = null
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ file, errors }) => {
          errors.forEach((error: { code: string; message: string }) => {
            let message = error.message
            if (error.code === "file-too-large") {
              message = `File is too large. Maximum size is ${maxSize}MB.`
            } else if (error.code === "file-invalid-type") {
              message = "Invalid file type."
            }
            toast({
              title: "Error",
              description: `${file.name}: ${message}`,
              variant: "destructive",
            })
          })
        })
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
          onFileSelect(file)
        }
        reader.readAsDataURL(file)
      }
    },
    [onFileSelect, maxSize, toast]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
  })

  const handleRemoveImage = () => {
    setPreview(null)
    onFileSelect(null)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors ${
          isDragActive ? "border-primary" : "border-border"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <FaUpload className="w-8 h-8 mb-4 text-muted-foreground" />
            <p className="mb-2 text-sm text-muted-foreground">
              {description}
            </p>
            <p className="text-xs text-muted-foreground">
              (Max size: {maxSize}MB)
            </p>
          </div>
        )}
      </div>
      {preview && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex items-center text-sm text-red-500 hover:text-red-700"
          >
            <FaTimes className="mr-1" />
            Remove Image
          </button>
        </div>
      )}
    </div>
  )
}