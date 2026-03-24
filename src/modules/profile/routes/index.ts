import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const profileRouter: RouteObject[] = [
    {
        path: "profile",
        children: [
            {
                index: true,
                lazy: lazyLoad(() => import("../pages/Profile"))
            },
            {
                path: "wishlist",
                lazy: lazyLoad(() => import("../pages/WishList"))
            },
            {
                path: "recipe-handbook",
                lazy: lazyLoad(() => import("../pages/RecipeHandbook"))
            },
            {
                path: "create-recipe",
                lazy: lazyLoad(() => import("../pages/CreateRecipe"))
            },
            {
                path: "update-recipe",
                lazy: lazyLoad(() => import("../pages/UpdateRecipe"))
            },
            {
                path: "recipe-detail",
                lazy: lazyLoad(() => import("../pages/MyRecipeDetail"))
            },
        ]
    }
]