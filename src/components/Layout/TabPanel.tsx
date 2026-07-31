import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface TabDefinition {
  id: string
  label: string
  content: ReactNode
}

interface TabPanelProps {
  tabs: TabDefinition[]
}

export function TabPanel({ tabs }: TabPanelProps) {
  const instanceId = useId()
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return
    }

    event.preventDefault()

    let nextIndex = currentIndex

    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    const nextTab = tabs[nextIndex]

    if (nextTab) {
      setActiveTabId(nextTab.id)
      tabRefs.current[nextIndex]?.focus()
    }
  }

  if (!activeTab) {
    return null
  }

  return (
    <div className="tab-panel">
      <div className="tab-list" role="tablist" aria-label="Panel de información">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab.id
          const tabId = `${instanceId}-${tab.id}-tab`
          const panelId = `${instanceId}-${tab.id}-panel`

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className="tab-button"
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        id={`${instanceId}-${activeTab.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${instanceId}-${activeTab.id}-tab`}
        className="tab-content"
      >
        {activeTab.content}
      </div>
    </div>
  )
}
