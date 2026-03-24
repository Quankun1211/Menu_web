import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  X, 
  Clock, 
  ChefHat, 
  MessageSquare,
  Loader2,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useUpdateMyRecipe from '../hooks/useUpdateRecipe';
import useGetRecipeDetail from '../hooks/useGetRecipeDetail';

interface Ingredient {
  name: string;
  quantity: string;
}

interface Instruction {
  step: number;
  description: string;
}

export default function UpdateRecipeWeb() {
  const location = useLocation();
  
  const idFromState = location.state?.recipeId;
  const navigate = useNavigate();
  
  const { data: recipeDetail, isPending: getDetailPending } = useGetRecipeDetail(idFromState!);
  const { mutate: updateRecipe, isPending: updatePending } = useUpdateMyRecipe();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [cookTime, setCookTime] = useState<string>('');
  const [familyNotes, setFamilyNotes] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (recipeDetail?.data) {
      const d = recipeDetail.data;
      setName(d.name || '');
      setCookTime(String(d.cookTime || ''));
      setFamilyNotes(d.familyNotes || '');
      setImagePreview(d.image || null);
      setIngredients(d.ingredients?.length > 0 ? d.ingredients : [{ name: '', quantity: '' }]);
      setInstructions(d.instructions?.length > 0 ? d.instructions : [{ step: 1, description: '' }]);
    }
  }, [recipeDetail]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '' }]);
  
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setInstructions([...instructions, { step: instructions.length + 1, description: '' }]);
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

  const handleUpdate = () => {
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

    updateRecipe({ recipeId: idFromState!, formData: formData }, {
      onSuccess: () => {
        navigate(`/profile/recipe-detail`, { state: { recipeId: idFromState } });
      }
    });
  };

  if (getDetailPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F1E7]">
        <Loader2 className="animate-spin text-[#F26522]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F1E7] pb-20 pt-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden p-6 md:p-10 border border-orange-100">
        
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Save className="text-[#F26522]" size={20} /> Hiệu chỉnh công thức
          </h1>
          <div className="w-10" /> 
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-video w-full rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex flex-col items-center justify-center cursor-pointer hover:bg-orange-100 transition-all overflow-hidden group"
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                <Camera size={32} />
                <span className="text-sm font-bold mt-2">Thay đổi ảnh bìa</span>
              </div>
            </>
          ) : (
            <div className="text-center">
              <Camera className="text-[#F26522] w-10 h-10 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-400">Thêm ảnh bìa</p>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">Tên món ăn</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold text-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full md:w-1/2">
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
              <Clock size={16} /> Thời gian nấu (phút)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
            />
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-800">Nguyên liệu</h2>
              <button onClick={addIngredient} className="text-sm font-bold text-[#F26522] flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                <Plus size={16} /> Thêm
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tên"
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
                  <button onClick={() => removeIngredient(index)} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-800">Cách làm</h2>
              <button onClick={addStep} className="text-sm font-bold text-[#F26522] flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                <Plus size={16} /> Thêm bước
              </button>
            </div>
            <div className="space-y-6">
              {instructions.map((step, index) => (
                <div key={index} className="relative bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black bg-orange-500 text-white px-2 py-1 rounded">BƯỚC {step.step}</span>
                    <button onClick={() => removeStep(index)} className="text-gray-300 hover:text-red-500">
                      <X size={18} />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-transparent focus:border-orange-200 outline-none text-sm resize-none"
                    value={step.description}
                    onChange={(e) => updateStep(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2 text-sm font-black text-gray-700 mb-2 uppercase tracking-wide">
              <MessageSquare size={16} /> Lưu ý cho gia đình
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white outline-none italic text-gray-600"
              value={familyNotes}
              onChange={(e) => setFamilyNotes(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updatePending}
          className={`mt-12 w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            updatePending ? "bg-gray-400" : "bg-[#F26522] hover:bg-orange-600 active:scale-95 shadow-orange-100"
          }`}
        >
          {updatePending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>Cập nhật ngay</>
          )}
        </button>

      </div>
    </div>
  );
}