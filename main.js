const canvas = document.getElementById("ledCanvas");
const ctx = canvas.getContext("2d");

const width = 32;
const height = 32;
const pixelSize = canvas.width / width;

let t = 0;

// Inputs
const rInput = document.getElementById("r-input");
const gInput = document.getElementById("g-input");
const bInput = document.getElementById("b-input");

// Buttons
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
    .replace(/\bmax\(/g, 'Math.max(')
    .replace(/\bpi\b/g, 'Math.PI')
    .replace(/\be\b/g, 'Math.E')
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g, '||')
    .replace(
      /([^?;]+?)\s+if\s+([^?;]+?)\s+else\s+([^?;]+)/g,
      '($2) ? ($1) : ($3)'
    );
}

function clamp(val) {
  return Math.max(0, Math.min(255, parseInt(val)));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let scope = { x, y, t };
      let r = 0, g = 0, b = 0;
      try {
        r = clamp(eval(preprocessPythonStyle(rExpr)));
        g = clamp(eval(preprocessPythonStyle(gExpr)));
        b = clamp(eval(preprocessPythonStyle(bExpr)));
      } catch {
        r = g = b = 0;
      }

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      ctx.strokeStyle = "#111";
      ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }

  t += 0.1;
  requestAnimationFrame(draw);
}

// Event listeners
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
  const eqR = rExpr.replace(/Math\./g, "math.");
  const eqG = gExpr.replace(/Math\./g, "math.");
  const eqB = bExpr.replace(/Math\./g, "math.");

  const pyScript = `import time, math, machine
from cosmic import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN

machine.freq(250_000_000)
cu  = CosmicUnicorn()
gfx = PicoGraphics(display=DISPLAY_COSMIC_UNICORN)
W, H = cu.WIDTH, cu.HEIGHT
cu.set_brightness(0.6)

# ------------ equations-------------
EQ_R = "${eqR}"
EQ_G = "${eqG}"
EQ_B = "${eqB}"
# -------------------------------------------------------------

code_r = eval("lambda x,y,t,off,math=math: " + EQ_R)
code_g = eval("lambda x,y,t,off,math=math: " + EQ_G)
code_b = eval("lambda x,y,t,off,math=math: " + EQ_B)

STEP = 3          # 1=full res, 2=16×16 grid, 4=8×8 grid

BLACK = gfx.create_pen(0, 0, 0)
pen_cache = {}                     # (r,g,b)→ pen id

def quantize(v, step=16):
    return int(v // step) * step

def pen(r, g, b):
    r, g, b = quantize(r), quantize(g), quantize(b)
    key = (r, g, b)
    if key not in pen_cache:
        pen_cache[key] = gfx.create_pen(r, g, b)
    return pen_cache[key]

t = 0.0
while True:
    off = int(4 * math.sin(t))

    gfx.set_pen(BLACK)
    gfx.clear()

    for y in range(0, H, STEP):
        for x in range(0, W, STEP):
            r = int(code_r(x, y, t, off)) & 255
            g = int(code_g(x, y, t, off)) & 255
            b = int(code_b(x, y, t, off)) & 255
            gfx.set_pen(pen(r, g, b))
            gfx.rectangle(x, y, STEP, STEP)     # fill STEP×STEP block

    cu.update(gfx)
    t += 0.15
    time.sleep(0.003)
`;

  const blob = new Blob([pyScript], { type: "text/x-python" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "unicorn_export.py";
  a.click();
};


draw();
