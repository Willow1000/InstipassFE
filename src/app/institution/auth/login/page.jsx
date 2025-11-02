// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution auth',
  description:"auth"
};

import SessionVerification from "../../../pages/institutions/institutionsessionvalidator";

export default function Page() {
  return <SessionVerification/>;
}
