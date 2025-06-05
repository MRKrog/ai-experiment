import React, { useState } from 'react';

interface CreateNewHeroImageProps {
  initialImage?: string;
  onImageSelected: (imageUrl: string) => void;
}

const CreateNewHeroImageComponent: React.FC<CreateNewHeroImageProps> = ({
  initialImage,
  onImageSelected,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    initialImage
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setSelectedImage(imageUrl);
      onImageSelected(imageUrl);
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create New Hero Image</h2>
      <div className="flex items-center justify-center mb-4">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected hero image"
            className="max-w-full max-h-64 rounded-md"
          />
        ) : (
          <div className="flex items-center justify-center h-64 w-full bg-gray-300 rounded-md">
            <span className="text-gray-500 text-4xl">
              <i className="fas fa-image"></i>
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <label
          htmlFor="imageUpload"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          <i className="fas fa-upload mr-2"></i>
          Upload Image
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default CreateNewHeroImageComponent;