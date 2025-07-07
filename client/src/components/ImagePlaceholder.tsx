import { FaImage } from "react-icons/fa"

interface ImagePlaceholderProps {
  width?: number
  height?: number
  className?: string
  alt?: string
}

export function ImagePlaceholder({ 
  width = 400, 
  height = 300, 
  className = "", 
  alt = "Placeholder" 
}: ImagePlaceholderProps) {
  return (
    <div 
      className={`bg-muted flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-center space-y-2">
        <FaImage className="h-12 w-12 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">{alt}</p>
      </div>
    </div>
  )
}