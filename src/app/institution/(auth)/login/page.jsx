// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution Login',
  description:"Institution Login"
};

import InstitutionLogin from "../../../pages/institutions/institutionlogin"

export default function Page() {
  return <InstitutionLogin />;
}
