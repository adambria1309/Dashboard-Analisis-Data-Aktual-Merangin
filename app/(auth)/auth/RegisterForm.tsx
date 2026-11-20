'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createUserWithEmailAndPassword, inMemoryPersistence, sendEmailVerification, setPersistence, signOut } from 'firebase/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getFirebaseAuthErrorMessage } from '@/lib/firebase-auth-errors';
import { firebaseAuth } from '@/lib/firebase-client';

const formSchema = z.object({
    name: z.string().trim().min(2, { message: 'Nama minimal 2 karakter.' }).max(80),
    email: z.string().trim().email({ message: 'Masukkan alamat email yang valid.' }),
    password: z.string().min(8, { message: 'Kata sandi minimal 8 karakter.' }).max(128),
    confirmPassword: z.string(),
}).refine((values) => values.password === values.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak sama.',
    path: ['confirmPassword'],
});

const RegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError(null);
    setSuccessMessage(null);
    let shouldSignOut = false;
    let accountCreated = false;

    try {
      await setPersistence(firebaseAuth, inMemoryPersistence);
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        data.email.trim(),
        data.password,
      );
      shouldSignOut = true;
      accountCreated = true;
      await sendEmailVerification(credential.user);
      await signOut(firebaseAuth).catch(() => undefined);
      shouldSignOut = false;
      form.reset({
        name: data.name,
        email: data.email.trim(),
        password: '',
        confirmPassword: '',
      });
      setSuccessMessage(`Tautan verifikasi sudah dikirim ke ${data.email.trim()}. Verifikasi email, lalu masuk.`);
    } catch (error) {
      setServerError(
        accountCreated
          ? 'Akun sudah dibuat, tetapi tautan verifikasi gagal dikirim. Coba masuk untuk meminta tautan baru.'
          : getFirebaseAuthErrorMessage(error, 'Akun tidak dapat dibuat. Coba lagi.'),
      );
    } finally {
      if (shouldSignOut) await signOut(firebaseAuth).catch(() => undefined);
    }
  };

  return (
    <>
        <Card>
            <CardHeader>
                <CardTitle>Buat akun pengguna</CardTitle>
                <CardDescription>
                    Verifikasi email sebelum masuk. Akun baru mendapat peran Pengguna.
                </CardDescription>
                <CardContent className='space-y-2'>
                    {successMessage && <p role='status' className='text-sm font-medium text-emerald-700 dark:text-emerald-300'>{successMessage}</p>}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}
                            className='space-y-6'
                        >
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-medium'>
                                    Nama
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        autoComplete='name'
                                        placeholder='Nama lengkap'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-medium'>
                                    Email
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        type='email'
                                        autoComplete='email'
                                        placeholder='nama@contoh.id'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-medium'>
                                    Kata sandi
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        type='password'
                                        autoComplete='new-password'
                                        placeholder='Minimal 8 karakter'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-sm font-medium'>
                                    Ulangi kata sandi
                                    </FormLabel>
                                    <FormControl>
                                    <Input
                                        className='bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0'
                                        type='password'
                                        autoComplete='new-password'
                                        placeholder='Ulangi kata sandi'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            {serverError && <p role='alert' className='text-sm font-medium text-destructive'>{serverError}</p>}
                            <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Membuat akun…' : 'Daftar sebagai Pengguna'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </CardHeader>
        </Card>      
    </>
  );
};

export default RegisterForm;
