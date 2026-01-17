import React from "react";
import CoursesList from "../components/dashboard/CoursesList";
import UserCard from "../components/dashboard/UserCard";
import Footer from "../components/Footer";
function Dashboard() {
 const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div >
      <UserCard user={user}/>
      <CoursesList />
      <Footer />
    </div>
  );
}

export default Dashboard;
