const canvas = document.getElementById("ledCanvas");
const ctx = canvas.getContext("2d");
const width = 32;
const height = 32;
const pixelSize = canvas.width / width;
let t = 0;
let rExpr = document.getElementById("rInput").value;
let gExpr = document.getElementById("gInput").value;
let bExpr = document.getElementById("bInput").value;

function drawMatrix() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r, g, b;
      try {
        r = clamp(eval(rExpr));
        g = clamp(eval(gExpr));
        b = clamp(eval(bExpr));
      } catch {
        r = g = b = 0;
      }
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
  t += 0.1;
}

function clamp(val) {
  return Math.max(0, Math.min(255, parseInt(val)));
}

document.getElementById("submitBtn").onclick = () => {
  rExpr = document.getElementById("rInput").value;
  gExpr = document.getElementById("gInput").value;
  bExpr = document.getElementById("bInput").value;
};

document.getElementById("clearBtn").onclick = () => {
  document.getElementById("rInput").value = "0";
  document.getElementById("gInput").value = "0";
  document.getElementById("bInput").value = "0";
  rExpr = gExpr = bExpr = "0";
};

document.getElementById("exportBtn").onclick = () => {
  const pyScript = `
import time
from cosmic_unicorn import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN

cu = CosmicUnicorn()
graphics = PicoGraphics(display=DISPLAY_COSMIC_UNICORN)
cu.set_brightness(0.5)

WIDTH, HEIGHT = cu.WIDTH, cu.HEIGHT

def compute_color(x, y, t):
    try:
        r = ${rExpr.replace(/Math\./g, "math.")}
        g = ${gExpr.replace(/Math\./g, "math.")}
        b = ${bExpr.replace(/Math\./g, "math.")}
    except:
        r = g = b = 0
    return max(0, min(255, int(r))), max(0, min(255, int(g))), max(0, min(255, int(b)))

t = 0
while True:
    for y in range(HEIGHT):
        for x in range(WIDTH):
            r, g, b = compute_color(x, y, t)
            cu.set_pixel(x, y, r, g, b)
    cu.update()
    t += 0.1
    time.sleep(0.03)
  `;
  const blob = new Blob([pyScript], { type: "text/x-python" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "export.py";
  a.click();
};

setInterval(drawMatrix, 33);