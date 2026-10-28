"""Count spacing values (padding/margin/gap, px) not on a 4px grid in a project's CSS and inline styles.
Usage: python3 -I offscale.py <project-dir>"""
import re, sys
from pathlib import Path
root = Path(sys.argv[1])
text = "\n".join(p.read_text(encoding="utf-8") for p in root.rglob("*") if p.suffix in {".css", ".html"})
bad = []
for prop, val in re.findall(r"\b((?:padding|margin|gap|row-gap|column-gap)(?:-[a-z]+)?)\s*:\s*([^;}\"]+)", text):
    for px in re.findall(r"(\d+(?:\.\d+)?)px", val):
        if float(px) % 4 != 0:
            bad.append(f"{prop}: {px}px")
print(f"offscale={len(bad)}")
for b in bad: print(" ", b)
