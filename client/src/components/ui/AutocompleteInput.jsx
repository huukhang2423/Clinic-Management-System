import { useState, useEffect, useRef } from 'react';

export default function AutocompleteInput({
  value,
  onChange,
  fetchSuggestions,
  placeholder,
  className,
  error,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!value || value.length < 1) {
      setSuggestions([]);
      setShow(false);
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        const results = await fetchSuggestions(value);
        // Filter out exact match
        const filtered = results.filter(
          (s) => s.toLowerCase() !== value.toLowerCase()
        );
        setSuggestions(filtered);
        setShow(filtered.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setShow(false);
      }
    }, 200);

    return () => clearTimeout(timerRef.current);
  }, [value, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    onChange(name);
    setShow(false);
  };

  const handleKeyDown = (e) => {
    if (!show || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShow(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShow(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {show && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((name, i) => (
            <li
              key={name}
              onClick={() => handleSelect(name)}
              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                i === activeIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-800'
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
