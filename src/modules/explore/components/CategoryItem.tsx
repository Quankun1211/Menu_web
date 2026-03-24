export default function CategoryItem({ item, isActive, onPress }) {
  return (
    <button
      onClick={() => onPress(item._id)}
      className={`px-5 py-2 rounded-full text-sm transition-all duration-200 border ${
        isActive 
        ? 'bg-orange-600 border-orange-600 text-white shadow-md' 
        : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500'
      }`}
    >
      {item.name}
    </button>
  );
}