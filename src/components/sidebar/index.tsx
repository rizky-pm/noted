import { TypographyH2 } from '../ui/typography';
import { NavLink } from 'react-router-dom';

import { SIDEBAR_MENU } from '@/constant';

const Sidebar = () => {
  return (
    <nav className='sticky top-0 p-4 bg-primary text-primary-foreground w-1/6 h-screen'>
      <TypographyH2>Logo</TypographyH2>
      <ul className='flex flex-col gap-2 mt-4'>
        {SIDEBAR_MENU.map((menu) => (
          <li key={menu.id}>
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                isActive ? 'navlink--active' : 'navlink'
              }
            >
              {menu.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
