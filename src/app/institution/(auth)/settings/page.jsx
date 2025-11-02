// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Institution Preferences',
  description:"Institution Settings"
};

import InstitutionSettingsForm from "../../../pages/institutions/settings"

export default function Page() {
  return <InstitutionSettingsForm />;
}
