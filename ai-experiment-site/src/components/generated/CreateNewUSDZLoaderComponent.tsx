import React, { useState } from 'react';

interface CreateNewUSDZLoaderProps {
  title?: string;
  description?: string;
  onLoad?: (data: any) => void;
  onError?: (error: any) => void;
  loadingText?: string;
  errorText?: string;
}

const CreateNewUSDZLoaderComponent: React.FC<CreateNewUSDZLoaderProps> = ({
  title = 'Load USDZ Model',
  description = 'Click the button to load a USDZ 3D model',
  onLoad,
  onError,
  loadingText = 'Loading...',
  errorText = 'Error loading model',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoadModel = async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      // Load USDZ model data
      const modelData = await fetchUSDZModel();
      setIsLoading(false);
      onLoad?.(modelData);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error);
    }
  };

  const fetchUSDZModel = async (): Promise<any> => {
    // Fetch USDZ model data from a service or API
    return { /* USDZ model data */ };
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>

      <button
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors ${
          isLoading ? 'cursor-not-allowed' : ''
        }`}
        onClick={handleLoadModel}
        disabled={isLoading}
      >
        {isLoading ? loadingText : 'Load USDZ Model'}
      </button>

      {hasError && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errorText}
        </div>
      )}
    </div>
  );
};

export default CreateNewUSDZLoaderComponent;