import React from "react";
<<<<<<< HEAD
import CoursesList from "../components/dashboard/CoursesList";
import UserCard from "../components/dashboard/UserCard";
import Footer from "../components/Footer";
function Dashboard() {
 const user = JSON.parse(localStorage.getItem("user"));

  return (
     <div className="flex flex-col min-h-screen">
  <main className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8 space-y-20 flex-grow">
    <UserCard user={user} />
    <CoursesList />
  </main>

  <footer className="w-full">
    <Footer />
  </footer>
</div>
=======
import CoursesList from "../components/Dashboard/CoursesList";
import UserCard from "../components/Dashboard/UserCard";
import Footer from "../components/Footer";


function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8 space-y-20 flex-grow">
        <UserCard user={user} />
        <CoursesList />
      </main>

      <footer className="w-full">
        <Footer />
      </footer>
    </div>
>>>>>>> origin/master
  );
}

export default Dashboard;
