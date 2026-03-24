import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  X, 
  Clock, 
  ChefHat, 
  MessageSquare,
  Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCreateMyRecipe from '../hooks/useCreateMyRecipe';

interface Ingredient {
  name: string;
  quantity: string;
}

interface Instruction {
  step: number;
  description: string;
}

export default function CreateRecipeScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [cookTime, setCookTime] = useState<string>('');
  const [familyNotes, setFamilyNotes] = useState<string>('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '' },
    { name: '', quantity: '' }
  ]);

  const [instructions, setInstructions] = useState<Instruction[]>([
    { step: 1, description: '' },
    { step: 2, description: '' }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { mutate: createRecipe, isPending } = useCreateMyRecipe();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setInstructions([
      ...instructions,
      { step: instructions.length + 1, description: '' }
    ]);
  };

  const removeStep = (index: number) => {
    const newSteps = instructions
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, step: i + 1 }));
    setInstructions(newSteps);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...instructions];
    newSteps[index].description = value;
    setInstructions(newSteps);
  };

  const handlePost = () => {
    if (!name.trim()) return alert("Vui lòng nhập tên món ăn");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('cookTime', cookTime || '0');
    formData.append('familyNotes', familyNotes);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const filteredIngredients = ingredients.filter(i => i.name.trim() !== '');
    const filteredInstructions = instructions.filter(s => s.description.trim() !== '');

    formData.append('ingredients', JSON.stringify(filteredIngredients));
    formData.append('instructions', JSON.stringify(filteredInstructions));

    createRecipe(formData, {
      onSuccess: () => {
        navigate("/profile/recipe-handbook");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F1E7] pb-20 pt-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden p-6 md:p-10">
        <h1 className="text-2xl font-black text-gray-800 mb-8 flex items-center gap-2">
          <ChefHat className="text-[#F26522]" /> Tạo công thức mới
        </h1>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-video w-full rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-colors overflow-hidden group"
        >
          {image ? (
            <>
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white w-10 h-10" />
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                <Camera className="text-[#F26522] w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-gray-500">Thêm ảnh bìa đẹp mắt</p>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Basic Info */}
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tên món ăn</label>
            <input
              type="text"
              placeholder="VD: Cá kho tộ nghệ"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Clock size={16} className="text-gray-400" /> Thời gian nấu (phút)
            </label>
            <input
              type="number"
              placeholder="30"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>
        </div>

        {/* Ingredients */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Nguyên liệu</h2>
            <button 
              onClick={addIngredient}
              className="text-sm font-bold text-[#F26522] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Thêm
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Nguyên liệu"
                  className="flex-[2] px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none text-sm"
                  value={item.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Lượng"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none text-sm"
                  value={item.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                />
                <button 
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Cách làm</h2>
            <button 
              onClick={addStep}
              className="text-sm font-bold text-[#F26522] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Thêm bước
            </button>
          </div>

          <div className="space-y-6">
            {instructions.map((step, index) => (
              <div key={index} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
                    Bước {step.step}
                  </span>
                  <button onClick={() => removeStep(index)} className="text-gray-300 hover:text-red-500">
                    <X size={18} />
                  </button>
                </div>
                <textarea
                  placeholder="Tiến hành nấu..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 focus:bg-white outline-none text-sm resize-none"
                  value={step.description}
                  onChange={(e) => updateStep(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Family Notes */}
        <div className="mt-10">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <MessageSquare size={16} className="text-gray-400" /> Lưu ý cho gia đình
          </label>
          <input
            type="text"
            placeholder="VD: Gia đình mình ăn cay..."
            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none transition-all italic text-sm text-gray-600"
            value={familyNotes}
            onChange={(e) => setFamilyNotes(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handlePost}
          disabled={isPending}
          className={`mt-12 w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            isPending ? "bg-gray-400 cursor-not-allowed" : "bg-[#F26522] hover:bg-orange-600 active:scale-[0.98] shadow-orange-200"
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Đang đăng...
            </>
          ) : (
            "Đăng công thức ngay"
          )}
        </button>
      </div>
    </div>
  );
}