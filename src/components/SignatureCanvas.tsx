import { useEffect, useRef } from 'react';

interface SignatureCanvasProps {
  name: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  bold: boolean;
  shadow: boolean;
  underline: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export const SignatureCanvas = ({
  name,
  fontFamily,
  fontSize,
  color,
  backgroundColor,
  bold,
  shadow,
  underline,
  onCanvasReady
}: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !name) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 300;

    // Clear canvas
    if (backgroundColor === 'transparent') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set font properties
    const fontWeight = bold ? 'bold' : 'normal';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw shadow if enabled
    if (shadow) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillText(name, centerX + 3, centerY + 3);
    }

    // Draw main text
    ctx.fillStyle = color;
    ctx.fillText(name, centerX, centerY);

    // Draw underline if enabled
    if (underline) {
      const textMetrics = ctx.measureText(name);
      const textWidth = textMetrics.width;
      const underlineY = centerY + fontSize * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(centerX - textWidth / 2, underlineY);
      ctx.lineTo(centerX + textWidth / 2, underlineY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Notify parent component that canvas is ready
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [name, fontFamily, fontSize, color, backgroundColor, bold, shadow, underline, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-border rounded-lg shadow-card-soft max-w-full h-auto"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};