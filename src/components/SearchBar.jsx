import { useState, useEffect, useRef } from 'react'

function SearchBar({ onSearch, disabled }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    setActiveIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value.trim())}&count=5`
        )
        const data = await res.json()
        if (data.results) {
          setSuggestions(data.results)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch {
        setSuggestions([])
      }
    }, 300)
  }

  function selectSuggestion(suggestion) {
    const label = formatSuggestion(suggestion)
    setQuery(label)
    setSuggestions([])
    setShowSuggestions(false)
    onSearch(suggestion.name)
  }

  function handleKeyDown(e) {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      selectSuggestion(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      setShowSuggestions(false)
      onSearch(trimmed)
    }
  }

  function formatSuggestion(s) {
    const parts = [s.name]
    if (s.admin1) parts.push(s.admin1)
    if (s.country) parts.push(s.country)
    return parts.join(', ')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} ref={wrapperRef}>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Enter a city name..."
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          disabled={disabled}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li
                key={s.id}
                className={i === activeIndex ? 'active' : ''}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={() => selectSuggestion(s)}
              >
                {formatSuggestion(s)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit" disabled={disabled || !query.trim()}>
        Search
      </button>
    </form>
  )
}

export default SearchBar
