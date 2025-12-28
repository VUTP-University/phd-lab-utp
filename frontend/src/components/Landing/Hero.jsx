import React from "react";
import { useTranslation } from "react-i18next";
// import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Hero() {
  const { t } = useTranslation();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post(
          `${API_URL}/auth/google/`,
          {
            access_token: tokenResponse.access_token,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const { name, email, picture, is_lab_admin } = res.data;
        localStorage.setItem(
          "user",
          JSON.stringify({ name, email, picture, is_lab_admin })
        );

        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: () => {
      console.error("Google Login Failed");
    },
  });

  return (
    <section className="primary_object">
      <div className="max-w-7xl mx-auto px-6 py-6 text-center">
        <h1 className="font-bold primary_text">{t("hero.phd_lab")}</h1>
        <h1 className="mt-4 text-2xl max-w-2xl mx-auto secondary_text">
          {t("hero.uni_name")}
        </h1>
        <p className="mt-6 text-xl max-w-3xl mx-auto normal_text">
          {t("hero.description")}
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="px-6 py-3 text-white rounded-lg shadow transition">
            {t("hero.info_button")}
          </button>
          <button className="px-6 py-3 border rounded-lg transition">
            {t("hero.mission_button")}
          </button>
          <button className="px-6 py-3 border rounded-lg transition">
            {t("hero.contact")}
          </button>
        </div>

        {/* Google Sign-In */}
        {/* <div className="mt-10 flex justify-center">
          <div className="rounded-2xl p-6 text-center">
            <h3 className="font-bold text-blue-800 mb-4">{t("hero.login")}</h3>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div> */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => googleLogin()}
            className="flex items-center justify-center gap-3
             px-6 py-3 rounded-lg
             bg-white border border-gray-300
             shadow hover:shadow-md
             hover:bg-gray-50 transition
             font-medium text-gray-700"
          >
            <img
              src="../../src/assets/google.png"
              alt="Google"
              className="w-5 h-5"
            />
            {t("hero.login")}
          </button>
        </div>
      </div>
    </section>
  );
}
