import { ImagePlus } from 'lucide-react'
import { useState } from 'react'

export function ScreenshotFrame({ image }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`screenshot-frame screenshot-frame--${image.position ?? 'center'}`}>
      {!failed && (
        <a className="screenshot-link" href={image.src} target="_blank" rel="noreferrer" aria-label={`Ampliar: ${image.alt}`}>
          <img
            src={image.src}
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
    </div>
  )
}
