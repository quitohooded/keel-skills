from PIL import Image, ImageDraw, ImageFont

S = 2  # supersample, downscaled at the end for clean antialiasing
W, H = 1600 * S, 900 * S

BG      = (11, 14, 20)
CARD    = (17, 21, 30)
BORDER  = (35, 43, 58)
PROMPT  = (61, 74, 95)
SAFE    = (201, 212, 229)
CHAIN   = (124, 138, 160)
DANGER  = (255, 107, 107)
ALLOW   = (70, 224, 138)

REG  = r"C:\Windows\Fonts\consola.ttf"
BOLD = r"C:\Windows\Fonts\consolab.ttf"

CARD_W  = 1320 * S
PAD_X   = 80 * S
INNER   = CARD_W - PAD_X * 2

segments = [
    ("$ ",                          PROMPT, REG),
    ("npm run build",               SAFE,   REG),
    (" && ",                        CHAIN,  REG),
    ("git push --force origin main", DANGER, BOLD),
]

# Fit the command line to the card's inner width.
size = 46 * S
while size > 10:
    fonts = {p: ImageFont.truetype(p, size) for p in (REG, BOLD)}
    total = sum(fonts[f].getlength(t) for t, _, f in segments)
    if total <= INNER:
        break
    size -= 1

cmd_fonts   = fonts
allow_size  = int(size * 1.35)
f_allow     = ImageFont.truetype(BOLD, allow_size)
f_arrow     = ImageFont.truetype(BOLD, allow_size)  # bold + same size: the thin
                                                    # Consolas arrow disappeared

cmd_h   = size
gap     = int(62 * S)
allow_h = allow_size
# The bold glyph box sits well above its baseline box, so equal numeric padding
# reads bottom-heavy. Trimmed until it looks centred, not until it measures so.
PAD_T, PAD_B = 88 * S, 64 * S
CARD_H = PAD_T + cmd_h + gap + allow_h + PAD_B

img  = Image.new("RGB", (W, H), BG)
d    = ImageDraw.Draw(img)

cx0 = (W - CARD_W) // 2
cy0 = (H - CARD_H) // 2
d.rounded_rectangle([cx0, cy0, cx0 + CARD_W, cy0 + CARD_H],
                    radius=20 * S, fill=CARD, outline=BORDER, width=max(1, S))

# command line
x = cx0 + PAD_X
y = cy0 + PAD_T
for text, colour, fpath in segments:
    f = cmd_fonts[fpath]
    d.text((x, y), text, font=f, fill=colour)
    x += f.getlength(text)

# verdict
y2 = y + cmd_h + gap
d.text((cx0 + PAD_X, y2), "\u2192", font=f_arrow, fill=CHAIN)
d.text((cx0 + PAD_X + f_arrow.getlength("\u2192") + 26 * S, y2), "allow",
       font=f_allow, fill=ALLOW)

img = img.resize((W // S, H // S), Image.LANCZOS)
out = r"C:\estebanaguilar\proyectos\keel-skills\assets\launch-0.6-oneliner.png"
img.save(out, "PNG", optimize=True)
print("wrote", out, img.size, "font", size // S)
