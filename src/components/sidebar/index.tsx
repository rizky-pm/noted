import { TypographyH2 } from '../ui/typography';
import { NavLink } from 'react-router-dom';

import { SIDEBAR_MENU } from '@/constant';
import { Button } from '../ui/button';
import useAuthenticationQuery from '@/services/authentication';
import { useDispatch } from 'react-redux';
import { signOut } from '@/features/auth/auth.slice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { signOutUser } = useAuthenticationQuery();

  const onClickSignOut = async () => {
    await signOutUser.mutate(undefined, {
      onSuccess: () => {
        dispatch(signOut());
      },
    });
  };

  return (
    <nav className='sticky top-0 p-4 bg-primary text-primary-foreground w-1/6 h-screen'>
      <TypographyH2>Noted!</TypographyH2>
      <ul className='flex flex-col gap-2 mt-4 h-[calc(100%-(3.75rem))]'>
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
        <li className='mt-auto'>
          <Button
            variant={'destructive'}
            onClick={onClickSignOut}
            className='w-full'
            size={'sm'}
          >
            Sign out
          </Button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
