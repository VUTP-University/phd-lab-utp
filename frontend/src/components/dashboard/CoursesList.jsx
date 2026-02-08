import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Video, 
  Calendar,
  Brain
} from "lucide-react";
import api from "../../../api.js";

export default function CoursesList({ onCourseAnalysis }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [courseDetails, setCourseDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  const { t } = useTranslation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('classroom/visible-courses/');
        setCourses(response.data.courses || []);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const fetchCourseDetails = async (courseId) => {
    if (courseDetails[courseId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await api.get(`classroom/course/${courseId}/details/`);
      setCourseDetails(prev => ({ ...prev, [courseId]: response.data }));
    } catch (error) {
      console.error('Failed to fetch course details:', error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleExpand = (courseId) => {
    const isExpanding = expandedId !== courseId;
    setExpandedId(isExpanding ? courseId : null);
    
    if (isExpanding) {
      fetchCourseDetails(courseId);
    }
  };

  if (loading) return <p className="normal_text text-center mt-10">{t("dashboard.loading")}</p>;
  if (error) return <p className="normal_text text-center mt-10 text-red-500">{t("dashboard.error")}</p>;

  return (
    <section className="primary_object py-6 mt-8 mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="primary_text mb-8">{t("dashboard.courses_title")}</h2>

        <div className="space-y-4">
          {courses.map((course) => {
            const details = courseDetails[course.id];
            const isLoading = loadingDetails[course.id];
            
            return (
              <div key={course.id} className="primary_object border rounded-lg overflow-hidden">
                {/* Header */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => handleExpand(course.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="secondary_text font-semibold normal_text">{course.name}</h3>
                      
                      {/* Badges */}
                      {details && details.open_count > 0 && (
                        <span className="px-2 py-1 bg-orange-600/50 text-orange-200 text-xs rounded flex items-center gap-1">
                          <AlertCircle size={12} />
                          {details.open_count} {t("dashboard.course_cards.waiting")}
                        </span>
                      )}
                      {details && details.events_count > 0 && (
                        <span className="px-2 py-1 bg-purple-600/50 text-purple-800 text-xs rounded flex items-center gap-1">
                          <Calendar size={12} />
                          {details.events_count} {t("dashboard.course_cards.event")}
                        </span>
                      )}
                    </div>
                    <p className="normal_text text-sm text-gray-600 dark:text-gray-400">{course.section || course.descriptionHeading}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* AI Insights Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onCourseAnalysis) {
                          onCourseAnalysis(course.id, course.name);
                        }
                      }}
                      className="custom_button custom_button--small flex items-center gap-2"
                    >
                      <Brain size={16} />
                      <span className="hidden sm:inline">{t("dashboard.course_cards.ai_insight")}</span>
                    </button>

                    <span className={`px-3 py-1 rounded text-sm ${course.courseState === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {course.courseState}
                    </span>
                    
                    <a 
                      href={course.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="custom_button custom_button--medium flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={16} />
                      <span className="hidden sm:inline">{t("dashboard.course_cards.open_classroom")}</span>
                    </a>
                    
                    {expandedId === course.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === course.id && (
                  <div className="border-t p-4">
                    {isLoading ? (
                      <p className="text-center text-gray-500">{t("dashboard.course_cards.loading_details")}</p>
                    ) : details ? (
                      <div className="space-y-4">
                        {/* Open Assignments */}
                        {details.open_assignments?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-orange-700 dark:text-orange-700 mb-2 flex items-center gap-2">
                              <AlertCircle size={18} />
                              {t("dashboard.course_cards.open_assignments")} ({details.open_assignments.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.open_assignments.map(assignment => (
                                <li key={assignment.id} className="rounded border dark:border-gray-600">
                                  <p className="font-medium normal_text">{assignment.title}</p>
                                  <p className="text-sm text-gray-700 dark:text-gray-700">
                                    {assignment.dueDate ? 
                                      `Due: ${new Date(
                                        assignment.dueDate.year,
                                        assignment.dueDate.month - 1,
                                        assignment.dueDate.day
                                      ).toLocaleDateString()}` 
                                      : t("dashboard.course_cards.no_due_date")}
                                  </p>
                                  {assignment.maxPoints && (
                                    <p className="text-sm text-gray-700 dark:text-gray-700">Points: {assignment.maxPoints}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Graded Assignments */}
                        {details.graded_assignments?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-700 dark:text-green-700 mb-2 flex items-center gap-2">
                              <CheckCircle size={18} />
                              {t("dashboard.course_cards.graded_assignments")} ({details.graded_assignments.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.graded_assignments.map(assignment => (
                                <li key={assignment.id} className="p-3 rounded border dark:border-gray-600">
                                  <p className="font-medium normal_text">{assignment.title}</p>
                                  <p className="text-sm text-gray-800 dark:text-gray-800">
                                    {t("dashboard.course_cards.grade")} {assignment.grade ?? t("dashboard.course_cards.not_graded_assignments")} / {assignment.maxPoints ?? 'N/A'}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Calendar Events */}
                        {details.calendar_events?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                              <Calendar size={18} />
                              {t("dashboard.course_cards.upcoming_events")} ({details.calendar_events.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.calendar_events.map((event, idx) => (
                                <li key={idx} className="p-3 rounded border dark:border-gray-600">
                                  <p className="font-medium normal_text">{event.title}</p>
                                  <p className="text-sm text-gray-800">
                                    {new Date(event.start).toLocaleString()}
                                  </p>
                                  {event.link && (
                                    <a 
                                      href={event.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-purple-600 dark:text-purple-400 text-sm hover:underline"
                                    >
                                      {t("dashboard.course_cards.view_in_calendar")}
                                    </a>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Meet Links */}
                        {details.meet_links?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                              <Video size={18} />
                              {t("dashboard.course_cards.google_meet")} ({details.meet_links.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.meet_links.map((meet, idx) => (
                                <li key={idx} className="p-3 rounded border dark:border-gray-600">
                                  <a 
                                    href={meet.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-2"
                                  >
                                    <Video size={16} />
                                    {t("dashboard.course_cards.join_meet")}
                                  </a>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{meet.announcement}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* No data */}
                        {!details.open_assignments?.length && 
                         !details.graded_assignments?.length && 
                         !details.meet_links?.length && 
                         !details.calendar_events?.length && (
                          <p className="text-gray-500 dark:text-gray-400 text-center">{t("dashboard.course_cards.no_assignments")}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-red-500">{t("dashboard.course_cards.error")}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}