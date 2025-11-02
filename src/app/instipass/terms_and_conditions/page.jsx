// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Privacy Policy',
  description:"Instipass Privacy Policy"
};

import TermsAndConditions from "../../pages/instipass/termsandconditions"

export default function Page() {
  return <TermsAndConditions />;
}
