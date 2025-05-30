import React from 'react';

function ContentPreview() {
  return (
    <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-100">Content Preview</h3>
      </div>
      <div className="bg-gray-900/50 p-4 flex items-center justify-center h-[calc(12vh)]">
        <p className="text-gray-400">Generated content will appear here</p>
      </div>
    </div>
  );
}

export default ContentPreview; 