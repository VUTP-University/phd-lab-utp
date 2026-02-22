import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js";
import {Mail, Phone, MapPin, Globe, Facebook, Linkedin, Youtube } from "lucide-react";

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
              <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <Mail /> 
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
              <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <Phone />
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
              <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                <MapPin />
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
              {/* Website */}
              <a
                href="https://www.utp.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
                title="Visit our website"
              >
                <Globe
                  className="transition-all duration-300 hover:scale-110"
                  size={28}
                />
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/www.utp.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
              >
                <Facebook
                  className="rounded-md transition-all duration-300 hover:scale-110"
                  size={28}
                />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/school/university-of-telecommunications-and-post-sofia/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
              >
                <Linkedin
                  className="rounded-md transition-all duration-300 hover:scale-110"
                  size={28}
                />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/channel/UCTFzRdWZ1s7mSue3w0-ER1A?si=YOBTRgGP1DqouwQ4"
                target="_blank"
                rel="noopener noreferrer"
                className="social_media_button"
              >
                <Youtube
                  className="rounded-md transition-all duration-300 hover:scale-110"
                  size={28}
                />
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