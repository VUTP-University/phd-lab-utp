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
  Brain,
  BookOpen
} from "lucide-react";
import api from "../../../api.js";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorDisplay from "../../components/ErrorDisplay";
import EmptyState from "../../components/EmptyState";

export default function CoursesList({ onCourseAnalysis }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [courseDetails, setCourseDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});

  const { t } = useTranslation();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/classroom/visible-courses/');
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError(error.response?.data?.error || 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    if (courseDetails[courseId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await api.get(`/api/classroom/course/${courseId}/details/`);
      setCourseDetails(prev => ({ ...prev, [courseId]: response.data }));
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      setCourseDetails(prev => ({ 
        ...prev, 
        [courseId]: { error: 'Failed to load course details' } 
      }));
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

  if (loading) {
    return (
      <section className="primary_object py-6 mt-8 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner message={t("dashboard.loading")} />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="primary_object py-6 mt-8 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorDisplay error={error} onRetry={fetchCourses} />
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="primary_object py-6 mt-8 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={BookOpen}
            title={t("dashboard.no_courses_title") || "No Courses Available"}
            message={t("dashboard.no_courses_message") || "You don't have any visible courses yet. Contact your administrator."}
          />
        </div>
      </section>
    );
  }

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
                  className="flex items-center justify-between p-4 cursor-pointer transition"
                  onClick={() => handleExpand(course.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="secondary_text font-semibold normal_text">{course.name}</h3>
                      
                      {/* Badges */}
                      {details && !details.error && details.open_count > 0 && (
                        <span className="px-2 py-1 badge badge--orange text-xs rounded flex items-center gap-1">
                          <AlertCircle size={12} />
                          {details.open_count} {t("dashboard.course_cards.waiting")}
                        </span>
                      )}
                      {details && !details.error && details.events_count > 0 && (
                        <span className="px-2 py-1 badge badge--purple text-xs rounded flex items-center gap-1">
                          <Calendar size={12} />
                          {details.events_count} {t("dashboard.course_cards.event")}
                        </span>
                      )}
                    </div>
                    <p className="normal_text text-sm text-gray-600 dark:text-gray-400">{course.section || course.descriptionHeading}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
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

                    <span className={`px-3 py-1 rounded text-sm ${course.courseState === 'ACTIVE' ? 'badge badge--green' : 'badge badge--gray'}`}>
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
                      <LoadingSpinner message={t("dashboard.course_cards.loading_details")} />
                    ) : details?.error ? (
                      <div className="text-center py-4">
                        <p className="text-red-600 dark:text-red-400 normal_text_2">{details.error}</p>
                      </div>
                    ) : details ? (
                      <div className="space-y-4">

                        {/* Open Assignments */}
                        {details.open_assignments?.length > 0 && (
                          <div>
                            <h4 className="font-semibold badge badge--orange mb-2 flex items-center gap-2">
                              <AlertCircle size={18} />
                              {t("dashboard.course_cards.open_assignments")} ({details.open_assignments.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.open_assignments.map(assignment => (
                                <li key={assignment.id} className="p-3 rounded border dark:border-gray-600">
                                  <p className="font-medium normal_text">{assignment.title}</p>
                                  <p className="text-sm normal_text_3">
                                    {assignment.dueDate ? 
                                      `Due: ${new Date(
                                        assignment.dueDate.year,
                                        assignment.dueDate.month - 1,
                                        assignment.dueDate.day
                                      ).toLocaleDateString()}` 
                                      : t("dashboard.course_cards.no_due_date")}
                                  </p>
                                  {assignment.maxPoints && (
                                    <p className="text-sm normal_text_3">{t("dashboard.course_cards.grade")}: {assignment.maxPoints}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Graded Assignments */}
                        {details.graded_assignments?.length > 0 && (
                          <div>
                            <h4 className="font-semibold badge badge--green mb-2 flex items-center gap-2">
                              <CheckCircle size={18} />
                              {t("dashboard.course_cards.graded_assignments")} ({details.graded_assignments.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.graded_assignments.map(assignment => (
                                <li key={assignment.id} className="p-3 rounded border dark:border-gray-600">
                                  <p className="font-medium normal_text">{assignment.title}</p>
                                  <p className="text-sm normal_text_3">
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
                            <h4 className="font-semibold badge badge--blue mb-2 flex items-center gap-2">
                              <Calendar size={18} />
                              {t("dashboard.course_cards.upcoming_events")} ({details.calendar_events.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.calendar_events.map((event, idx) => (
                                <li key={idx} className="p-3 rounded border dark:border-gray-600">
                                  <p className="font-medium normal_text">{event.title}</p>
                                  <p className="text-sm normal_text_3">
                                    {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                                  </p>
                                  {event.link && (
                                    <a 
                                      href={event.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="badge badge--blue text-sm hover:underline inline-flex items-center gap-1 mt-2"
                                    >
                                      <ExternalLink size={12} />
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
                            <h4 className="font-semibold badge badge--purple mb-2 flex items-center gap-2">
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
                                    className="badge badge--purple inline-flex items-center gap-2 hover:underline"
                                  >
                                    <Video size={16} />
                                    {t("dashboard.course_cards.join_meet")}
                                  </a>
                                  <p className="text-xs normal_text_3 mt-1">{meet.announcement}</p>
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
                          <EmptyState
                            icon={BookOpen}
                            message={t("dashboard.course_cards.no_assignments")}
                          />
                        )}
                      </div>
                    ) : null}
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