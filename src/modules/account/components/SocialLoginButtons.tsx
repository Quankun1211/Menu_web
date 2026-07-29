import { FacebookFilled } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message } from "antd";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAppStore } from "../../../store/app.store";
import { setRefreshToken, setToken } from "../../../utils/token";
import { onSocialLoginApi } from "../services/api";
import type { SocialProvider } from "../types/api-response";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string | number | boolean>,
          ) => void;
        };
      };
    };
    FB?: {
      init: (options: Record<string, string | boolean>) => void;
      login: (
        callback: (response: {
          authResponse?: { accessToken?: string };
          status?: string;
        }) => void,
        options: { scope: string; return_scopes: boolean },
      ) => void;
    };
  }
}

let googleSdkPromise: Promise<void> | undefined;
let facebookSdkPromise: Promise<void> | undefined;

const loadScript = (id: string, src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("SDK_LOAD_FAILED")), { once: true });
      }
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("SDK_LOAD_FAILED"));
    document.head.appendChild(script);
  });

const loadGoogleSdk = () => {
  googleSdkPromise ||= loadScript("google-identity-sdk", "https://accounts.google.com/gsi/client");
  return googleSdkPromise;
};

const loadFacebookSdk = async () => {
  facebookSdkPromise ||= loadScript(
    "facebook-jssdk",
    "https://connect.facebook.net/vi_VN/sdk.js",
  ).then(() => {
    window.FB?.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: false,
      version: import.meta.env.VITE_FACEBOOK_GRAPH_VERSION || "v25.0",
    });
  });
  return facebookSdkPromise;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error) {
    const value = error as { error?: string; message?: string };
    return value.error || value.message;
  }
  return undefined;
};

export default function SocialLoginButtons() {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUserData = useAppStore((state) => state.setUserData);

  const socialLogin = useMutation({
    mutationKey: ["social-login"],
    mutationFn: ({ provider, token }: { provider: SocialProvider; token: string }) =>
      onSocialLoginApi(provider, token),
    onSuccess: (response) => {
      const user = response.data;
      setToken(user.access_token);
      setRefreshToken(user.refresh_token);
      setUserData({
        username: user.username,
        role: user.role,
        email: user.email || "",
        name: user.name,
        sub: user._id,
        userId: user._id,
        avatar: user.avatar,
      });
      queryClient.setQueryData(["me"], {
        success: true,
        data: {
          id: user._id,
          username: user.username,
          role: user.role,
          email: user.email,
          emailNeedsVerification: user.emailNeedsVerification,
          name: user.name,
          avatar: user.avatar,
          authProviders: user.authProviders,
        },
      });
      message.success(response.message || "Đăng nhập thành công");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      message.error(getErrorMessage(error) || "Không thể đăng nhập. Vui lòng thử lại.");
    },
  });

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return;
    let active = true;

    loadGoogleSdk()
      .then(() => {
        if (!active || !window.google || !googleButtonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: ({ credential }) => {
            if (credential) socialLogin.mutate({ provider: "google", token: credential });
          },
        });
        googleButtonRef.current.replaceChildren();
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 320,
          locale: "vi",
        });
      })
      .catch(() => message.error("Không thể tải dịch vụ đăng nhập Google."));

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!import.meta.env.VITE_FACEBOOK_APP_ID) return;
    loadFacebookSdk().catch(() => {
      // The click handler reports SDK errors when login is requested.
    });
  }, []);

  const handleFacebookLogin = async () => {
    if (!import.meta.env.VITE_FACEBOOK_APP_ID) {
      message.error("Đăng nhập Facebook chưa được cấu hình.");
      return;
    }
    try {
      await loadFacebookSdk();
      if (!window.FB) throw new Error("FACEBOOK_SDK_UNAVAILABLE");
      window.FB.login(
        (response) => {
          const accessToken = response.authResponse?.accessToken;
          if (accessToken) socialLogin.mutate({ provider: "facebook", token: accessToken });
          else if (response.status !== "unknown") message.info("Bạn chưa cấp quyền đăng nhập Facebook.");
        },
        { scope: "public_profile", return_scopes: true },
      );
    } catch {
      message.error("Không thể tải dịch vụ đăng nhập Facebook.");
    }
  };

  const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const facebookConfigured = Boolean(import.meta.env.VITE_FACEBOOK_APP_ID);

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col gap-3">
      {googleConfigured ? (
        <div
          ref={googleButtonRef}
          className={`min-h-10 overflow-hidden rounded-md ${socialLogin.isPending ? "pointer-events-none opacity-60" : ""}`}
          aria-label="Tiếp tục với Google"
        />
      ) : (
        <Button disabled className="h-10 rounded-md">Google chưa được cấu hình</Button>
      )}

      <Button
        icon={<FacebookFilled />}
        onClick={handleFacebookLogin}
        loading={socialLogin.isPending && socialLogin.variables?.provider === "facebook"}
        disabled={!facebookConfigured || socialLogin.isPending}
        className="h-10 rounded-md border-[#1877F2] bg-[#1877F2] font-semibold text-white hover:!border-[#166FE5] hover:!bg-[#166FE5] hover:!text-white"
      >
        Tiếp tục với Facebook
      </Button>
      <p className="m-0 text-center text-xs leading-5 text-gray-400">
        Tài khoản mới sẽ được tạo tự động và xác minh qua nhà cung cấp.
      </p>
    </div>
  );
}
