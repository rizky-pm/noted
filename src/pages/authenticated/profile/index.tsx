import { TypographyH3 } from '@/components/ui/typography';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

import TagsSetting from './components/tags-setting';
import EditProfile from './components/edit-profile';
import ChangePassword from './components/change-password';

const ProfilePage = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <section className='w-full p-4 flex flex-col gap-2'>
      <TypographyH3>{currentUser?.email}</TypographyH3>
      <EditProfile />
      <ChangePassword />
      <TagsSetting />
    </section>
  );
};

export default ProfilePage;
