import { TypographyH2 } from '../ui/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import useAuthenticationQuery from '@/services/authentication';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '@/store/auth/auth.slice';
import { RootState } from '@/store';
import { getInitialName } from '@/lib/utils';
import CreateNewNoteDialog from '@/pages/authenticated/dashboard/components/create-new-note-dialog';

const Sidebar = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { signOutUser } = useAuthenticationQuery();

  const onClickSignOut = async () => {
    await signOutUser.mutate(undefined, {
      onSuccess: () => {
        dispatch(signOut());
      },
    });
  };

  return (
    <nav className='px-4 py-6 flex justify-between items-center'>
      <TypographyH2>noted!</TypographyH2>

      <div className='flex gap-4 items-center'>
        <CreateNewNoteDialog />

        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className='w-9 h-9 '>
                <AvatarImage
                  src='https://github.com/shadcsn.png'
                  alt='@shadcn'
                />
                <AvatarFallback className='border-2'>
                  {getInitialName(currentUser.username)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuLabel>{currentUser.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Email</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>More...</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  New Team
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>GitHub</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem disabled>API</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClickSignOut}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </nav>
  );
};

export default Sidebar;
