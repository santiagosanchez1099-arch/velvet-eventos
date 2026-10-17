"""Regenerate the local slideshow video. Requires imageio-ffmpeg (generation only)."""
from pathlib import Path
import sys, subprocess
root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / '.runtime'))
import imageio_ffmpeg
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
args = [ffmpeg, '-y']
for name in ['imagen1.png', 'boda campestre.png', 'quince.png']:
    args += ['-loop', '1', '-t', '4', '-i', str(root / name)]
filters = []
for i in range(3):
    filters.append(f'[{i}:v]scale=1600:1066,zoompan=z=1.04+0.0005*on:x=iw/2-iw/zoom/2:y=ih/2-ih/zoom/2:d=1:s=1280x720:fps=25,setsar=1,fade=t=in:st=0:d=0.3,fade=t=out:st=3.7:d=0.3[v{i}]')
filters.append('[v0][v1][v2]concat=n=3:v=1:a=0[out]')
args += ['-filter_complex', ';'.join(filters), '-map', '[out]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', str(root / 'assets/eventos.mp4')]
subprocess.run(args, check=True, capture_output=True)
print('Video local generado:', (root / 'assets/eventos.mp4').stat().st_size, 'bytes')
