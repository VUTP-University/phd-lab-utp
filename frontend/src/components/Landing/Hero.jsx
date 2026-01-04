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
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };
  
  const handleGoogleError = () => {
    console.error('Google Login Failed');
  };


  return (
    <section className="primary_object py-6">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h1 className="font-bold primary_text">{t("hero.phd_lab")}</h1>
    <h2 className="mt-4 secondary_text max-w-2xl mx-auto">
      {t("hero.uni_name")}
    </h2>
    <p className="mt-6 normal_text max-w-3xl mx-auto">
      {t("hero.description")}
    </p>

    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
      <button className="custom_button px-6 py-3 shadow transition">
        {t("hero.info_button")}
      </button>
      <button className="custom_button px-6 py-3 transition">
        {t("hero.mission_button")}
      </button>
      <button
        className="custom_button px-6 py-3 transition"
        onClick={() => navigate("/contacts")}
      >
        {t("hero.contact")}
      </button>
    </div>

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
  </div>
</section>
  );
}
