import { Outlet } from "react-router";
import AuthHoc from "../hocs/authHocs.js";
import RouteSeo from "../components/common/RouteSeo";

const AuthLayout = () => {
    return (
        <div className="auth-layout-container">
            <RouteSeo />
            <Outlet/>
        </div>
    )
}

export default AuthHoc(AuthLayout)
