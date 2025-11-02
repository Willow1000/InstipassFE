// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution Details Form',
  description:"Institution Details form"
};

import InstitutionDetailsForm from "../../../pages/institutions/institutiondetails"

export default function Page() {
  return <InstitutionDetailsForm />;
}
