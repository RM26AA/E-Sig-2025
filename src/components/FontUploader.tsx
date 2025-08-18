import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FontUploaderProps {
  onFontLoad: (fontFamily: string, fontUrl: string) => void;
  uploadedFonts: Array<{ name: string; family: string; url: string }>;
  onRemoveFont: (fontFamily: string) => void;
}

export const FontUploader = ({ onFontLoad, uploadedFonts, onRemoveFont }: FontUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ttf') && !file.name.toLowerCase().endsWith('.otf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .ttf or .otf font file.",
        variant: "destructive"
      });
      return;
    }

    try {
      const fontUrl = URL.createObjectURL(file);
      const fontName = file.name.replace(/\.[^/.]+$/, "");
      const fontFamily = `uploaded-${fontName}-${Date.now()}`;

      // Create a font face and load it
      const fontFace = new FontFace(fontFamily, `url(${fontUrl})`);
      await fontFace.load();
      document.fonts.add(fontFace);

      onFontLoad(fontFamily, fontUrl);
      
      toast({
        title: "Font uploaded successfully!",
        description: `${fontName} is now available for use.`
      });
    } catch (error) {
      toast({
        title: "Font upload failed",
        description: "There was an error loading the font file.",
        variant: "destructive"
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-4">
      <Card
        className={`border-dashed transition-colors ${
          isDragOver ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-6 text-center">
          <Upload className="mx-auto mb-4 text-muted-foreground" size={32} />
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your font files here, or click to browse
          </p>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Font Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ttf,.otf"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supports .ttf and .otf files
          </p>
        </CardContent>
      </Card>

      {uploadedFonts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Fonts</h4>
          {uploadedFonts.map((font) => (
            <div
              key={font.family}
              className="flex items-center justify-between p-2 bg-signature-surface border border-border rounded"
            >
              <span className="text-sm">{font.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFont(font.family)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};