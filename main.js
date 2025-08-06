;(function(){
  const canvas    = document.getElementById("ledCanvas");
  const ctx       = canvas.getContext("2d");
  const width     = 32, height = 32;
  const pixelSize = canvas.width / width;

  let t = 0;
  const rInput = document.getElementById("r-input");
  const gInput = document.getElementById("g-input");
  const bInput = document.getElementById("b-input");
  const submitBtn = document.getElementById("submit");
  const clearBtn  = document.getElementById("clear");
  const exportBtn = document.getElementById("export");
  const statusMsg = document.getElementById("statusMsg");
  const errorMsg  = document.getElementById("errorMsg");

  // Helper: convert Python-ish to JS math.js syntax
 function pyToJs(expr) {
  return expr
    // 1) Expand chained comparisons A <= B <= C  →  (B >= A) && (B <= C)
    .replace(
      /([^\s<>=!]+)\s*<=\s*([^\s<>=!]+)\s*<=\s*([^\s<>=!]+)/g,
      '($2 >= $1) && ($2 <= $3)'
    )
    // 2) Convert Python ternary A if cond else B → (cond) ? (A) : (B)
    .replace(
      /(.+?)\s+if\s+(.+?)\s+else\s+(.+)/g,
      '($2) ? ($1) : ($3)'
    )
    // 3) Boolean ops
    .replace(/\band\b/g, '&&')
    .replace(/\bor\b/g,  '||')
    .replace(/\bnot\b/g, '!')
    .replace(/\^/g, '**')
    // 4) Constants
    .replace(/\bpi\b/g, 'PI')
    .replace(/\be\b/g,  'E')
    ;
}

  function clamp(v){ return Math.max(0, Math.min(255, Math.floor(v))); }

  // Compile placeholders
  let rFn = () => 0, gFn = () => 0, bFn = () => 0;

  // On Submit: compile with math.js
  submitBtn.addEventListener("click", ()=>{
    statusMsg.textContent = errorMsg.textContent = "";
    try {
      const rExpr = pyToJs(rInput.value);
      const gExpr = pyToJs(gInput.value);
      const bExpr = pyToJs(bInput.value);
      rFn = math.compile(rExpr);
      gFn = math.compile(gExpr);
      bFn = math.compile(bExpr);
      statusMsg.textContent = "Compiled ✓";
    } catch(e) {
      errorMsg.textContent = "Error: " + e.message;
    }
  });

  clearBtn.addEventListener("click", ()=>{
    rInput.value = gInput.value = bInput.value = "0";
    rFn = ()=>0; gFn = ()=>0; bFn = ()=>0;
    statusMsg.textContent = errorMsg.textContent = "";
  });

  exportBtn.addEventListener("click", ()=>{
    // convert back to Python syntax
    const toPy = s => s
      .replace(/PI/g, 'math.pi')
      .replace(/E/g, 'math.e')
      .replace(/and/g, 'and')
      .replace(/or/g, 'or');

    const pyR = toPy(rInput.value);
    const pyG = toPy(gInput.value);
    const pyB = toPy(bInput.value);

    const pyScript = `import time, math, machine
from cosmic import CosmicUnicorn
from picographics import PicoGraphics, DISPLAY_COSMIC_UNICORN
from math import sin, cos, floor

# ─── Hardware setup ───────────────────────────────────────────────
machine.freq(250_000_000)                # over-clock (optional)
cu  = CosmicUnicorn()
gfx = PicoGraphics(display=DISPLAY_COSMIC_UNICORN)
W, H = cu.WIDTH, cu.HEIGHT
cu.set_brightness(0.6)

# ─── Your colour equations, pre-compiled as lambdas ───────────────
# Note: use math.sin(), not sin()
code_r = lambda x,y,t,off,math=math: (${pyR})
code_g = lambda x,y,t,off,math=math: (${pyG})
code_b = lambda x,y,t,off,math=math: (${pyB})

# ─── Pen management with quantization ─────────────────────────────
BLACK = gfx.create_pen(0, 0, 0)
pen_cache = {}
STEP = 2   # block size

def quantize(v, step=8):
    """Round v down to nearest multiple of step"""
    return (v // step) * step

def get_pen(r, g, b):
    qr = quantize(r)
    qg = quantize(g)
    qb = quantize(b)
    key = (qr, qg, qb)
    if key not in pen_cache:
        pen_cache[key] = gfx.create_pen(qr, qg, qb)
    return pen_cache[key]

# ─── Main animation loop ──────────────────────────────────────────
t = 0.0
while True:
    off = int(4 * math.sin(t))

    # clear screen once
    gfx.set_pen(get_pen(0, 0, 0))
    gfx.clear()

    # draw in STEP×STEP blocks
    for yy in range(0, H, STEP):
        for xx in range(0, W, STEP):
            r = int(code_r(xx, yy, t, off)) & 255
            g = int(code_g(xx, yy, t, off)) & 255
            b = int(code_b(xx, yy, t, off)) & 255

            gfx.set_pen(get_pen(r, g, b))
            gfx.rectangle(xx, yy, STEP, STEP)

    cu.update(gfx)
    t += 0.15
    time.sleep(0.005)  # keep USB/REPL happy
`;

    const blob = new Blob([pyScript], { type: "text/x-python" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "unicorn_export.py";
    a.click();
  });

  // Animation loop
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const off = Math.floor(4 * Math.sin(t));
    for(let y=0;y<height;y++){
      for(let x=0;x<width;x++){
        const scope = { x, y, t, off };
        let r=g=b=0;
        try {
          r = clamp(rFn.evaluate(scope));
          g = clamp(gFn.evaluate(scope));
          b = clamp(bFn.evaluate(scope));
        } catch {
          r=g=b=0;
        }
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x*pixelSize,y*pixelSize,pixelSize,pixelSize);
      }
    }
    t += 0.1;
    requestAnimationFrame(draw);
  }
  draw();
})();
