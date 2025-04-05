import { TypographyH2 } from '../ui/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import useAuthenticationQuery from '@/services/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '@/store/auth/auth.slice';
import { RootState } from '@/store';
import { getInitialName } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const [avatarPreview, setAvatarPreview] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { signOutUser } = useAuthenticationQuery();

  const onClickSignOut = async () => {
    await signOutUser.mutate(undefined, {
      onSuccess: () => {
        dispatch(signOut());
      },
    });
  };

  useEffect(() => {
    if (currentUser?.avatar) {
      setAvatarPreview(
        currentUser.avatar.startsWith('data:image')
          ? currentUser.avatar
          : `data:image/png;base64,${currentUser.avatar}`
      );
    }
  }, [currentUser]);

  return (
    <nav className='px-4 py-6 flex justify-between items-center'>
      <div
        className='cursor-pointer'
        onClick={() => {
          navigate('/');
        }}
      >
        <TypographyH2>noted!</TypographyH2>
      </div>

      <div className='flex gap-4 items-center'>
        {currentUser ? (
          <>
            <span>Hi, {currentUser.username}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className='w-9 h-9 cursor-pointer'>
                  <AvatarImage
                    src={avatarPreview}
                    alt='@shadcn'
                    className='object-cover'
                  />
                  <AvatarFallback className='border-2'>
                    {currentUser.avatar
                      ? currentUser.avatar
                      : getInitialName(currentUser.username)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56'>
                <DropdownMenuLabel className='truncate block'>
                  {currentUser.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => {
                      navigate('profile');
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onClickSignOut}
                  className='cursor-pointer'
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Sidebar;
