import React, { useEffect, useState } from "react";
import api from "../../../api.js";
import { useTranslation } from "react-i18next";
import { Upload, Trash2, Users as UsersIcon } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import EmptyState from "../../components/EmptyState";
import AdminSupervisions from "./AdminSupervisions";

export default function AdminUsers() {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [removeEmail, setRemoveEmail] = useState("");
  const [uploadingFor, setUploadingFor] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const [adminsRes, teachersRes, studentsRes] = await Promise.all([
        api.get("/user-management/group-members/?group=admin"),
        api.get("/user-management/group-members/?group=teacher"),
        api.get("/user-management/group-members/?group=student"),
      ]);

      setAdmins(adminsRes.data.members || []);
      setTeachers(teachersRes.data.members || []);
      setStudents(studentsRes.data.members || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (group) => {
    if (!newEmail || !newEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    try {
      await api.post("/user-management/manage-member/", {
        email: newEmail.trim(),
        group,
        action: "add",
      });
      setNewEmail("");

      setTimeout(async () => {
        await fetchUsers();
      }, 1000);
    } catch (error) {
      alert("Failed to add user: " + error.message);
    }
  };

  const handleRemove = async (email, group) => {
    if (!confirm(`Remove ${email} from ${group} group?`)) return;

    try {
      setRemoveEmail(email);
      await api.post("/user-management/manage-member/", {
        email,
        group,
        action: "remove",
      });

      setTimeout(async () => {
        await fetchUsers();
      }, 1000);
    } catch (error) {
      console.error("Remove error:", error);
      alert("Failed to remove user");
    } finally {
      setRemoveEmail(null);
    }
  };

  const handleFileUpload = async (email, file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    try {
      setUploadingFor(email);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("student_email", email);

      await api.post("/user-management/upload-plan/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Plan uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload plan");
    } finally {
      setUploadingFor(null);
    }
  };

  const triggerFileInput = (email) => {
    const input = document.getElementById(`file-input-${email}`);
    input.click();
  };

  if (loading) {
    return <LoadingSpinner message={t("admin_dashboard.users_mgmt.loading")} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchUsers} />;
  }

  if (admins.length === 0 && teachers.length === 0 && students.length === 0) {
    return (
      <EmptyState
        icon={UsersIcon}
        title={t("admin_dashboard.users_mgmt.no_users")}
        message={t("admin_dashboard.users_mgmt.no_users_message")}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("admin_dashboard.users_mgmt.title")}
      </h2>

      {/* Admins */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-3 badge badge--blue">
          {t("admin_dashboard.users_mgmt.admins")} ({admins.length})
        </h3>
        <ul className="space-y-2 mb-4">
          {admins.map((email) => (
            <li
              key={email}
              className="flex justify-between items-center p-3 border rounded-lg normal_text_2"
            >
              <span>{email}</span>
              <button
                onClick={() => handleRemove(email, "admin")}
                className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-2"
                disabled={removeEmail === email}
              >
                <Trash2 size={16} />
                {removeEmail === email ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="admin@utp.bg"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="custom_input flex-1"
          />
          <button
            onClick={() => handleAdd("admin")}
            className="custom_button custom_button--small"
          >
            {t("admin_dashboard.users_mgmt.add_admin")}
          </button>
        </div>
      </section>

      {/* Teachers */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-3 badge badge--green">
          {t("admin_dashboard.users_mgmt.teachers")} ({teachers.length})
        </h3>
        <ul className="space-y-2 mb-4">
          {teachers.map((email) => (
            <li
              key={email}
              className="flex justify-between items-center p-3 border rounded-lg normal_text_2"
            >
              <span>{email}</span>
              <button
                onClick={() => handleRemove(email, "teacher")}
                className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-2"
                disabled={removeEmail === email}
              >
                <Trash2 size={16} />
                {removeEmail === email ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="teacher@utp.bg"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="custom_input flex-1"
          />
          <button
            onClick={() => handleAdd("teacher")}
            className="custom_button custom_button--small"
          >
            {t("admin_dashboard.users_mgmt.add_teacher")}
          </button>
        </div>
      </section>

      {/* Students */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-3 badge badge--red">
          {t("admin_dashboard.users_mgmt.students")} ({students.length})
        </h3>
        <ul className="space-y-2 mb-4">
          {students.map((email) => (
            <li
              key={email}
              className="flex justify-between items-center p-3 border rounded-lg normal_text_2"
            >
              <span className="flex-1">{email}</span>

              <div className="flex items-center gap-2">
                <input
                  id={`file-input-${email}`}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload(email, e.target.files[0])}
                  className="hidden"
                />

                <button
                  onClick={() => triggerFileInput(email)}
                  disabled={uploadingFor === email}
                  className="custom_button custom_button--small flex items-center gap-2"
                >
                  {uploadingFor === email ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload Plan
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleRemove(email, "student")}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-2"
                  disabled={removeEmail === email}
                >
                  <Trash2 size={16} />
                  {removeEmail === email ? "Removing..." : "Remove"}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="student@utp.bg"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="custom_input flex-1"
          />
          <button
            onClick={() => handleAdd("student")}
            className="custom_button custom_button--small"
          >
            {t("admin_dashboard.users_mgmt.add_student")}
          </button>
        </div>
      </section>
      {/* Supervision Assignments */}
      <AdminSupervisions teachers={teachers} students={students} />
    </div>
  );
}