import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";

export default function ContactForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.post("/api/contact/send/", formData);
      
      if (response.data.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError(
        err.response?.data?.error || t("contact.error_message")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 mb-6 normal_text hover:text-blue-600 dark:hover:text-blue-400 transition"
      >
        <ArrowLeft size={20} />
        {t("common.go_back")}
      </button>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 animate-fade-in">
          <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
          <p className="normal_text_2 text-green-800 dark:text-green-300">
            {t("contact.success_message")}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 animate-fade-in">
          <AlertCircle className="text-red-600 dark:text-red-400" size={24} />
          <p className="normal_text_2 text-red-800 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      <div className="w-full grid lg:grid-cols-2 items-start gap-16 p-6 mx-auto max-w-full rounded-2xl shadow-sm primary_object">
        {/* LEFT SIDE - Contact Info */}
        <div>
          <h2 className="text-3xl font-bold secondary_text">
            {t("contact.title")}
          </h2>

          {/* EMAIL */}
          <div className="mt-12">
            <div className="mt-4 flex items-center">
              <div className="bg-slate-200 dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                📧
              </div>
              <div className="ml-4 text-m">
                <p className="normal_text">{t("contact.mail")}</p>
                <a
                  href="mailto:admission@utp.bg"
                  className="normal_text_3 normal_text_3--small hover:underline transition-colors"
                >
                  admission@utp.bg
                </a>
              </div>
            </div>
          </div>

          {/* PHONE */}
          <div className="mt-8">
            <div className="mt-4 flex items-center">
              <div className="bg-slate-200 dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                📞
              </div>
              <div className="ml-4 text-sm">
                <p className="normal_text">{t("contact.phone")}</p>
                <p className="normal_text_3 normal_text_3--small">
                  +359 2 806 2180
                </p>
                <p className="normal_text_3 normal_text_3--small">
                  +359 882 431 872
                </p>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="mt-8">
            <div className="mt-4 flex items-center">
              <div className="bg-slate-200 dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                📍
              </div>
              <div className="ml-4 text-sm">
                <p className="normal_text">{t("contact.address_title")}</p>
                <p className="normal_text_3 normal_text_3--small" style={{ whiteSpace: "pre-line" }}>
                  {t("contact.address")}
                </p>
              </div>
            </div>
          </div>

          {/* SOCIALS */}
          <div className="mt-12">
            <h3 className="text-base font-semibold normal_text">
              {t("contact.socials")}
            </h3>
            <div className="mt-4 flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/www.utp.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
              >
                <svg
                  className="transition-all duration-300 hover:scale-110"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 72 72"
                  fill="none"
                >
                  <path
                    d="M46.4927 38.6403L47.7973 30.3588H39.7611V24.9759C39.7611 22.7114 40.883 20.4987 44.4706 20.4987H48.1756V13.4465C46.018 13.1028 43.8378 12.9168 41.6527 12.8901C35.0385 12.8901 30.7204 16.8626 30.7204 24.0442V30.3588H23.3887V38.6403H30.7204V58.671H39.7611V38.6403H46.4927Z"
                    fill="#337FFF"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/school/university-of-telecommunications-and-post-sofia/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
              >
                <svg
                  className="rounded-md transition-all duration-300 hover:scale-110"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 72 72"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.6975 11C12.6561 11 11 12.6057 11 14.5838V57.4474C11 59.4257 12.6563 61.03 14.6975 61.03H57.3325C59.3747 61.03 61.03 59.4255 61.03 57.4468V14.5838C61.03 12.6057 59.3747 11 57.3325 11H14.6975ZM26.2032 30.345V52.8686H18.7167V30.345H26.2032ZM26.6967 23.3793C26.6967 25.5407 25.0717 27.2703 22.4615 27.2703L22.4609 27.2701H22.4124C19.8998 27.2701 18.2754 25.5405 18.2754 23.3791C18.2754 21.1686 19.9489 19.4873 22.5111 19.4873C25.0717 19.4873 26.6478 21.1686 26.6967 23.3793ZM37.833 52.8686H30.3471L30.3469 52.8694C30.3469 52.8694 30.4452 32.4588 30.3475 30.3458H37.8336V33.5339C38.8288 31.9995 40.6098 29.8169 44.5808 29.8169C49.5062 29.8169 53.1991 33.0363 53.1991 39.9543V52.8686H45.7133V40.8204C45.7133 37.7922 44.6293 35.7269 41.921 35.7269C39.8524 35.7269 38.6206 37.1198 38.0796 38.4653C37.8819 38.9455 37.833 39.6195 37.833 40.2918V52.8686Z"
                    fill="#006699"
                  />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/channel/UCTFzRdWZ1s7mSue3w0-ER1A?si=YOBTRgGP1DqouwQ4"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
              >
                <svg
                  className="rounded-md transition-all duration-300 hover:scale-110"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M23.498 6.186a2.994 2.994 0 0 0-2.113-2.119C19.177 3.5 12 3.5 12 3.5s-7.177 0-9.385.567a2.994 2.994 0 0 0-2.113 2.119A31.35 31.35 0 0 0 0 12a31.35 31.35 0 0 0 .502 5.814 2.994 2.994 0 0 0 2.113 2.119C4.823 20.5 12 20.5 12 20.5s7.177 0 9.385-.567a2.994 2.994 0 0 0 2.113-2.119A31.35 31.35 0 0 0 24 12a31.35 31.35 0 0 0-.502-5.814ZM9.546 15.568V8.432l6.18 3.568-6.18 3.568Z"
                    fill="#FF0000"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <form onSubmit={handleSubmit} className="lg:ml-auto space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("contact.placeholder_name")}
            className="custom_input w-full"
            required
            minLength={2}
            disabled={submitting}
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("contact.placeholder_email")}
            className="custom_input w-full"
            required
            disabled={submitting}
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={t("contact.email_subject")}
            className="custom_input w-full"
            required
            minLength={3}
            disabled={submitting}
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("contact.message")}
            rows="6"
            className="custom_textarea w-full"
            required
            minLength={10}
            disabled={submitting}
          />

          <button
            type="submit"
            disabled={submitting}
            className="custom_button w-full flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t("contact.sending") || "Sending..."}
              </>
            ) : (
              <>
                <Send size={18} />
                {t("contact.send_message")}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}