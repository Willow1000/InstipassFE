// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Privacy Policy',
  description:"Instipass Privacy Policy"
};

import PrivacyPolicy from "../../pages/instipass/privacyPolicy"

export default function Page() {
  return <PrivacyPolicy />;
}
