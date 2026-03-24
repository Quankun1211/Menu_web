import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const cartRouter: RouteObject[] = [
    {
        path: "cart",
        lazy: lazyLoad(() => import("../pages/Cart"))
    }
]