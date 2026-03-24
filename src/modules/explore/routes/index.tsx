import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const exploreRouter: RouteObject[] = [
    {
        path: "explore",
        children: [
            {
                path: "product",
                lazy: lazyLoad(() => import("../pages/Product"))
            },
            {
                path: "product-detail/:slug",
                lazy: lazyLoad(() => import("../pages/ProductDetail"))
            },
            {
                path: "special-detail/:slug",
                lazy: lazyLoad(() => import("../pages/SpecialDetail"))
            },
            {
                path: "special",
                lazy: lazyLoad(() => import("../pages/Special"))
            },
            {
                path: "menu",
                lazy: lazyLoad(() => import("../pages/Menu"))
            },
            {
                path: "menu-detail/:title",
                lazy: lazyLoad(() => import("../pages/MenuDetail"))
            },
            {
                path: "recipe",
                lazy: lazyLoad(() => import("../pages/Recipe"))
            },
            {
                path: "recipe-detail/:title",
                lazy: lazyLoad(() => import("../pages/RecipeDetail"))
            },
        ]
    }
]