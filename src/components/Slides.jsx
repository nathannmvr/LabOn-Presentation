import { ArrowRight, Check, ExternalLink, GitBranch, Sparkles } from 'lucide-react'
import { ScreenshotFrame } from './ScreenshotFrame.jsx'

function EvidencePanel({ evidence }) {
  return (
    <div className="evidence-panel">
      <div className="evidence-panel__topline">
        <span>{evidence.badge}</span>
        {evidence.href && (
          <a href={evidence.href} target="_blank" rel="noreferrer" aria-label={`Abrir evidência: ${evidence.badge}`}>
            Ver no GitHub <ExternalLink size={14} />
          </a>
        )}
      </div>
      <div className="evidence-panel__metric">
        <strong>{evidence.headline}</strong>
        <span>{evidence.subheadline}</span>
      </div>
      <div className="evidence-panel__items">
        {evidence.items.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <p>{evidence.footer}</p>
    </div>
  )
}

export function CoverSlide({ report }) {
  return (
    <article className="slide slide--cover">
      <div className="cover-grid" aria-hidden="true" />
      <div className="cover-orbit cover-orbit--one" aria-hidden="true" />
      <div className="cover-orbit cover-orbit--two" aria-hidden="true" />
      <div className="cover-copy">
        <span className="eyebrow"><Sparkles size={14} /> {report.eyebrow}</span>
        <p className="period">{report.period}</p>
        <h1>{report.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
        <p className="cover-summary">{report.summary}</p>
      </div>
      <div className="cover-stats">
        {report.stats.map((stat) => (
          <div className="cover-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.detail}</small>
          </div>
        ))}
      </div>
      <div className="cover-mark" aria-hidden="true"><span>ON</span></div>
    </article>
  )
}

export function DetailSlide({ slide }) {
  const Icon = slide.icon
  return (
    <article className={`slide slide--detail accent-${slide.accent}`}>
      <div className="slide-copy">
        <div className="slide-kicker">
          <span className="slide-index">{slide.index}</span>
          <span>{slide.section}</span>
        </div>
        <span className="feature-icon"><Icon size={25} strokeWidth={1.8} /></span>
        <h2>{slide.title}</h2>
        <p className="slide-description">{slide.description}</p>

        {slide.metric && (
          <div className="metric-flow">
            <span>{slide.metric.before}</span>
            <ArrowRight size={25} />
            <strong>{slide.metric.after}</strong>
            <small>{slide.metric.label}</small>
          </div>
        )}

        <ul className="point-list">
          {slide.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}
        </ul>

        {slide.automation && (
          <div className="automation-note">
            <span><GitBranch size={17} /></span>
            <div><strong>{slide.automation.label}</strong><p>{slide.automation.text}</p></div>
          </div>
        )}
      </div>
      <div className="slide-visual">
        {slide.evidence ? <EvidencePanel evidence={slide.evidence} /> : <ScreenshotFrame image={slide.image} />}
        <span className="visual-caption"><i /> Evidência verificável da entrega</span>
      </div>
    </article>
  )
}

export function ClosingSlide({ report }) {
  return (
    <article className="slide slide--closing">
      <div className="closing-message">
        <h2>{report.closing.title}</h2>
        <span className="closing-rule" />
      </div>
      <div className="closing-footer"><span>LAB</span><strong>ON</strong><i /></div>
    </article>
  )
}
