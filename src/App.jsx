import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, Layers3, Minimize, Presentation } from 'lucide-react'
import { reports } from './data/reports.js'
import { ClosingSlide, CoverSlide, DetailSlide } from './components/Slides.jsx'

function readInitialState(report) {
  const params = new URLSearchParams(window.location.search)
  const requested = Number(params.get('slide'))
  const max = report.slides.length + 1
  return Number.isFinite(requested) ? Math.min(Math.max(requested, 0), max) : 0
}

function App() {
  const [reportId, setReportId] = useState(() => new URLSearchParams(window.location.search).get('week') ?? reports[0].id)
  const report = reports.find((item) => item.id === reportId) ?? reports[0]
  const [current, setCurrent] = useState(() => readInitialState(report))
  const [isFullscreen, setIsFullscreen] = useState(false)

  const pages = useMemo(() => [
    { id: 'cover', node: <CoverSlide report={report} /> },
    ...report.slides.map((item) => ({ id: item.id, node: <DetailSlide slide={item} /> })),
    { id: 'closing', node: <ClosingSlide report={report} /> },
  ], [report])

  const goTo = useCallback((index) => {
    setCurrent(Math.min(Math.max(index, 0), pages.length - 1))
  }, [pages.length])

  useEffect(() => {
    const onKey = (event) => {
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault(); goTo(current + 1)
      }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault(); goTo(current - 1)
      }
      if (event.key === 'Home') goTo(0)
      if (event.key === 'End') goTo(pages.length - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo, pages.length])

  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('week', report.id)
    url.searchParams.set('slide', String(current))
    window.history.replaceState({}, '', url)
  }, [current, report.id])

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  }

  const changeReport = (event) => {
    setReportId(event.target.value)
    setCurrent(0)
  }

  return (
    <main className="presentation-shell">
      <header className="topbar">
        <div className="brand"><span>LAB</span><strong>ON</strong><i /></div>
        <div className="report-selector">
          <Layers3 size={15} />
          <select value={report.id} onChange={changeReport} aria-label="Selecionar semana">
            {reports.map((item) => <option key={item.id} value={item.id}>Semana {item.sequence} · {item.period}</option>)}
          </select>
        </div>
        <div className="topbar-meta"><Presentation size={15} /><span>Weekly report</span></div>
      </header>

      <section className="stage" aria-live="polite">
        <div className="slide-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {pages.map((page, index) => (
            <div className="slide-page" key={page.id} aria-hidden={index !== current}>{page.node}</div>
          ))}
        </div>
      </section>

      <footer className="controls">
        <div className="progress-cluster">
          <span className="counter"><strong>{String(current + 1).padStart(2, '0')}</strong> / {String(pages.length).padStart(2, '0')}</span>
          <div className="progress-track"><i style={{ width: `${((current + 1) / pages.length) * 100}%` }} /></div>
        </div>
        <nav className="dot-nav" aria-label="Navegação dos slides">
          {pages.map((page, index) => (
            <button key={page.id} className={index === current ? 'active' : ''} onClick={() => goTo(index)} aria-label={`Ir para o slide ${index + 1}`} />
          ))}
        </nav>
        <div className="control-buttons">
          <button onClick={toggleFullscreen} aria-label="Alternar tela cheia">{isFullscreen ? <Minimize size={18} /> : <Expand size={18} />}</button>
          <span className="control-divider" />
          <button onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Slide anterior"><ChevronLeft size={21} /></button>
          <button className="next-button" onClick={() => goTo(current + 1)} disabled={current === pages.length - 1} aria-label="Próximo slide"><ChevronRight size={21} /></button>
        </div>
      </footer>
    </main>
  )
}

export default App
