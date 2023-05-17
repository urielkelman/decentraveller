from PIL import Image
import os

def filename_to_number(filename):
    filename = filename.split('.')[-2]
    filename = filename.split('/')[-1]
    return int(filename)

for facef in os.listdir('faces'):
    for accf in os.listdir('accessories'):
        for overf in os.listdir('overlay'):
            face = Image.open('faces/'+facef).convert('RGBA')
            acc = Image.open('accessories/'+accf).convert('RGBA')
            over = Image.open('overlay/'+overf).convert('RGBA')
            face = Image.alpha_composite(face, acc)
            face = Image.alpha_composite(face, over)
            face = face.resize((309, 309))
            final = Image.new("RGB", (309, 309), (69, 113, 78))
            final.paste(face, (0,0), face)
            final.save(f'outs/{filename_to_number(facef)}_{filename_to_number(accf)}_{filename_to_number(overf)}.jpg')
