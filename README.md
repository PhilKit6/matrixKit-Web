MatrixKit-Web

MatrixKit-Web is a browser-based LED-matrix sandbox.Type equations, watch pixels dance, export the madness to your Cosmic Unicorn, all without installing anything.

What it does

Real-time 32 × 32 LED simulation in the browser

Accepts Python-style equations using x, y, t

One-click export to a MicroPython script for Pimoroni Cosmic Unicorn

Converts browser chaos into hardware chaos (with only a little smoke)

How to play

Open https://philkit6.github.io/matrixKit-Web/.

Enter equations like:

r = 255 * Math.sin((x + t) * 0.1)
g = 0
b = 0

Hit Submit to preview.

Hit Export to download a .py file you can copy straight to your Unicorn via Thonny.

No build step, no flashing firmware every 30 seconds, no regrets (well, fewer regrets).

Roadmap

Frame-by-frame export

UI slider for STEP

Equation gallery / history

Fewer ways to crash MicroPython (stretch goal)

Known problems

Divide-by-zero → instant void

Refreshing the page nukes your masterpiece

MicroPython occasionally yeets a MemoryError for reasons™

eval() everywhere — yes, I know

Built During

Late-night caffeine binges, mild existential dread, and an irresistible urge to make tiny lights do big things.

Updates & Stories

Subscribe to the build log and project updates at After Hours Builds.

License

MIT — fork it, fix it, break it, just don’t point the blame at the blinking pixels.


