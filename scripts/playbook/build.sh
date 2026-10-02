#!/usr/bin/env bash
# Build public/plus-none-playbook.pdf from the source HTML in this folder.
#
# Uses the system Chrome in headless mode to render the HTML to a
# print-sized PDF. Fonts are pulled from Google Fonts at render time
# (needs internet). The source HTML is intentionally one file with
# inline CSS so there's no toolchain beyond Chrome.
#
# Run from the repo root:   bash scripts/playbook/build.sh
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/playbook.html"
OUT="$HERE/../../public/plus-none-playbook.pdf"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

if [[ ! -x "$CHROME" ]]; then
  echo "Chrome not found at $CHROME — install Chrome or edit this script to point at Chromium." >&2
  exit 1
fi

# Give Google Fonts a moment to settle before snapshotting.
"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf-no-header \
  --print-to-pdf="$OUT" \
  "file://$SRC" \
  >/dev/null 2>&1

echo "Wrote $OUT ($(wc -c <"$OUT") bytes)"
