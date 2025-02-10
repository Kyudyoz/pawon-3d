import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

import { Head, Link, useForm } from '@inertiajs/react';

import React from 'react';


export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route('login'));
  }

  return (
    <>
      <Head title="Login" />
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Selamat Datang Kembali!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full"
                />
                {errors.email && (
                  <div className="mt-1 text-sm text-red-600">{errors.email}</div>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="block mb-1">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full"
                />
                {errors.password && (
                  <div className="mt-1 text-sm text-red-600">{errors.password}</div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={e => setData('remember', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="remember_me" className="ml-2 text-sm text-gray-700">
                    Ingat saya
                  </label>
                </div>
                <Link href={route('password.request')} className="text-sm text-indigo-600 hover:underline">
                  Lupa Password?
                </Link>
              </div>

              <div>
                <Button type="submit" disabled={processing} className="w-full">
                  Masuk
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
