// app/page.jsx (Server Component — allowed to export metadata)

export const metadata= {
  title: 'Tutorials',
  description:"Tutorials"
};

import Tutorials from "../pages/tutorials/tutorials"

export default function Page() {
  return <Tutorials />;
}
