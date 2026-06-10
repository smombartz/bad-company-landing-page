#!/usr/bin/env python3
"""Embed assets/icons/*.svg into styles.css as data URIs.

The SVG files in assets/icons/ are the source of truth — edit them, then
run this script to refresh the CSS. Data URIs are used because Chrome
refuses to load CSS mask images from separate files when a page is opened
directly from disk (file://).

Usage: python3 tools/build-icons.py   (run from the site/ directory)
"""

import re
import sys
from pathlib import Path
from urllib.parse import quote

SITE = Path(__file__).resolve().parent.parent
CSS = SITE / "styles.css"

# Matches:  --icon: url("...");  }  /* src: assets/icons/name.svg */
PATTERN = re.compile(
    r'(--icon: url\(")[^"]*("\); \}\s*/\* src: (assets/icons/[\w-]+\.svg) \*/)'
)


def encode(svg_path: Path) -> str:
    svg = svg_path.read_text().strip()
    svg = re.sub(r">\s+<", "><", svg)  # strip whitespace between tags
    return "data:image/svg+xml," + quote(svg, safe="=:/ '")


def main() -> None:
    css = CSS.read_text()
    missing = []

    def repl(m: re.Match) -> str:
        src = SITE / m.group(3)
        if not src.exists():
            missing.append(m.group(3))
            return m.group(0)
        return m.group(1) + encode(src) + m.group(2)

    updated, count = PATTERN.subn(repl, css)
    if missing:
        sys.exit(f"missing icon files: {', '.join(missing)}")
    CSS.write_text(updated)
    print(f"embedded {count} icons into {CSS.name}")


if __name__ == "__main__":
    main()
