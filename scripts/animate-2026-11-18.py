"""Gera o GIF do fluxo 4 a partir das capturas reais da interface local."""
import hashlib
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
assets = root / "public" / "screenshots" / "2026-11-18"
manifest_path = assets / "capturas.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
sources = [
    "consulta-01-catalogo.png",
    "consulta-02-detalhe.png",
    "consulta-03-historico.png",
    "consulta-04-alertas.png",
]
known = {capture["arquivo"] for capture in manifest["capturas"]}
if not set(sources).issubset(known):
    raise SystemExit("As quatro capturas do fluxo precisam existir no manifesto.")

frames = []
for source in sources:
    with Image.open(assets / source) as capture:
        frame = capture.convert("RGB")
        frame.thumbnail((1120, 778), Image.Resampling.LANCZOS)
        frames.append(frame.quantize(colors=192))

destination = assets / "fluxo-consulta.gif"
frames[0].save(
    destination,
    save_all=True,
    append_images=frames[1:],
    duration=2200,
    loop=0,
    disposal=2,
    comment=b"LabOn Presentation. Capturas da interface local, APIs simuladas e dados sinteticos. Consulte README.md e capturas.json.",
)
animation = {
    "arquivo": destination.name,
    "quadros": sources,
    "duracaoPorQuadroMs": 2200,
    "origem": "Sequência animada de capturas da interface local; não é vídeo contínuo nem execução real de backend.",
    "sha256": hashlib.sha256(destination.read_bytes()).hexdigest(),
}
manifest["animacoes"] = [animation]
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

readme_path = assets / "README.md"
readme = readme_path.read_text(encoding="utf-8")
readme += "\n## GIF\n\n`fluxo-consulta.gif` percorre as quatro capturas em sequência, com 2,2 segundos por quadro. É uma animação de prints, não um vídeo contínuo.\n"
readme_path.write_text(readme, encoding="utf-8")
print(f"{destination.name}: {len(frames)} quadros, {destination.stat().st_size} bytes")
