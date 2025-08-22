import tkinter as tk
from tkinter import ttk, filedialog, messagebox, colorchooser
from PIL import Image, ImageDraw, ImageFont, ImageTk

# Font file placeholders (replace with your own .ttf paths)
FONT_PATHS = {
    "Font 1 (Great Vibes)": "GreatVibes-Regular.ttf",
    "Font 2 (Alex-Brush)": "AlexBrush-Regular.ttf",
    "Font 3 (DancingScript)": "DancingScript-VariableFont_wght.ttf",
    "Font 4 (Allura)": "Allura-Regular.ttf",
    "Font 5 (Parisienne)": "Parisienne-Regular.ttf",
}

class SignatureApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Digital Signature Creator")
        self.root.geometry("900x700")
        
        # Default values
        self.preview_img = None
        self.signature_color = "#000000"  # default = black
        self.font_size = tk.IntVar(value=80)  # default size
        
        # Name input
        self.name_var = tk.StringVar()
        tk.Label(root, text="Enter Name:", font=("Arial", 12)).pack(pady=5)
        tk.Entry(root, textvariable=self.name_var, font=("Arial", 12), width=30).pack(pady=5)
        
        # Font selection
        tk.Label(root, text="Choose Font:", font=("Arial", 12)).pack(pady=5)
        self.font_choice = tk.StringVar(value="Font 1 (Great Vibes)")
        font_menu = ttk.Combobox(root, textvariable=self.font_choice, values=list(FONT_PATHS.keys()), state="readonly")
        font_menu.pack(pady=5)
        
        # Font size slider
        tk.Label(root, text="Font Size:", font=("Arial", 12)).pack(pady=5)
        tk.Scale(root, from_=30, to=150, orient="horizontal", variable=self.font_size).pack(pady=5)
        
        # Background choice
        tk.Label(root, text="Background:", font=("Arial", 12)).pack(pady=5)
        self.bg_choice = tk.StringVar(value="White")
        ttk.Radiobutton(root, text="White", variable=self.bg_choice, value="White").pack()
        ttk.Radiobutton(root, text="Transparent", variable=self.bg_choice, value="Transparent").pack()
        
        # Color picker
        tk.Label(root, text="Ink Color:", font=("Arial", 12)).pack(pady=5)
        ttk.Button(root, text="Choose Color", command=self.choose_color).pack(pady=5)
        self.color_label = tk.Label(root, text="Current: Black", font=("Arial", 10))
        self.color_label.pack(pady=2)
        
        # Style effects
        tk.Label(root, text="Effects:", font=("Arial", 12)).pack(pady=5)
        self.bold_effect = tk.BooleanVar()
        self.shadow_effect = tk.BooleanVar()
        self.underline_effect = tk.BooleanVar()
        
        ttk.Checkbutton(root, text="Bold", variable=self.bold_effect).pack()
        ttk.Checkbutton(root, text="Shadow", variable=self.shadow_effect).pack()
        ttk.Checkbutton(root, text="Underline", variable=self.underline_effect).pack()
        
        # Preview button
        ttk.Button(root, text="Preview Signature", command=self.preview_signature).pack(pady=10)
        
        # Save button
        ttk.Button(root, text="Save Signature", command=self.save_signature).pack(pady=5)
        
        # Canvas for preview
        self.canvas = tk.Label(root)
        self.canvas.pack(pady=15)

    def choose_color(self):
        color_code = colorchooser.askcolor(title="Choose Signature Color")
        if color_code[1]:
            self.signature_color = color_code[1]  # hex color
            self.color_label.config(text=f"Current: {self.signature_color}", fg=self.signature_color)

    def generate_signature(self, name, font_path, background="White"):
        # Create image
        img = Image.new("RGBA", (900, 300), (255, 255, 255, 0) if background == "Transparent" else "white")
        draw = ImageDraw.Draw(img)
        
        # Load font
        try:
            font = ImageFont.truetype(font_path, self.font_size.get())
        except OSError:
            messagebox.showerror("Font Error", f"Could not load font: {font_path}")
            font = ImageFont.load_default()
        
        # Center text
        bbox = draw.textbbox((0, 0), name, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        position = ((900 - text_width) // 2, (300 - text_height) // 2)
        
        # Shadow effect
        if self.shadow_effect.get():
            shadow_offset = 3
            draw.text((position[0]+shadow_offset, position[1]+shadow_offset),
                      name, fill="gray", font=font)
        
        # Bold effect (draw multiple times)
        if self.bold_effect.get():
            offsets = [(0,0), (1,0), (0,1), (1,1)]
            for dx, dy in offsets:
                draw.text((position[0]+dx, position[1]+dy),
                          name, fill=self.signature_color, font=font)
        else:
            # Normal text
            draw.text(position, name, fill=self.signature_color, font=font)
        
        # Underline effect
        if self.underline_effect.get():
            underline_y = position[1] + text_height + 5
            draw.line((position[0], underline_y, position[0]+text_width, underline_y),
                      fill=self.signature_color, width=3)
        
        return img

    def preview_signature(self):
        name = self.name_var.get().strip()
        if not name:
            messagebox.showwarning("Input Required", "Please enter a name.")
            return
        
        font_path = FONT_PATHS[self.font_choice.get()]
        background = self.bg_choice.get()
        
        img = self.generate_signature(name, font_path, background)
        
        # Convert to Tkinter-compatible image
        self.preview_img = ImageTk.PhotoImage(img)
        self.canvas.config(image=self.preview_img)

    def save_signature(self):
        name = self.name_var.get().strip()
        if not name:
            messagebox.showwarning("Input Required", "Please enter a name.")
            return
        
        font_path = FONT_PATHS[self.font_choice.get()]
        background = self.bg_choice.get()
        
        img = self.generate_signature(name, font_path, background)
        
        filetypes = [("PNG Image", "*.png")]
        filepath = filedialog.asksaveasfilename(defaultextension=".png", filetypes=filetypes)
        if filepath:
            img.save(filepath)
            messagebox.showinfo("Saved", f"Signature saved as {filepath}")

# Run the app
if __name__ == "__main__":
    root = tk.Tk()
    app = SignatureApp(root)
    root.mainloop()
