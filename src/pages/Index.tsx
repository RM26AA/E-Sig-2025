import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Palette, Type, Settings, Upload } from 'lucide-react';
import { SignatureCanvas } from '@/components/SignatureCanvas';
import { ColorPicker } from '@/components/ColorPicker';
import { FontUploader } from '@/components/FontUploader';
import { useToast } from '@/hooks/use-toast';

const GOOGLE_FONTS = [
  { name: 'Dancing Script', family: 'Dancing Script' },
  { name: 'Great Vibes', family: 'Great Vibes' },
  { name: 'Alex Brush', family: 'Alex Brush' },
  { name: 'Allura', family: 'Allura' },
  { name: 'Parisienne', family: 'Parisienne' },
];

const BACKGROUND_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'transparent', label: 'Transparent' },
];

const Index = () => {
  const [name, setName] = useState('');
  const [selectedFont, setSelectedFont] = useState('Dancing Script');
  const [fontSize, setFontSize] = useState([80]);
  const [signatureColor, setSignatureColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [bold, setBold] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState<HTMLCanvasElement | null>(null);
  const [uploadedFonts, setUploadedFonts] = useState<Array<{ name: string; family: string; url: string }>>([]);
  
  const { toast } = useToast();

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCurrentCanvas(canvas);
  }, []);

  const handleFontLoad = (fontFamily: string, fontUrl: string) => {
    const fontName = fontFamily.replace('uploaded-', '').split('-')[0];
    setUploadedFonts(prev => [...prev, { 
      name: fontName, 
      family: fontFamily, 
      url: fontUrl 
    }]);
    setSelectedFont(fontFamily);
  };

  const handleRemoveFont = (fontFamily: string) => {
    setUploadedFonts(prev => prev.filter(font => font.family !== fontFamily));
    if (selectedFont === fontFamily) {
      setSelectedFont('Dancing Script');
    }
  };

  const downloadSignature = () => {
    if (!currentCanvas || !name.trim()) {
      toast({
        title: "Cannot download",
        description: "Please enter a name and generate a preview first.",
        variant: "destructive"
      });
      return;
    }

    // Create download link
    currentCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name.replace(/[^a-zA-Z0-9]/g, '_')}_signature.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Download successful!",
          description: "Your signature has been downloaded."
        });
      }
    }, 'image/png');
  };

  const allFonts = [...GOOGLE_FONTS, ...uploadedFonts];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Digital Signature Creator
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Create beautiful, professional digital signatures with custom fonts, colors, and effects
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic" className="flex items-center gap-1">
                  <Type size={16} />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="style" className="flex items-center gap-1">
                  <Palette size={16} />
                  Style
                </TabsTrigger>
                <TabsTrigger value="fonts" className="flex items-center gap-1">
                  <Upload size={16} />
                  Fonts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Font Style</Label>
                      <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allFonts.map((font) => (
                            <SelectItem 
                              key={font.family} 
                              value={font.family}
                              style={{ fontFamily: font.family }}
                            >
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Font Size: {fontSize[0]}px</Label>
                      <Slider
                        value={fontSize}
                        onValueChange={setFontSize}
                        min={30}
                        max={150}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Background</Label>
                      <Select value={backgroundColor} onValueChange={setBackgroundColor}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BACKGROUND_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Style & Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Signature Color</Label>
                      <ColorPicker
                        color={signatureColor}
                        onChange={setSignatureColor}
                        label="Ink Color"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Text Effects</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="bold"
                            checked={bold}
                            onCheckedChange={(checked) => setBold(checked as boolean)}
                          />
                          <Label htmlFor="bold">Bold</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="shadow"
                            checked={shadow}
                            onCheckedChange={(checked) => setShadow(checked as boolean)}
                          />
                          <Label htmlFor="shadow">Shadow</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="underline"
                            checked={underline}
                            onCheckedChange={(checked) => setUnderline(checked as boolean)}
                          />
                          <Label htmlFor="underline">Underline</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fonts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Custom Fonts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FontUploader
                      onFontLoad={handleFontLoad}
                      uploadedFonts={uploadedFonts}
                      onRemoveFont={handleRemoveFont}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview and Download */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Signature Preview
                  <Button
                    onClick={downloadSignature}
                    disabled={!name.trim()}
                    className="bg-gradient-accent hover:opacity-90 shadow-button-glow"
                  >
                    <Download className="mr-2" size={16} />
                    Download PNG
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-signature-surface p-8 rounded-lg border border-border">
                  {name.trim() ? (
                    <div className="flex justify-center">
                      <SignatureCanvas
                        name={name}
                        fontFamily={selectedFont}
                        fontSize={fontSize[0]}
                        color={signatureColor}
                        backgroundColor={backgroundColor}
                        bold={bold}
                        shadow={shadow}
                        underline={underline}
                        onCanvasReady={handleCanvasReady}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-20 text-muted-foreground">
                      <Type className="mx-auto mb-4" size={48} />
                      <p className="text-lg">Enter your name to see the preview</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;