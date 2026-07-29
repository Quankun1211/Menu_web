export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    username: string,
    _id: string,
    role: string,
    avatar: string,
    name: string,
    email: string | null,
    emailNeedsVerification: boolean,
    authProviders: SocialProvider[]
}
export type SocialProvider = "google" | "facebook";
export type RegisterResponse = {
    id: string;
    email: string;
    name: string;
    role: string;
}
