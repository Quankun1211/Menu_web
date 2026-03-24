import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const orderRouter: RouteObject[] = [
    {
        path: "order",
        children: [
            {
                path: "list",
                lazy: lazyLoad(() => import("../pages/Order"))
            },
            {
                path: "detail",
                lazy: lazyLoad(() => import("../pages/OrderDetail"))
            },
        ]
    }
]