import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";



export default function LoginSection() {
  const { t } = useTranslation();

  const title = t("login.title");
  const buttonText = t("login.button");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/google/', {
        access_token: credentialResponse.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Access Token:', credentialResponse.credential);
      console.log('Login successful:', res.data);
    } catch (error) {
      console.log('Access Token:', credentialResponse.credential);
      console.error('Login failed:', error);
    }
  }

  const handleGoogleError = () => {
    console.error('Google Login Failed');
  }

  return (
    <section className="bg-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE - Custom login form */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="font-bold text-blue-800 mb-4">
            {t("login.customTitle", "Login to ...")}
          </h3>
          {/* <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={t("login.username", "Username")}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder={t("login.password", "Password")}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              {t("login.submit", "Login")}
            </button>
          </form> */}

          {/* Google OAuth Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
          />
        </div>

        {/* RIGHT SIDE - Google Classroom login */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="font-bold text-blue-800 mb-4">{title}</h3>
          <a
            href="https://classroom.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
              {buttonText}
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}