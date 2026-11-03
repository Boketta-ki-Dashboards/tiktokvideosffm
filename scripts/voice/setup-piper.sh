#!/usr/bin/env bash
# Installiert die kostenlose, lokal laufende Sprachsynthese Piper (OHF-Voice/piper1-gpl)
# in eine eigene Python-Umgebung und lädt eine deutsche Stimme von Hugging Face.
#
#   bash scripts/voice/setup-piper.sh [stimme]     (Standard: de_DE-thorsten-high)
#
# Lizenz der Standardstimme: Datensatz „Thorsten-Voice“ von Thorsten Müller, CC0 (gemeinfrei).
set -euo pipefail

VOICE="${1:-${PIPER_VOICE:-de_DE-thorsten-high}}"
PIPER_VERSION="${PIPER_VERSION:-1.8.0}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CACHE="${PIPER_CACHE:-$ROOT/.cache}"
VENV="$CACHE/piper-venv"
VOICES="$CACHE/piper-voices"

mkdir -p "$VOICES"

if [ ! -x "$VENV/bin/piper" ]; then
	echo "→ Installiere piper-tts $PIPER_VERSION nach $VENV"
	if python3 -m venv "$VENV" 2>/dev/null; then
		"$VENV/bin/python" -m pip install --quiet --upgrade pip
		"$VENV/bin/python" -m pip install --quiet "piper-tts==$PIPER_VERSION"
	elif command -v uv >/dev/null 2>&1; then
		uv venv "$VENV" -q
		uv pip install --python "$VENV/bin/python" -q "piper-tts==$PIPER_VERSION"
	else
		echo "✖ Weder 'python3 -m venv' noch 'uv' verfügbar." >&2
		exit 1
	fi
fi

# Stimmenname zerlegen: de_DE-thorsten-high → de / de_DE / thorsten / high
LOCALE="${VOICE%%-*}"
REST="${VOICE#*-}"
NAME="${REST%-*}"
QUALITY="${REST##*-}"
LANG_CODE="${LOCALE%%_*}"
BASE="https://huggingface.co/rhasspy/piper-voices/resolve/main/$LANG_CODE/$LOCALE/$NAME/$QUALITY"

for FILE in "$VOICE.onnx" "$VOICE.onnx.json" "MODEL_CARD"; do
	TARGET="$VOICES/$FILE"
	[ "$FILE" = "MODEL_CARD" ] && TARGET="$VOICES/$VOICE.MODEL_CARD"
	if [ ! -s "$TARGET" ]; then
		echo "→ Lade $FILE"
		curl -fsSL --retry 4 --retry-delay 2 -o "$TARGET" "$BASE/$FILE"
	fi
done

echo "✔ Piper bereit: $VENV/bin/piper"
echo "✔ Stimme:      $VOICES/$VOICE.onnx"
echo "--- Modellkarte ---"
cat "$VOICES/$VOICE.MODEL_CARD"
