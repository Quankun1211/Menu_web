import type { BackendResponse } from "../../../libs/shared/types/backend-response";
import api from "../../../services/axios";
import type { LoginResponse, RegisterResponse } from "../types/api-response";
import type { logInRequest, RegisterRequest } from "../types/api-request";
export const onLogInApi = async(
    payload: logInRequest
) : Promise<BackendResponse<LoginResponse>> => {
    const {username, password} = payload
    const data = await api.post("auth/login", {
        username,
        password
    })
    return data.data
}
export const onVerifyApi = async (
    payload: { email: string; otp: string, type: string }
) : Promise<BackendResponse<any>> => {
    const { email, otp, type } = payload;
    const data = await api.post("/auth/verify-otp", {
        email,
        otp,
        type
    });
    return data.data;
}
export const onForgotPasswordApi = async (
    payload: { email: string }
) : Promise<BackendResponse<any>> => {
    const { email } = payload;
    const data = await api.post("/auth/forgot-password", {
        email
    });
    return data.data;
}
export const onResendOTPApi = async (
    payload: { email: string }
) : Promise<BackendResponse<any>> => {
    const { email } = payload;
    const data = await api.post("/auth/resend-otp", {
        email
    });
    return data.data;
}
export const onResetPasswordApi = async (
    payload: { email: string; otp: string; newPassword: string }
) : Promise<BackendResponse<any>> => {
    const { email, otp, newPassword } = payload;
    const data = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword
    });
    return data.data;
}
export const onRegisterApi = async(
    payload: RegisterRequest
) : Promise<BackendResponse<RegisterResponse>> => {
    console.log(payload)
    const {email, name, password, username, confirmPassword: confirmPassword} = payload
    const data = await api.post("/auth/register", {
        email,
        name, 
        password,
        username,
        confirmPassword
    })
    return data.data
}