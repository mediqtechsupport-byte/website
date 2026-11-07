import cv2
import os

video_path = r"C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/.user_uploaded/media_1793926097613_d827605b.mp4"
output_dir = "scratch/zandrellez_rec_frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)
duration = total_frames / fps if fps > 0 else 0

print(f"Total frames: {total_frames}, FPS: {fps}, Duration: {duration:.2f}s")

# Extract 10-12 key frames across the duration
sample_indices = [int(i * (total_frames - 1) / 10) for i in range(11)]

for idx in sample_indices:
    cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
    ret, frame = cap.read()
    if ret:
        out_name = os.path.join(output_dir, f"frame_{idx:04d}.jpg")
        cv2.imwrite(out_name, frame)
        print(f"Saved {out_name} (frame {idx}/{total_frames})")

cap.release()
print("Done extracting frames!")

