import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_URL}/auth/google/`, {
        access_token: credentialResponse.credential,
        
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const { name, email, picture, is_lab_admin } = res.data;
      localStorage.setItem('user', JSON.stringify({ name, email, picture, is_lab_admin }));
      // navigate('/dashboard');
      console.log('Login successful:', res.data);
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };
  
  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };


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
          <button className="px-6 py-3 shadow transition custom_button">
            {t("hero.info_button")}
          </button>
          <button className="px-6 py-3 transition custom_button">
            {t("hero.mission_button")}
          </button>
          <button className="px-6 py-3 transition custom_button" onClick={() => navigate("/contacts")}>
            {t("hero.contact")}
          </button>
        </div>

        {/* Google Sign-In */}
        <div className="mt-10 flex justify-center">
          <div className="rounded-2xl p-6 text-center">
            <h3 className="font-bold text-blue-800 mb-4">{t("hero.login")}</h3>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>
        {/* <div className="mt-10 flex justify-center">
          <button
            onClick={() => handleGoogleSuccess()}
            className="flex items-center justify-center gap-3
             px-6 py-3 transition custom_button"
          >
            <img
              src="../../src/assets/google.png"
              alt="Google"
              className="w-5 h-5"
            />
            {t("hero.login")}
          </button>
        </div> */}
      </div>
    </section>
  );
}
