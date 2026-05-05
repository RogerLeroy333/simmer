'use client';
import { usePathname, useRouter } from 'next/navigation';

const tabs = [
  { name: 'Home', path: '/', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
  )},
  { name: 'Browse', path: '/browse', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
  )},
  { name: 'Library', path: '/library', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="1.5"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
  )},
  { name: 'Profile', path: '/profile', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F4EBD9" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )},
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="tab-bar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
        return (
          <button
            key={tab.name}
            onClick={() => router.push(tab.path)}
            className={`tab ${isActive ? 'active' : ''}`}
          >
            {tab.icon}
            <span className="tab-lbl">{tab.name}</span>
          </button>
        );
      })}
    </div>
  );
}
