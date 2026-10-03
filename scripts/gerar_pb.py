from PIL import Image

img = Image.open('/home/z/my-project/public/dalila-colorida.png')
pb = img.convert('L')
pb = pb.convert('RGB')
pb.save('/home/z/my-project/public/dalila-pb.png')
print('PB salva:', pb.size)
