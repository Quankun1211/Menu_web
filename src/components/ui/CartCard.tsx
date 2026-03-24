// import Quantity from "../common/Quantity"
import banner from "../../assets/images/banner.png"
import { formatVND } from "../../utils/helper"
// import useRemoveCart from "../../modules/product/hooks/useRemoveCart"
import Loading from "./Loading"
import { useNotification } from "../../context/NotifycationContex"

type CartCardProps = {
  productId: string
  name: string
  description?: string
  price: number
  quantity: number,
  image: string,
  isCombo: boolean,
  onIncrease: () => void
  onDecrease: () => void
}

export default function CartCard({
  productId,
  name,
  description,
  price,
  quantity,
  image,
  isCombo,
  onIncrease,
  onDecrease,
}: CartCardProps) {
  
//   const { mutate: deleteCart, isPending } = useRemoveCart()
  const {api} = useNotification()
const isPending = false
  const handleRemoveCart = () => {
    // isCombo ? deleteCart({comboId: productId}) : deleteCart({productId})
    api.success({
      message: `Đã xóa sản phẩm ${name} ra khỏi giỏ hàng`,
      description: name,
      placement: "bottomRight",
      duration: 2,
    })
  }
  
  return (
    <>
      {isPending ? (
        <Loading/>
      ) : (
        <div className="bg-gray-50 rounded-xl p-3 shadow-md">
          <div className="flex gap-3">
            <img
              src={banner}
              alt={name}
              className="w-14 h-14 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold text-sm line-clamp-1">
                {name}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {description}
              </p>
              <p className="text-green-500 font-semibold text-sm mt-1">
                {formatVND(price)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">

            {/* <Quantity
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              quantity={quantity}
              size={6}
            /> */}

            <button
              onClick={handleRemoveCart}
              className="text-gray-400 hover:text-red-500 transition"
              title="Xóa sản phẩm"
            >
              🗑️
            </button>
          </div>
        </div>
      )}
    </>
  )
}
