import cv2
import numpy as np

# Let's inspect the differences between Sec 0, Sec 4, Sec 8, Sec 10
# Is there an on-screen text in any of the corners?
# Let's check the bottom text of hq_02.0s.jpg, hq_06.0s.jpg, hq_10.0s.jpg
for s in [2, 6, 10]:
    img = cv2.imread(f'C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/lock_and_roll_rec/hq_{s:04.1f}s.jpg')
    # Save the bottom 15% of the frame where subtitles or text usually appear
    h, w, _ = img.shape
    subtitle = img[int(h*0.80):h, :]
    cv2.imwrite(f'C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/lock_and_roll_rec/sub_{s:02d}s.jpg', subtitle)
    # Also top 15%
    header = img[0:int(h*0.20), :]
    cv2.imwrite(f'C:/Users/Pat/.gemini/antigravity/brain/44761d27-8779-4853-a6c0-110aa2113235/lock_and_roll_rec/head_{s:02d}s.jpg', header)
print("Saved headers and subtitles")

