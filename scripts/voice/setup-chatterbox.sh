#!/usr/bin/env bash
# Installiert Chatterbox Multilingual (Resemble AI, MIT-Lizenz) als lokale, kostenlose Sprachsynthese.
# CPU-Version von PyTorch (keine Grafikkarte nötig). Das Modell (≈ 3 GB) lädt beim ersten Lauf von Hugging Face.
#
#   bash scripts/voice/setup-chatterbox.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VENV="${CHATTERBOX_VENV:-$ROOT/.cache/chatterbox-venv}"
TORCH_INDEX="${TORCH_INDEX:-https://download.pytorch.org/whl/cpu}"

if [ -x "$VENV/bin/python" ] && "$VENV/bin/python" -c "import chatterbox" 2>/dev/null; then
	echo "✔ Chatterbox bereits installiert: $VENV"
	exit 0
fi

PY="${PYTHON:-python3}"
echo "→ Erzeuge Python-Umgebung $VENV ($($PY --version))"
"$PY" -m venv "$VENV"
"$VENV/bin/python" -m pip install --quiet --upgrade pip
echo "→ Installiere PyTorch (CPU) …"
"$VENV/bin/python" -m pip install --quiet "torch==2.6.0" "torchaudio==2.6.0" --index-url "$TORCH_INDEX"
echo "→ Installiere chatterbox-tts …"
"$VENV/bin/python" -m pip install --quiet "chatterbox-tts==0.1.7" --extra-index-url "$TORCH_INDEX"
"$VENV/bin/python" -c "import chatterbox, torch; print('✔ Chatterbox bereit · torch', torch.__version__)"
