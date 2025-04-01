import { useForm } from 'react-hook-form';
import { editProfileSchema, TypeEditProfileSchema } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fileToBase64, getInitialName } from '@/lib/utils';
import { ChangeEvent, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TypographyH4 } from '@/components/ui/typography';

const EditProfile = () => {
  const [avatarPreview, setAvatarPreview] = useState('');
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<TypeEditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      avatar: null,
      username: currentUser?.username,
    },
  });

  const onClickEdit = async (values: TypeEditProfileSchema) => {
    let base64;

    if (values.avatar) {
      base64 = await fileToBase64(values.avatar);
    } else {
      base64 = null;
    }

    const payload = {
      ...values,
      avatar: base64,
    };

    console.log({ payload });
  };

  return (
    <Card className='p-4 flex'>
      <CardContent className='p-0 flex flex-col gap-4'>
        <TypographyH4>Profile</TypographyH4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onClickEdit)}
            className='flex flex-col gap-4'
          >
            <Avatar
              className='w-40 h-40 cursor-pointer'
              onClick={() => {
                if (avatarRef.current) {
                  avatarRef.current.click();
                }
              }}
            >
              <AvatarImage
                src={avatarPreview}
                alt='@shadcn'
                className='object-cover'
              />
              <AvatarFallback className='border-2 text-4xl'>
                {currentUser
                  ? currentUser.avatar
                    ? currentUser.avatar
                    : getInitialName(currentUser.username)
                  : null}
              </AvatarFallback>
            </Avatar>

            <FormField
              control={form.control}
              name='avatar'
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ref, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='image/*'
                      ref={avatarRef}
                      {...fieldProps}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          const displayUrl = URL.createObjectURL(file);
                          setAvatarPreview(displayUrl);
                          if (file.size > 512 * 1024) {
                            toast.error('Image must be less than 512Kb.');
                          }
                        }

                        onChange(event.target.files && event.target.files[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type='username' placeholder='Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProfile;
