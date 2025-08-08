import React, { useState } from 'react';
import axios from 'axios';

const LocationSearchPanel = ({ onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (input) => {
    try {
      const response = await axios.get('/api/maps/autocomplete', {
        params: { input }
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (suggestion) => {
    try {
      const response = await axios.get('/api/maps/geocode', {
        params: { address: suggestion }
      });
      onSelectLocation({
        address: suggestion,
        coordinates: response.data
      });
      setQuery(suggestion);
      setSuggestions([]);
    } catch (error) {
      console.error('Error selecting location:', error);
    }
  };

  return (
    <div style={{ padding: '10px', maxWidth: '400px' }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter city or area"
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      {suggestions.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, border: '1px solid #ccc' }}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: '#fff',
                borderBottom: '1px solid #eee'
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearchPanel;