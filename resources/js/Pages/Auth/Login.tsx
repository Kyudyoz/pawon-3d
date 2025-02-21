import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

import { Head, Link, useForm } from "@inertiajs/react";

import React from "react";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    username: "",
    password: "",
    remember: false as boolean,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    post(route("login"));
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
              {(errors.username || errors.password) && (
                <div className="mt-1 text-sm text-red-600 text-center">
                  Login gagal, cek kembali username dan password!
                </div>
              )}
              <div>
                <Label htmlFor="username" className="block mb-1">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={(e) => setData("username", e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full"
                />
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
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData("remember", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Ingat saya
                  </label>
                </div>
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
