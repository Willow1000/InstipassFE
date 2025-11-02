// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution Signup',
  description:"Institution Signup"
};

import InstitutionRegister from "../../../pages/institutions/institutionsignup"

export default function Page() {
  return <InstitutionRegister />;
}
