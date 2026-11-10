# Mídias do fluxo de Materiais e estoque

Capturadas em 10/11/2026 para a apresentação encerrada em 11/11/2026.

## Procedência

Interface real do LabOn, commit `09d9b419d2df21cbc3c27e0704fa90d9ef621777`, compilada para produção e servida localmente. As chamadas de API foram interceptadas por um cenário sintético em memória. O serviço Docker não ficou disponível na preparação. Nenhum estoque ou conta de produção foi alterado.

O cenário mostra uma Administradora de demonstração cadastrando uma vidraria, consultando seu detalhe e alterando quantidade, mínimo e localização. A quantidade inicial é 10 e a final simulada é 12. Os dados institucionais são demonstrativos e o e-mail usa `example.invalid`.

As seis imagens e suas rotas, etapas e hashes constam em [capturas.json](capturas.json). O [roteiro](../../reports/2026-11-11/fluxo-materiais.md) descreve os contratos e limites.

## Animação

`fluxo-materiais.gif` reúne os seis PNGs em sequência, com 2,2 segundos por quadro. É uma sequência animada de capturas, não vídeo contínuo. O player da apresentação exige reprodução explícita e oferece Parar GIF; os PNGs podem ser ampliados.

## Reproduzir

Com o frontend de produção local em `http://127.0.0.1:4173` e `LAB_SOLOS_ROOT` apontando para a cópia usada:

```bash
node scripts/capture-2026-11-11.mjs
python scripts/animate-2026-11-11.py
```

Não execute o roteiro contra produção. O script recusa endereços fora de localhost/127.0.0.1 e não contém credenciais reais.
