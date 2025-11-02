// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: "Student's Tutorial",
  description:"Student's Tutorial"
};

import StudentTutorialPage from "../../pages/tutorials/tutorialsstudents"

export default function Page() {
  return <StudentTutorialPage />;
}
