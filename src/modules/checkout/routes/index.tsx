import type { RouteObject } from "react-router";
import { lazyLoad } from "../../../utils/helper";

export const checkoutRouter: RouteObject[] = [
    {
        path: "checkout",
        children: [
            {
                index: true,
                lazy: lazyLoad(() => import("../pages/Checkout"))
            },
            {
                path: "address",
                lazy: lazyLoad(() => import("../pages/ListAddress"))
            },
            {
                path: "add-address",
                lazy: lazyLoad(() => import("../pages/AddAddress"))
            },
            {
                path: "edit-address",
                lazy: lazyLoad(() => import("../pages/EditAddress"))
            },
            {
                path: "payment-check",
                lazy: lazyLoad(() => import("../pages/PreviewCheckoutVNP"))
            },
        ]
    }
]