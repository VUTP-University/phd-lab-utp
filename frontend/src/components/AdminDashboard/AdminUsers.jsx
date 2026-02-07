import React, { useEffect, useState } from "react";
import api from "../../../api.js";
import { useTranslation } from "react-i18next";
import { redirect } from "react-router-dom";

export default function AdminUsers() {
  const { t } = useTranslation();

  const [admins, setAdmins] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [removeEmail, setRemoveEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const [adminsRes, studentsRes] = await Promise.all([
        api.get("/user-management/group-members/?group=admin"),
        api.get("/user-management/group-members/?group=student"),
      ]);
      setAdmins(adminsRes.data.members);
      setStudents(studentsRes.data.members);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
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

      // Small delay for Google API to propagate
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

      // Small delay for Google API to propagate
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 secondary_text">
        {t("admin_dashboard.users_mgmt.title")}
      </h2>

      {/* Admins */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-3 normal_text">
          {t("admin_dashboard.users_mgmt.admins")} ({admins.length})
        </h3>
        <ul className="space-y-2 mb-4">
          {admins.map((email) => (
            <li
              key={email}
              className="flex justify-between items-center p-2 border rounded normal_text_2"
            >
              <span>{email}</span>
              <button
                onClick={() => handleRemove(email, "admin")}
                className="text-red-600 disabled:opacity-50"
              >
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
            className="border px-3 py-2 flex-1"
          />
          <button onClick={() => handleAdd("admin")} className="custom_button custom_button--small">
            Add Admin
          </button>
        </div>
      </section>

      {/* Students */}
      <section>
        <h3 className="text-xl font-bold mb-3 normal_text">
          {t("admin_dashboard.users_mgmt.students")} ({students.length})
        </h3>
        <ul className="space-y-2 mb-4">
          {students.map((email) => (
            <li
              key={email}
              className="flex justify-between items-center p-2 border rounded normal_text_2"
            >
              <span>{email}</span>
              <button
                onClick={() => handleRemove(email, "student")}
                className="text-red-600 disabled:opacity-50"
              >
                {removeEmail === email ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="student@utp.bg"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border px-3 py-2 flex-1"
          />
          <button
            onClick={() => handleAdd("student")}
            className="custom_button custom_button--small"
          >
            Add Student
          </button>
        </div>
      </section>
    </div>
  );
}
