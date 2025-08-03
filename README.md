# MatrixKit‑Web 

<img width="800" height="600" alt="image" src="https://github.com/user-attachments/assets/56c9915f-462d-4eae-ba38-356d5e455db4" />

> *NOTE: Only tested on the original Cosmic Unicorn NOT Pico 2 W

Design LED madness for Pimoroni’s **Cosmic Unicorn** without ever leaving your browser (or burning your eyebrows).

**Click & play → <https://philkit6.github.io/matrixKit-Web/>**  ← zero installs, zero guilt.

---

## Quick tour (60 sec)
| What | How |
|------|-----|
| ⚡ Fire it up | Open the link; a 512‑pixel grid blinks expectantly. |
| 🎨 Make pixels | Type an expression for **r / g / b**, smack **SUBMIT**. |
| 🧽 Regret things | **CLEAR** nukes your sins. |
| 🚀 Ship to Pico | **EXPORT** → `unicorn_export.py` → drag into Thonny → rename `main.py` → Profit. |

**Pro‑tip:** Break things fearlessly; F5 is cheaper than replacement LEDs.

---

## Expression cheat‑sheet

| Expression | Visual sanity check |
|------------|--------------------|
| `128` | Steady grey (“did I crash?”) |
| `255 if x == y else 0` | Bright diagonal |
| `255 if ((x + y) % 2 == 0) else 0` | Checkerboard |
| `255 * sin((y + t)*0.5)` | Horizontal wave |

If expression turns the grid black → You found a parser edge case. Congrats, open an issue so I can procrastinate.

---
### Supported Expressions

| **Type** | **Example** | **Will It Work?** | **Why It Works** |
|----------|-------------|-------------------|------------------|
| Math operations | `sin(x + t)` | ✅ | Recognized and translated to `Math.sin(x + t)` |
| Conditionals (Python-style) | `255 if x < 10 else 0` | ✅ | Transformed to JS ternary: `(x < 10) ? (255) : (0)` |
| Chained comparisons | `10 <= x <= 20` | ✅ | Becomes `(x >= 10) && (x <= 20)` |
| Constants | `pi`, `e` | ✅ | Rewritten as `PI`, `E` for math.js |
| Time-based animation | `128 + 127 * sin(t)` | ✅ | `t` is a changing variable in the scope |
| Offset variable | `x + off` | ✅ | `off` is defined and passed in scope |
| Composite expressions | `(sin(x / 3 + t) + cos(y / 3)) * 127 + 128` | ✅ | All components are supported |

---

### Unsupported or Problematic Expressions

| **Type** | **Example** | **Will It Work?** | **Why It Fails or Breaks** |
|----------|-------------|-------------------|-----------------------------|
| Python functions not aliased | `math.sin(x)` | ❌ | `math.` prefix is not stripped by `pyToJs()` |
| List or array literals | `[255, 0, 0]` | ❌ | Not valid for math.js scalar expressions |
| Assignment | `a = x + y` | ❌ | `math.compile()` doesn't support assignment |
| Multi-line expressions | (Line break in input) | ❌ | Treated as syntax error by `math.compile()` |
| Chained ternaries | `255 if x < 10 else 128 if y < 10 else 0` | ❌ | Only single ternary pattern is transformed properly |
| Undefined vars | `x + y + z` | ⚠️ | `z` is not in scope — will cause runtime error |
| Functions like `floor` without `math.` prefix on Pico | `floor(x / 5)` | ✅ in browser, ❌ on Pico | JS side works, but export expects `math.floor` |

---

### Partial Support

| **Type** | **Example** | **Will It Work?** | **Notes** |
|----------|-------------|-------------------|-----------|
| Math functions without namespace | `sqrt(x)` | ✅ | Works due to math.js, but watch out for export compatibility |
| Mixed ternary and logic | `255 if x > 5 or y > 5 else 0` | ✅ | Supported after transformation |
| Bitwise or binary ops | `x & 15` | ⚠️ | May work in math.js, but not officially tested |
| Modulo | `x % 5` | ✅ | Supported in math.js and JS |

### Speed vs memory
| Knob | Faster? | RAM? | Looks? |
|------|---------|------|--------|
| `STEP ↑` | ✅ | ✅ | Pixelated Minecraft chic |
| `QUANT ↑` | ↔︎ | ✅ | Slight colour banding |

Suggested sweet‑spot → `STEP = 2`, `QUANT = 8` → 50‑60 fps, ~1 k pens.

---

## Things that will hurt you
* Only single‑line expressions — loops & imports need their own stunt‑ double branch.
* Huge colour gamut on full‑res grid → `MemoryError`.  Raise `QUANT`, lower `STEP`, breathe.
* Math.js parser isn’t Python’s.  If it yells, wrap conditions in `()` or swap `<=` chains to explicit `and`s.

---

## Roadmap 🛣️  (a.k.a. The TODO pile)
| Idea | ETA | % Certain |
|------|-----|-----------|
| WebUSB → flash Pico direct | 2026ish | 40 % |
| AI that writes cooler equations than me | never | 5 % |

PRs welcome — bonus points for memes in commit messages.

---


