import React from 'react';
import { CreateNewRedButtonComponent } from '../components/generated';


function GenerationPage() {
  return (
    <main className="flex-1 w-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div>
          <h1 className="text-4xl font-semibold text-white mb-8">Generated Components</h1>
          

          {/* AUTO-GENERATED COMPONENTS APPEAR HERE */}



          <div>
            <p className="text-gray-300">New components will automatically appear above as you generate them!</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GenerationPage;