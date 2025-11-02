
import CreateProgramForm from "./CreateProgramForm";
import CreateCourseForm from "./CreateCourseForm";
import Header from "../Header";
export default function AdminProgramsPage() {
  return (
    <div className="space-y-10 p-8">
        <Header/>
      <CreateCourseForm />
      <CreateProgramForm />
    </div>
  );
}
