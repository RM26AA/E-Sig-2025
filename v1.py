from PIL import Image, ImageDraw, ImageFont

def create_signature(name, font_path="GreatVibes-Regular.ttf", output="signature1.png"):
    # Create a blank image with white background
    img = Image.new("RGB", (600, 200), "white")
    draw = ImageDraw.Draw(img)
    
    # Load a handwriting-like font
    try:
        font = ImageFont.truetype(font_path, 80)
    except OSError:
        print("⚠️ Could not load custom font, using default font instead.")
        font = ImageFont.load_default()
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), name, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center text
    position = ((600 - text_width) // 2, (200 - text_height) // 2)
    
    # Draw text
    draw.text(position, name, fill="black", font=font)
    
    img.save(output)
    print(f"Signature saved as {output}")

# Example
create_signature("R.Maunick")
