# MatrixKit‑Web (a.k.a. “32×32 Light‑Sabotage Simulator”)

> *“If it works first try you aimed too low.”* — Me, after 6 blown MOSFETs ⚡️

Design LED madness for Pimoroni’s **Cosmic Unicorn** without ever leaving your browser (or burning your eyebrows).

**Click & play → <https://philkit6.github.io/matrixKit-Web/>**  ← zero installs, zero guilt.

---

## 1  Quick tour (60 sec)
| What | How |
|------|-----|
| ⚡ Fire it up | Open the link; a 512‑pixel grid blinks expectantly. |
| 🎨 Make pixels | Type an expression for **r / g / b**, smack **SUBMIT**. |
| 🧽 Regret things | **CLEAR** nukes your sins. |
| 🚀 Ship to Pico | **EXPORT** → `unicorn_export.py` → drag into Thonny → rename `main.py` → Profit. |

**Pro‑tip:** Break things fearlessly; F5 is cheaper than replacement LEDs.

---

## 2  Expression cheat‑sheet
* Vars → `x`, `y`, `t`.
* Maths → `+ - * / **`, mod `%`, comparisons `== != < <= > >=`.
* Logic → `and`, `or`, `not` (because Python said so).
* Ternary → `A if cond else B` (reads like English, explodes like C).
* Functions → `sin cos tan floor abs sqrt log` — no `math.` prefix.

| Expression | Visual sanity check |
|------------|--------------------|
| `128` | Steady grey (“did I crash?”) |
| `255 if x == y else 0` | Bright diagonal |
| `255 if ((x + y) % 2 == 0) else 0` | Checkerboard |
| `255 * sin((y + t)*0.5)` | Horizontal wave |

If expression turns the grid black → You found a parser edge case. Congrats, open an issue so I can procrastinate.

---


### 3.1 Speed vs memory
| Knob | Faster? | RAM? | Looks? |
|------|---------|------|--------|
| `STEP ↑` | ✅ | ✅ | Pixelated Minecraft chic |
| `QUANT ↑` | ↔︎ | ✅ | Slight colour banding |

Suggested sweet‑spot → `STEP = 2`, `QUANT = 8` → 50‑60 fps, ~1 k pens.

---

## 4  Things that will hurt you
* Only single‑line expressions — loops & imports need their own stunt‑ double branch.
* Huge colour gamut on full‑res grid → `MemoryError`.  Raise `QUANT`, lower `STEP`, breathe.
* Math.js parser isn’t Python’s.  If it yells, wrap conditions in `()` or swap `<=` chains to explicit `and`s.

---

## 5  Roadmap 🛣️  (a.k.a. The TODO pile)
| Idea | ETA | % Certain |
|------|-----|-----------|
| WebUSB → flash Pico direct | 2026ish | 40 % |
| AI that writes cooler equations than me | never | 5 % |

PRs welcome — bonus points for memes in commit messages.

---

## 6  License & attribution
MIT.  Go forth and light stuff on fire (figuratively, please). 

