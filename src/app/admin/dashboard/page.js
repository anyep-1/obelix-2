"use client";

import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import apiService from "@/app/services/apiServices";
import ButtonAdd from "@/components/all/ButtonAdd";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Kaprodi", label: "Kaprodi" },
  { value: "DosenKoor", label: "Dosen Koordinator" },
  { value: "DosenAmpu", label: "Dosen Pengampu" },
  { value: "GugusKendaliMutu", label: "Gugus Kendali Mutu" },
  { value: "Evaluator", label: "Evaluator" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user_id: null,
    nama: "",
    username: "",
    password: "",
    role: "Admin",
  });
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiService.get("/users/list");
        setUsers(res);
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Gagal mengambil data pengguna.");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi: hanya boleh satu Kaprodi
    if (!isEdit && form.role === "Kaprodi") {
      const kaprodiExists = users.some((user) => user.role === "Kaprodi");
      if (kaprodiExists) {
        setMessage(
          "Akun Kaprodi sudah ada. Hanya satu Kaprodi yang diizinkan."
        );
        return;
      }
    }

    try {
      if (isEdit) {
        const res = await apiService.patch("/users/edit", form);
        setMessage(res.message);
        setUsers(
          users.map((user) => (user.user_id === form.user_id ? res.user : user))
        );
      } else {
        const res = await apiService.post("/users/create", form);
        setMessage(res.message);
        setUsers([...users, res.user]);
      }

      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      setMessage("Gagal menyimpan data pengguna.");
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: "" });
    setIsOpen(true);
    setIsEdit(true);
    setMessage("");
  };

  const handleDelete = async (user_id) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await apiService.delete(`/users/delete?user_id=${user_id}`);
      setUsers(users.filter((user) => user.user_id !== user_id));
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Gagal menghapus pengguna.");
    }
  };

  const resetForm = () => {
    setForm({
      user_id: null,
      nama: "",
      username: "",
      password: "",
      role: "Admin",
    });
    setIsOpen(false);
    setIsEdit(false);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Admin - Manajemen User</h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.user_id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border flex justify-center space-x-2">
                  <button onClick={() => handleEdit(user)}>
                    <PencilIcon className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button onClick={() => handleDelete(user.user_id)}>
                    <TrashIcon className="h-5 w-5 text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ButtonAdd
        onClick={() => {
          setIsOpen(true);
          setIsEdit(false);
          setForm({
            user_id: null,
            nama: "",
            username: "",
            password: "",
            role: "Admin",
          });
          setMessage("");
        }}
      />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4 relative">
            <h2 className="text-xl font-bold text-center">
              {isEdit ? "Edit User" : "Tambah User"}
            </h2>

            {message && (
              <p className="text-sm text-center text-red-600">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nama"
                placeholder="Nama Lengkap"
                value={form.nama}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="password"
                placeholder={
                  isEdit ? "Kosongkan jika tidak diubah" : "Password"
                }
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required={!isEdit}
              />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <div className="flex justify-between space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEdit ? "Simpan Perubahan" : "Tambah User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
