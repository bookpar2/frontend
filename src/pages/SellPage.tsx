import React from "react";
import { useState } from "react";
import { Upload } from "lucide-react";

function SellPage() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({ image: "", title: "", price: "", description: "" });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files).map((file) => URL.createObjectURL(file));
      const newImages = [...images, ...uploadedFiles].slice(0, 3);
      setImages(newImages);
    }
  };

  const handleSubmit = () => {
    let newError = { image: "", title: "", price: "", description: "" };
    if (images.length === 0) newError.image = "이미지를 1장 이상 등록해 주세요";
    if (title.length == 0) newError.title = "책 이름을 입력해 주세요";
    if (price.length == 0) newError.price = "가격을 입력해 주세요";
    if (description.length < 10) newError.description = "10자 이상 작성해 주세요";
    
    setError(newError);
    if (!newError.image && !newError.description) {
      alert("등록이 완료되었습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-8 pb-8 space-y-4 pt-28 sm:pt-40">
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">사진 (최소 1장)</label>
        <div className="flex gap-2">
          {images.map((src, index) => (
            <img key={index} src={src} alt="preview" className="w-18 h-18 object-cover rounded-md border border-gray-300" />
          ))}
          {images.length < 3 && (
            <label className="w-18 h-18 flex flex-col items-center justify-center border rounded-md cursor-pointer bg-gray-100">
              <Upload className="w-5 h-5 text-gray-500" />
              <p className="text-gray-400 text-xs">{images.length}/3</p>
              <input type="file" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          )}
        </div>
        {error.image && <p className="text-error text-sm mt-1 pl-1">{error.image}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">책 제목</label>
        <input
          type="text"
          placeholder="책 제목을 입력하세요"
          value={title} onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 border rounded-md ${error.title ? "border-error" : "border-gray-300"}`}
        />
        {error.title && <p className="text-error text-sm mt-1 pl-1">{error.title}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">가격</label>
        <input
          type="number"
          placeholder="가격을 입력하세요"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`w-full p-3 border rounded-md ${error.price ? "border-error" : "border-gray-300"}`}
        />
        {error.price && <p className="text-error text-sm mt-1 pl-1">{error.price}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">상태 설명</label>
        <textarea 
          placeholder="책의 상태를 설명해 주세요(중고 여부, 필기 여부 등)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full h-48 p-3 border rounded-md resize-none ${error.description ? "border-error" : "border-gray-300"}`}
        />
        {error.description && <p className="text-error text-sm pl-1">{error.description}</p>}
      </div>
      
      <button className="w-full bg-primary text-white py-3 rounded-full" onClick={handleSubmit}>등록하기</button>
    </div>
  );
}

export default SellPage;