import React from "react";
import CoursesList from "../components/Dashboard/CoursesList";
import UserCard from "../components/Dashboard/UserCard";
import AIAssistant from "../components/Dashboard/AIAssistant";
import Footer from "../components/Footer";


function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const aiAssistantRef = React.useRef();

  const handleCourseAnalysis = (courseId, courseName) => {
    // Open AI assistant and trigger course analysis
    if (aiAssistantRef.current) {
      aiAssistantRef.current.openAndAnalyzeCourse(courseId, courseName);
    }
  };

  const handlePlanAnalysis = () => {
    // Open AI assistant and trigger plan analysis
    if (aiAssistantRef.current) {
      aiAssistantRef.current.openAndAnalyzePlan();
    }
  };


  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8 space-y-20 flex-grow">
        <UserCard user={user} onPlanAnalysis={handlePlanAnalysis} />
        <CoursesList  onCourseAnalysis={handleCourseAnalysis} />
      </main>

      {/* AI Assistant */}
      <AIAssistant ref={aiAssistantRef} user={user} />

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
  );
}

export default Dashboard;
