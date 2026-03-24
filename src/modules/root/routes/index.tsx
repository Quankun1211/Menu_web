import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const rootRouter: RouteObject[] = [
    {
        index: true,
        lazy: lazyLoad(() => import("../pages/HomePage"))
    }
]

export const suggestRouter: RouteObject[] = [
    {
        path: "suggest",
        lazy: lazyLoad(() => import("../pages/SuggestPage"))
    }
]

export const saleRouter: RouteObject[] = [
    {
        path: "sale",
        lazy: lazyLoad(() => import("../pages/SalePage"))
    }
]