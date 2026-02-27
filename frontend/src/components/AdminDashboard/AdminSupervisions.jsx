import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Link } from "lucide-react";
import api from "../../../api.js";

export default function AdminSupervisions({ teachers, students }) {
  const { t } = useTranslation();
  const [supervisions, setSupervisions] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchSupervisions();
  }, []);

  const fetchSupervisions = async () => {
    try {
      const res = await api.get("/api/user-management/supervisions/");
      setSupervisions(res.data.supervisions || []);
    } catch (error) {
      console.error("Error fetching supervisions:", error);
    }
  };

  const handleAssign = async () => {
    if (!selectedSupervisor || !selectedStudent) {
      alert(t("admin_dashboard.users_mgmt.select_both"));
      return;
    }

    try {
      setAdding(true);
      await api.post("/api/user-management/supervisions/", {
        supervisor_email: selectedSupervisor,
        student_email: selectedStudent,
      });
      setSelectedSupervisor("");
      setSelectedStudent("");
      await fetchSupervisions();
    } catch (error) {
      if (error.response?.status === 400) {
        alert(t("admin_dashboard.users_mgmt.already_assigned"));
      } else {
        alert(t("admin_dashboard.users_mgmt.assign_error"));
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (supervision) => {
    if (!confirm(`${t("admin_dashboard.users_mgmt.remove_confirm")} ${supervision.supervisor_email} → ${supervision.student_email}?`)) return;

    try {
      setRemoving(supervision.id);
      await api.delete("/api/user-management/supervisions/", {
        data: { id: supervision.id },
      });
      setSupervisions((prev) => prev.filter((s) => s.id !== supervision.id));
    } catch (error) {
      console.error("Remove error:", error);
      alert(t("admin_dashboard.users_mgmt.remove_error"));
    } finally {
      setRemoving(null);
    }
  };

  // Group by supervisor for display
  const bySupervisor = supervisions.reduce((acc, s) => {
    if (!acc[s.supervisor_email]) acc[s.supervisor_email] = [];
    acc[s.supervisor_email].push(s);
    return acc;
  }, {});

  return (
    <section className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-1 secondary_text flex items-center gap-2">
        <Link size={20} />
        {t("admin_dashboard.users_mgmt.supervisions_title")}
      </h3>
      <p className="text-sm normal_text_2 mb-5">
        {t("admin_dashboard.users_mgmt.supervisions_description")}
      </p>

      {/* Assign form */}
      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium normal_text_2">
            {t("admin_dashboard.users_mgmt.select_supervisor")}
          </label>
          <select
            value={selectedSupervisor}
            onChange={(e) => setSelectedSupervisor(e.target.value)}
            className="custom_input"
          >
            <option value="">—</option>
            {teachers.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium normal_text_2">
            {t("admin_dashboard.users_mgmt.select_student")}
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="custom_input"
          >
            <option value="">—</option>
            {students.map((email) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          disabled={adding || !selectedSupervisor || !selectedStudent}
          className="custom_button custom_button--small disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? t("admin_dashboard.users_mgmt.assigning") : t("admin_dashboard.users_mgmt.assign")}
        </button>
      </div>

      {/* Current assignments */}
      {supervisions.length === 0 ? (
        <p className="text-sm normal_text_2 italic">
          {t("admin_dashboard.users_mgmt.no_supervisions")}
        </p>
      ) : (
        <div className="space-y-4">
          {Object.entries(bySupervisor).map(([supervisor, pairs]) => (
            <div key={supervisor}>
              <p className="text-sm font-semibold normal_text mb-1">{supervisor}</p>
              <ul className="space-y-1 pl-4">
                {pairs.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center p-2 border rounded-lg normal_text_2"
                  >
                    <span className="text-sm">↳ {s.student_email}</span>
                    <button
                      onClick={() => handleRemove(s)}
                      disabled={removing === s.id}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      <span className="text-xs">
                        {removing === s.id ? t("admin_dashboard.users_mgmt.removing") : t("admin_dashboard.users_mgmt.remove")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
