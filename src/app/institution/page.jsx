// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution Dashboard',
  description:"Institution Dashboard"
};

import InstitutionDashboard from "../pages/institutions/institutiondashboard"

export default function Page() {
  return <InstitutionDashboard />;
}
