import glob
import os
from PIL import Image

def create_gif():
    frames_dir = os.path.join('assets', 'frames')
    frame_files = sorted(glob.glob(os.path.join(frames_dir, 'frame_*.png')))
    
    if not frame_files:
        print("[GIF] No frames found in assets/frames!")
        return

    print(f"[GIF] Processing {len(frame_files)} frames...")
    
    images = []
    for f in frame_files:
        img = Image.open(f).convert('RGB')
        # Convert to adaptive palette for compact size
        quantized = img.convert('P', palette=Image.Palette.ADAPTIVE, colors=128)
        images.append(quantized)

    output_path = os.path.join('assets', 'demo.gif')
    print(f"[GIF] Saving animated GIF to {output_path}...")
    
    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:],
        optimize=True,
        duration=125, # 8 fps -> 125ms per frame
        loop=0
    )
    
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"[GIF] Done! Successfully created {output_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    create_gif()
