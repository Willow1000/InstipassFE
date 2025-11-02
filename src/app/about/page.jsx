// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'About',
  description:"Instipass About Page"
};

import AboutPage from '../pages/about'

export default function Page() {
  return <AboutPage />;
}
