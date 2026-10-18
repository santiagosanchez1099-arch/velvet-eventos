"""Create a steady, fixed-frame local video with dissolves. No camera zoom."""
from pathlib import Path
import sys, subprocess
root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / '.runtime'))
import imageio_ffmpeg
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
args = [ffmpeg, '-y', '-filter_complex_threads', '1']
# Returning to the first frame makes the loop seamless.
for name in ['imagen1.png', 'boda campestre.png', 'quince.png', 'imagen1.png']:
    args += ['-loop', '1', '-framerate', '30', '-t', '4', '-i', str(root / name)]
filters = [f'[{i}:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS,fps=30[v{i}]' for i in range(4)]
filters += ['[v0][v1]xfade=transition=fade:duration=1:offset=3,fps=30[x1]', '[x1][v2]xfade=transition=fade:duration=1:offset=6,fps=30[x2]', '[x2][v3]xfade=transition=fade:duration=1:offset=9[out]']
args += ['-filter_complex', ';'.join(filters), '-map', '[out]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', str(root / 'assets/eventos.mp4')]
result = subprocess.run(args, capture_output=True)
if result.returncode:
    raise RuntimeError(result.stderr.decode(errors='replace')[-4000:])
print('Steady 1280x720 30 fps loop generated:', (root / 'assets/eventos.mp4').stat().st_size, 'bytes')
