// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Signup Successful',
  description:"Student Registration Successful"
};

import StudentSignupSuccessPage from "../../pages/students/studentregistrationsuccess"

export default function Page() {
  return <StudentSignupSuccessPage/>;
}
