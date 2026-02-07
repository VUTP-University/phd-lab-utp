import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, ExternalLink, AlertCircle, CheckCircle, Video, Calendar } from "lucide-react";
import api from "../../../api.js";

function CoursesList() {
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
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleExpand(course.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="secondary_text font-semibold">{course.name}</h3>
                      
                      {/* Badges */}
                      {details && details.open_count > 0 && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded flex items-center gap-1">
                          <AlertCircle size={12} />
                          {details.open_count} open
                        </span>
                      )}
                      {details && details.events_count > 0 && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded flex items-center gap-1">
                          <Calendar size={12} />
                          {details.events_count} events
                        </span>
                      )}
                    </div>
                    <p className="normal_text text-sm text-gray-600">{course.section || course.descriptionHeading}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded text-sm ${course.courseState === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {course.courseState}
                    </span>
                    
                    <a 
                      href={course.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="custom_button flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Open <ExternalLink size={16} />
                    </a>
                    
                    {expandedId === course.id ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === course.id && (
                  <div className="border-t p-4 bg-gray-50">
                    {isLoading ? (
                      <p className="text-center text-gray-500">Loading details...</p>
                    ) : details ? (
                      <div className="space-y-4">
                        {/* Open Assignments */}
                        {details.open_assignments?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                              <AlertCircle size={18} />
                              Open Assignments ({details.open_assignments.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.open_assignments.map(assignment => (
                                <li key={assignment.id} className="bg-white p-3 rounded border">
                                  <p className="font-medium">{assignment.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {assignment.dueDate ? 
                                      `Due: ${new Date(
                                        assignment.dueDate.year,
                                        assignment.dueDate.month - 1,
                                        assignment.dueDate.day
                                      ).toLocaleDateString()}` 
                                      : 'No due date'}
                                  </p>
                                  {assignment.maxPoints && (
                                    <p className="text-sm text-gray-600">Points: {assignment.maxPoints}</p>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Graded Assignments */}
                        {details.graded_assignments?.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <CheckCircle size={18} />
                              Graded Assignments ({details.graded_assignments.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.graded_assignments.map(assignment => (
                                <li key={assignment.id} className="bg-white p-3 rounded border">
                                  <p className="font-medium">{assignment.title}</p>
                                  <p className="text-sm text-gray-600">
                                    Grade: {assignment.grade ?? 'Not graded'} / {assignment.maxPoints ?? 'N/A'}
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
                              Upcoming Events ({details.calendar_events.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.calendar_events.map((event, idx) => (
                                <li key={idx} className="bg-white p-3 rounded border">
                                  <p className="font-medium">{event.title}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(event.start).toLocaleString()}
                                  </p>
                                  {event.link && (
                                    <a 
                                      href={event.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-purple-600 text-sm hover:underline"
                                    >
                                      View in Calendar
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
                              Google Meet Links ({details.meet_links.length})
                            </h4>
                            <ul className="space-y-2">
                              {details.meet_links.map((meet, idx) => (
                                <li key={idx} className="bg-white p-3 rounded border">
                                  <a 
                                    href={meet.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-2"
                                  >
                                    <Video size={16} />
                                    Join Meeting
                                  </a>
                                  <p className="text-xs text-gray-500 mt-1">{meet.announcement}</p>
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
                          <p className="text-gray-500 text-center">No assignments, meetings, or events found</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-red-500">Failed to load details</p>
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

export default CoursesList;