// Local Storage key for suggestions
const STORAGE_KEY = 'ai_experiment_suggestions';

// Save suggestions to local storage
export const saveSuggestions = (suggestions) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(suggestions));
};

// Load suggestions from local storage
export const loadSuggestions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Add a new suggestion
export const addSuggestion = (suggestions, newSuggestion) => {
  const updated = [newSuggestion, ...suggestions];
  saveSuggestions(updated);
  return updated;
};

// Update a suggestion
export const updateSuggestion = (suggestions, updatedSuggestion) => {
  const updated = suggestions.map(suggestion =>
    suggestion.id === updatedSuggestion.id ? updatedSuggestion : suggestion
  );
  saveSuggestions(updated);
  return updated;
};

// Delete a suggestion
export const deleteSuggestion = (suggestions, id) => {
  const updated = suggestions.filter(suggestion => suggestion.id !== id);
  saveSuggestions(updated);
  return updated;
}; 