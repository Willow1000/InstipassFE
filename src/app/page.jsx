// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Home',
  description:"Instipass Homepage"
};

import HomePage from './pages/home'

export default function Page() {
  return <HomePage />;
}
