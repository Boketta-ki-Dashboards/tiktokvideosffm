"""
Chatterbox-Worker: lädt das Modell EINMAL und erzeugt alle Sätze aus einer Job-Datei.
Wird von scripts/voice/chatterbox-tts.mjs aufgerufen – nicht direkt nötig.

  python chatterbox_worker.py --jobs jobs.json --ref voices/thorsten-cc0-ref.flac --out <ordner>

Chatterbox (Resemble AI) – MIT-Lizenz, läuft lokal auf CPU/GPU, keine API, kein Key.
"""
import argparse
import json
import sys
import time

import torch
import torchaudio

# Chatterbox speichert Gewichte teils mit CUDA-Gerät → auf CPU-Rechnern umleiten
_orig_load = torch.load


def _load(*args, **kwargs):
    if not torch.cuda.is_available():
        kwargs["map_location"] = torch.device("cpu")
    return _orig_load(*args, **kwargs)


torch.load = _load

from chatterbox.mtl_tts import ChatterboxMultilingualTTS  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--jobs", required=True)
    ap.add_argument("--ref", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--language", default="de")
    ap.add_argument("--exaggeration", type=float, default=0.7)
    ap.add_argument("--cfg", type=float, default=0.3)
    ap.add_argument("--temperature", type=float, default=0.8)
    args = ap.parse_args()

    device = "cuda" if torch.cuda.is_available() else "cpu"
    torch.set_num_threads(max(1, torch.get_num_threads()))
    t0 = time.time()
    model = ChatterboxMultilingualTTS.from_pretrained(device=device)
    print(f"Modell geladen ({device}) in {time.time() - t0:.1f} s", flush=True)

    jobs = json.load(open(args.jobs, encoding="utf-8"))
    for job in jobs:
        torch.manual_seed(int(job.get("seed", 0)))
        t1 = time.time()
        wav = model.generate(
            job["text"],
            language_id=args.language,
            audio_prompt_path=args.ref,
            exaggeration=args.exaggeration,
            cfg_weight=args.cfg,
            temperature=args.temperature,
        )
        torchaudio.save(f"{args.out}/{job['id']}.wav", wav, model.sr)
        print(f"  {job['id']:<12} {wav.shape[-1] / model.sr:5.2f} s Audio in {time.time() - t1:5.1f} s", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
