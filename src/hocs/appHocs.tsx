import { type JSX, useEffect } from "react";
import type { ComponentType } from "react";
import { useAppStore } from "../store/app.store";
import useGetMe from "../hooks/useGetMe";
import { getRefreshToken, getToken } from "../utils/token";

function AppHoc<T extends JSX.IntrinsicAttributes> (
    WrappedComponent: ComponentType<T>
) {
    const AuthenticatedComponent = (props: T) => {
        const {setUserData} = useAppStore()
        const hasStoredSession = Boolean(getToken() || getRefreshToken())
        const {data: meData, isError, isFetched} = useGetMe(hasStoredSession)

        useEffect(() => {
            if(meData?.data) {
                const user = meData.data
                
                const jwtPayload = {
                    username: user.username,
                    role: user.role,
                    email: user.email,
                    name: user.name,
                    sub: user.id.toString(),
                    userId: user.id.toString(),
                    avatar: user.avatar
                }
                setUserData(jwtPayload)
            } else if (!hasStoredSession || (isFetched && isError)) {
                setUserData(null)
            }
        }, [hasStoredSession, isError, isFetched, meData, setUserData])
        return <WrappedComponent {...props}/>
    }
    return AuthenticatedComponent
}

export default AppHoc
