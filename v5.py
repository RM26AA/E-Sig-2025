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
        self.root.geometry("1000x600")
        
        # Default values
        self.preview_img = None
        self.signature_color = "#000000"  # default = black
        self.font_size = tk.IntVar(value=80)  # default size

        # Main layout: left controls, right preview
        main_frame = ttk.Frame(root, padding=10)
        main_frame.pack(fill="both", expand=True)

        controls_frame = ttk.Frame(main_frame)
        controls_frame.pack(side="left", fill="y", padx=10, pady=10)

        preview_frame = ttk.Frame(main_frame)
        preview_frame.pack(side="right", fill="both", expand=True, padx=10, pady=10)

        # --- Controls ---

        # Name input
        name_frame = ttk.LabelFrame(controls_frame, text="Name Input", padding=10)
        name_frame.pack(fill="x", pady=5)
        self.name_var = tk.StringVar()
        ttk.Entry(name_frame, textvariable=self.name_var, font=("Arial", 12), width=25).pack()

        # Font settings
        font_frame = ttk.LabelFrame(controls_frame, text="Font Settings", padding=10)
        font_frame.pack(fill="x", pady=5)

        ttk.Label(font_frame, text="Font:").grid(row=0, column=0, sticky="w", pady=2)
        self.font_choice = tk.StringVar(value="Font 1 (Great Vibes)")
        font_menu = ttk.Combobox(font_frame, textvariable=self.font_choice, values=list(FONT_PATHS.keys()), state="readonly", width=22)
        font_menu.grid(row=0, column=1, pady=2)

        ttk.Label(font_frame, text="Font Size:").grid(row=1, column=0, sticky="w", pady=5)
        tk.Scale(font_frame, from_=30, to=150, orient="horizontal", variable=self.font_size, length=200).grid(row=1, column=1, pady=5)

        # Background settings
        bg_frame = ttk.LabelFrame(controls_frame, text="Background", padding=10)
        bg_frame.pack(fill="x", pady=5)
        self.bg_choice = tk.StringVar(value="White")
        ttk.Radiobutton(bg_frame, text="White", variable=self.bg_choice, value="White").pack(anchor="w")
        ttk.Radiobutton(bg_frame, text="Transparent", variable=self.bg_choice, value="Transparent").pack(anchor="w")

        # Color picker
        color_frame = ttk.LabelFrame(controls_frame, text="Ink Color", padding=10)
        color_frame.pack(fill="x", pady=5)
        ttk.Button(color_frame, text="Choose Color", command=self.choose_color).pack(side="left", padx=5)
        self.color_label = ttk.Label(color_frame, text="Current: Black")
        self.color_label.pack(side="left", padx=5)

        # Style effects
        style_frame = ttk.LabelFrame(controls_frame, text="Effects", padding=10)
        style_frame.pack(fill="x", pady=5)
        self.bold_effect = tk.BooleanVar()
        self.shadow_effect = tk.BooleanVar()
        self.underline_effect = tk.BooleanVar()
        ttk.Checkbutton(style_frame, text="Bold", variable=self.bold_effect).pack(anchor="w")
        ttk.Checkbutton(style_frame, text="Shadow", variable=self.shadow_effect).pack(anchor="w")
        ttk.Checkbutton(style_frame, text="Underline", variable=self.underline_effect).pack(anchor="w")

        # Action buttons
        button_frame = ttk.Frame(controls_frame, padding=10)
        button_frame.pack(fill="x", pady=5)
        ttk.Button(button_frame, text="Preview Signature", command=self.preview_signature).pack(fill="x", pady=2)
        ttk.Button(button_frame, text="Save Signature", command=self.save_signature).pack(fill="x", pady=2)

        # --- Preview Area ---
        ttk.Label(preview_frame, text="Signature Preview", font=("Arial", 14)).pack(pady=5)
        self.canvas = tk.Label(preview_frame, bg="white", relief="sunken")
        self.canvas.pack(fill="both", expand=True, padx=10, pady=10)

    def choose_color(self):
        color_code = colorchooser.askcolor(title="Choose Signature Color")
        if color_code[1]:
            self.signature_color = color_code[1]  # hex color
            self.color_label.config(text=f"Current: {self.signature_color}", foreground=self.signature_color)

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
