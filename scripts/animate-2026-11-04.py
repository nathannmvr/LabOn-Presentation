"""Codifica GIFs a partir das capturas reais da interface local, sem redesenhar telas."""
import hashlib
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
assets = root / "public" / "screenshots" / "2026-11-04"
manifest_path = assets / "capturas.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
for capture in manifest["capturas"]:
    capture["sha256"] = hashlib.sha256((assets / capture["arquivo"]).read_bytes()).hexdigest()
animations = []
for prefix, filename in [("acesso-", "fluxo-acesso.gif"), ("emprestimo-", "fluxo-emprestimo.gif")]:
    sources = [item["arquivo"] for item in manifest["capturas"] if item["arquivo"].startswith(prefix)]
    frames = []
    for source in sources:
        with Image.open(assets / source) as capture:
            frame = capture.convert("RGB")
            frame.thumbnail((1120, 778), Image.Resampling.LANCZOS)
            frames.append(frame.quantize(colors=192))
    destination = assets / filename
    frames[0].save(destination, save_all=True, append_images=frames[1:], duration=2200, loop=0, disposal=2,
                   comment=b"LabOn Presentation. Sequencia de capturas da interface atual local. Dados sinteticos e API simulada. Originais e roteiro em capturas.json e README.md.")
    animations.append({"arquivo": filename, "quadros": sources, "duracaoPorQuadroMs": 2200,
                       "origem": "Sequência de capturas de interações da interface local; não é vídeo contínuo nem execução de backend real.",
                       "sha256": hashlib.sha256(destination.read_bytes()).hexdigest()})
    print(f"{filename}: {len(frames)} quadros, {destination.stat().st_size} bytes")
manifest["animacoes"] = animations
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
