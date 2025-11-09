import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export default function LoginSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    <section className="bg-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="font-bold text-blue-800 mb-4">{t("login.title")}</h3>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>
      </div>
    </section>
  );
}
