import { useState } from 'react'
import Icon from './Icons'

const arrowDown = <Icon name="chevron-down" size="xs" />
const arrowRight = <Icon name="chevron-right" size="xs" />

export const JsonView = ({ data, level = 0, isDarkMode = true, collapsed, onToggle }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(true)
  
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed
  const handleToggle = (e) => {
    if (e) e.stopPropagation()
    if (onToggle) {
      onToggle(!isCollapsed)
    } else {
      setInternalCollapsed(!isCollapsed)
    }
  }

  if (data === null) return <span className="json-null">null</span>
  if (data === undefined) return <span className="json-null">undefined</span>

  const type = typeof data

  if (type === 'string') return <span className="json-string">"{data}"</span>
  if (type === 'number') return <span className="json-number">{data}</span>
  if (type === 'boolean') return <span className="json-boolean">{String(data)}</span>

  // Arrays
  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>
    
    return (
      <span className="json-view">
        <span onClick={handleToggle} className="json-arrow">
          {isCollapsed ? arrowRight : arrowDown}
        </span>
        {' '}
        {isCollapsed ? (
          <span onClick={handleToggle} className="json-collapsed">
            [{data.length}] Array
          </span>
        ) : (
          <>
            [
            <div className="json-indent">
              {data.map((item, idx) => (
                <div key={idx}>
                  <JsonView data={item} level={level + 1} isDarkMode={isDarkMode} />
                  {idx < data.length - 1 ? ',' : ''}
                </div>
              ))}
            </div>
            ]
          </>
        )}
      </span>
    )
  }

  // Objects
  if (type === 'object') {
    const entries = Object.entries(data)
    if (entries.length === 0) return <span>{'{}'}</span>

    return (
      <span className="json-view">
        <span onClick={handleToggle} className="json-arrow">
          {isCollapsed ? arrowRight : arrowDown}
        </span>
        {' '}
        {isCollapsed ? (
          <span onClick={handleToggle} className="json-collapsed">
            {'{'}{entries.length}{'}'} Object
          </span>
        ) : (
          <>
            {'{'}
            <div className="json-indent">
              {entries.map(([key, value], idx) => (
                <div key={key}>
                  <span className="json-key">"{key}"</span>: <JsonView data={value} level={level + 1} isDarkMode={isDarkMode} />
                  {idx < entries.length - 1 ? ',' : ''}
                </div>
              ))}
            </div>
            {'}'}
          </>
        )}
      </span>
    )
  }

  return <span>{String(data)}</span>
}
