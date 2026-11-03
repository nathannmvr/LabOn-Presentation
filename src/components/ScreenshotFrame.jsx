import { ImagePlus, Play, Square } from 'lucide-react'
import { useState } from 'react'

export function ScreenshotFrame({ image }) {
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)

  return (
    <div className={`screenshot-frame screenshot-frame--${image.position ?? 'center'}`}>
      {!failed && (
        <a className="screenshot-link" href={image.src} target="_blank" rel="noreferrer" aria-label={`Ampliar: ${image.alt}`}>
          <img
            src={image.animated && !playing ? image.poster : image.src}
            alt={image.alt}
            onError={() => setFailed(true)}
          />
        </a>
      )}
      {failed && (
        <div className="screenshot-placeholder">
          <span className="screenshot-placeholder__icon"><ImagePlus size={24} strokeWidth={1.7} /></span>
          <span className="screenshot-placeholder__label">{image.label}</span>
          <strong>{image.hint}</strong>
          <small>Adicione a imagem em public{image.src.slice(0, image.src.lastIndexOf('/') + 1)}</small>
        </div>
      )}
      <div className="browser-chrome" aria-hidden="true">
        <span /><span /><span />
      </div>
      {image.animated && !failed && (
        <button className="gif-control" type="button" onClick={() => setPlaying(value => !value)} aria-pressed={playing}>
          {playing ? <Square size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {playing ? 'Parar GIF' : 'Reproduzir GIF'}
        </button>
      )}
    </div>
  )
}
