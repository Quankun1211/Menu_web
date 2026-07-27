import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  ArrowRightOutlined,
  BookFilled,
  BookOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { message, Tooltip } from "antd";
import useSaveRecipe from "../hooks/useSaveRecipe";

const RecipeGridItem = ({ item }) => {
  const navigate = useNavigate();
  const { mutate: saveRecipe } = useSaveRecipe();

  const handleSave = (event) => {
    event.stopPropagation();
    saveRecipe(item._id, {
      onSuccess: () => {
        message.success(item.isSaved ? "Đã bỏ lưu món ăn" : "Đã lưu vào bộ sưu tập!");
      },
    });
  };

  const difficultyLevel =
    item.difficulty === "Khó" ? 3 : item.difficulty === "Trung bình" ? 2 : 1;
  const ingredientCount = item.ingredients?.length || 0;

  return (
    <article
      onClick={() =>
        navigate(`/explore/recipe-detail/${item.slug}`, {
          state: { title: item._id },
        })
      }
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-orange-100/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-orange-50">
        <img
          src={item.image || "/assets/placeholder-recipe.jpg"}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        <button
          type="button"
          onClick={handleSave}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-105"
          aria-label={item.isSaved ? "Bỏ lưu công thức" : "Lưu công thức"}
        >
          {item.isSaved ? (
            <BookFilled className="text-lg text-orange-600" />
          ) : (
            <BookOutlined className="text-lg text-orange-600" />
          )}
        </button>

        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-white backdrop-blur">
          <ClockCircleOutlined />
          <span className="text-[11px] font-bold">{item.cookTime || 0} phút</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="line-clamp-1 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-orange-700">
            {item.category?.name || "Món Việt"}
          </span>
          <span className="shrink-0 text-[11px] font-bold text-gray-400">
            {item.meta?.servings || "2-3"} người
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 min-h-[3.25rem] text-lg font-black leading-snug text-[#5C4033] transition-colors group-hover:text-orange-600">
          {item.name}
        </h3>

        <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
          {item.description ||
            "Công thức món Việt dễ thực hiện, phù hợp cho bữa cơm gia đình."}
        </p>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-600">
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
            <TeamOutlined className="text-orange-500" />
            <span>{item.meta?.servings || "2-3"} khẩu phần</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
            <AppstoreOutlined className="text-orange-500" />
            <span>{ingredientCount} nguyên liệu</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((level) => (
              <ThunderboltOutlined
                key={level}
                className={
                  level <= difficultyLevel ? "text-orange-500" : "text-gray-200"
                }
              />
            ))}
            <span className="ml-1 text-[10px] font-black uppercase text-gray-400">
              {item.difficulty || "Dễ"}
            </span>
          </div>

          <Tooltip title="Xem chi tiết công thức">
            <span className="flex items-center gap-1 text-xs font-black text-orange-600">
              Chi tiết
              <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />
            </span>
          </Tooltip>
        </div>
      </div>
    </article>
  );
};

export default RecipeGridItem;
