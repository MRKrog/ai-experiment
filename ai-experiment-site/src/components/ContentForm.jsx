import React from 'react';
import SuggestionForm from './SuggestionForm';

function ContentForm({ onSubmit }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-100 mb-4">Generate New Content</h2>
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
        <SuggestionForm onSubmit={onSubmit} />
      </div>
    </section>
  );
}

export default ContentForm; 