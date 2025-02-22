<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('User/Index', [
            'users' => User::orderBy('created_at', 'asc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'username' => ['required', 'string', 'unique:users,username', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:pemilik,produksi,kasir'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 50 karakter.',

            'username.required' => 'Username wajib diisi.',
            'username.string' => 'Username harus berupa teks.',
            'username.unique' => 'Username sudah digunakan, silakan pilih yang lain.',
            'username.max' => 'Username maksimal 20 karakter.',

            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal 8 karakter.',

            'role.required' => 'Peran wajib dipilih.',
            'role.in' => 'Peran tidak valid.',
        ]);

        $validatedData['password'] = bcrypt($validatedData['password']);

        User::create($validatedData);

        return redirect()->route('user.index')->with('success', 'Pengguna berhasil ditambahkan!');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:50'],
            'username' => ['required', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'in:pemilik,produksi,kasir'],
            'password' => ['nullable', 'min:8'],
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 50 karakter.',

            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username sudah digunakan, silakan pilih yang lain.',

            'role.required' => 'Peran wajib dipilih.',
            'role.in' => 'Peran tidak valid.',

            'password.min' => 'Password minimal 8 karakter.',
        ]);

        // Update hanya field yang diberikan
        $user->update([
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
        ]);

        return redirect()->route('user.index')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('user.index')->with('success', 'Pengguna berhasil dihapus!');
    }
}
