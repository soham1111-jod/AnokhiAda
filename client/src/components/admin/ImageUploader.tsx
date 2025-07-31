import React, { useRef, useState } from "react";

interface CloudinaryOption {
  name: string;
  cloudName: string;
  uploadPreset: string;
}

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void;
  cloudinaryOptions: CloudinaryOption[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, cloudinaryOptions }) => {
  const [selectedCloud, setSelectedCloud] = useState(cloudinaryOptions[0]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    setError("");
    const urls: string[] = [];
    for (const file of Array.from(e.target.files)) {
      try {
        const url = `https://api.cloudinary.com/v1_1/${selectedCloud.cloudName}/image/upload`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", selectedCloud.uploadPreset);
        const res = await fetch(url, { method: "POST", body: formData });
        const data = await res.json();
        if (data.secure_url) {
          urls.push(data.secure_url);
        } else {
          setError("Upload failed for one or more images.");
        }
      } catch (err) {
        setError("Upload failed for one or more images.");
      }
    }
    setUploading(false);
    if (urls.length) onUpload(urls);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <label className="block mb-2 font-medium">Select Cloudinary</label>
      <select
        className="mb-4 border rounded px-2 py-1"
        value={selectedCloud.name}
        onChange={e => {
          const found = cloudinaryOptions.find(opt => opt.name === e.target.value);
          if (found) setSelectedCloud(found);
        }}
      >
        {cloudinaryOptions.map(opt => (
          <option key={opt.name} value={opt.name}>{opt.name}</option>
        ))}
      </select>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="block mb-2"
        disabled={uploading}
      />
      {uploading && <div>Uploading...</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default ImageUploader;