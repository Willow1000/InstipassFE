// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Signup Successful',
  description:"Institution Signup Successful"
};

import SignupSuccessPage from "../../../../pages/institutions/institutionregistersuccess"

export default function Page() {
  return <SignupSuccessPage />;
}
