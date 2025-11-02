// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Student Registration Form',
  description:"Student Registration"
};

import StudentRegistrationForm from "../pages/students/studentsregister"

export default function Page() {
  return <StudentRegistrationForm />;
}
