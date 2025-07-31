const canvas = document.getElementById("ledCanvas");
const ctx = canvas.getContext("2d");
const LED_COUNT = 32;
const width = 32, height = 32;
const pixelSize = canvas.width / LED_COUNT;  // 640 / 32 = 20

let t = 0;

const rInput = document.getElementById("r-input");
const gInput = document.getElementById("g-input");
const bInput = document.getElementById("b-input");
const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");
const exportBtn = document.getElementById("export");

let rExpr = rInput.value;
let gExpr = gInput.value;
let bExpr = bInput.value;

function preprocessPythonStyle(expr) {
  return expr
    .replace(/math\./gi, 'Math.')
    .replace(/\bint\(/g, 'Math.floor(')
    .replace(/\babs\(/g, 'Math.abs(')
    .replace(/\bround\(/g, 'Math.round(')
    .replace(/\bmin\(/g, 'Math.min(')
    .replace(/\bmax\(/g, 'Math.max(');
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let scope = { x, y, t };
      let r = 0, g = 0, b = 0;
      try {
        r = Math.max(0, Math.min(255, eval(preprocessPythonStyle(rExpr))));
        g = Math.max(0, Math.min(255, eval(preprocessPythonStyle(gExpr))));
        b = Math.max(0, Math.min(255, eval(preprocessPythonStyle(bExpr))));
      } catch (e) {
        r = g = b = 0;
      }

      // Fill the LED
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

      // Optional: draw subtle grid for LED separation
      ctx.strokeStyle = "#111";
      ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
  t += 0.1;
  requestAnimationFrame(draw);
}

submitBtn.onclick = () => {
  rExpr = rInput.value;
  gExpr = gInput.value;
  bExpr = bInput.value;
};

clearBtn.onclick = () => {
  rInput.value = gInput.value = bInput.value = "0";
  rExpr = gExpr = bExpr = "0";
};

exportBtn.onclick = () => {
  let code = `
from cosmic_unicorn import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN
import time, math

cu = CosmicUnicorn()
graphics = PicoGraphics(display=DISPLAY_COSMIC_UNICORN)
WIDTH, HEIGHT = cu.WIDTH, cu.HEIGHT
cu.set_brightness(0.5)

def compute_color(x, y, t):
    try:
        r = ${rInput.value.replace(/math\./gi, '').replace(/Math\./g, '')}
        g = ${gInput.value.replace(/math\./gi, '').replace(/Math\./g, '')}
        b = ${bInput.value.replace(/math\./gi, '').replace(/Math\./g, '')}
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
  const blob = new Blob([code], { type: 'text/plain' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "cosmic_unicorn_export.py";
  a.click();
};

draw();
