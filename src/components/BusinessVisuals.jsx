import { ArrowDown } from 'lucide-react'

export function FlowDiagram({ flow }) {
  return (
    <figure className="business-flow" aria-label={flow.title}>
      <figcaption>{flow.title}</figcaption>
      <ol>
        {flow.rows.map((row, index) => (
          <li key={row.nodes.map(node => node.title).join('-')}>
            {index > 0 && <ArrowDown className="business-flow__connector" size={20} aria-hidden="true" />}
            {row.label && <p className="business-flow__branch-label">{row.label}</p>}
            {row.nodes.length > 2 && <p className="business-flow__alternatives">Uma das respostas possíveis</p>}
            <div className={`business-flow__row${row.nodes.length > 2 ? ' business-flow__row--alternatives' : ''}`} style={{ '--flow-columns': row.nodes.length }} role={row.nodes.length > 1 ? 'group' : undefined} aria-label={row.nodes.length > 1 ? 'Alternativas de decisão' : undefined}>
              {row.nodes.map(node => (
                <div className={`business-flow__node${node.terminal ? ' business-flow__node--terminal' : ''}`} key={node.title}>
                  {node.actor && <span>{node.actor}</span>}
                  <strong>{node.title}</strong>
                  {node.detail && <p>{node.detail}</p>}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      {flow.note && <p className="business-flow__note">{flow.note}</p>}
    </figure>
  )
}

export function BusinessTable({ table }) {
  return (
    <div className="business-table-wrap">
      <table className="business-table">
        <caption>{table.title}</caption>
        <thead><tr>{table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0
          ? <th scope="row" key={index}>{cell}</th>
          : <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table>
      {table.note && <p className="business-table__note">{table.note}</p>}
    </div>
  )
}
