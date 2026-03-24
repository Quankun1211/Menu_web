import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { Suspense } from "react";
import AuthLayout from "../layouts/AuthLayout";
import Fallback from "../components/common/Fallback";
import { authRouter } from "../modules/account/routes";
import MainLayout from "../layouts/MainLayout";
import { rootRouter, suggestRouter, saleRouter } from "../modules/root/routes";
import { exploreRouter } from "../modules/explore/routes";
import { cartRouter } from "../modules/cart/routes";
import { checkoutRouter } from "../modules/checkout/routes";
import { orderRouter } from "../modules/order/routes";
import { profileRouter } from "../modules/profile/routes";

const AuthLayoutWithSuspense = () => (
  <Suspense fallback={<Fallback />}>
    <AuthLayout />
  </Suspense>
);

const MainLayoutWithSuspense = () => (
    <Suspense fallback={<Fallback/>}>
        <MainLayout/>
    </Suspense>
)

const router = createBrowserRouter([
    {
        path: "/",
        hydrateFallbackElement: <Fallback/>,
        children: [
            {
                element: <AuthLayoutWithSuspense />,
                children: authRouter
            },
            {
                element: 
                <MainLayoutWithSuspense/>,
                children: [
                    ...rootRouter,
                    ...suggestRouter,
                    ...exploreRouter,
                    ...cartRouter,
                    ...checkoutRouter,
                    ...orderRouter,
                    ...saleRouter,
                    ...profileRouter
                    // ...accountManageRouter,
                    // ...orderManageRouter,
                    // ...manageRouter,
                    // ...categoryRouter,
                    // ...saleManageRouter,
                    // ...recipeManageRouter,
                    // ...ingredientManageRouter,
                    // ...menuManageRouter
                ]
            }
        ]
    }
])

export default router