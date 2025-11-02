// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution Tutorial',
  description:"Institution Tutorial"
};

import InstitutionTutorialPage from "../../pages/tutorials/tutorialsinstitutions"

export default function Page() {
  return <InstitutionTutorialPage />;
}
