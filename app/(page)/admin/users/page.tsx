"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, UserPlus, Trash2, Edit2 } from "lucide-react";
import React from "react";
import { useUserStore, User as StoreUser } from '@/store/userStore';

export type UserItem = {
  uid: string;
  displayName?: string;
  email: string;
  role: "user" | "admin";
  disabled: boolean;
};

export default function Page() {
  const { users, fetchUsers, loading, error, createUser, updateUser, patchUser, deleteUser } = useUserStore();
  const [query, setQuery] = React.useState("");
  const [editing, setEditing] = React.useState<UserItem | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<UserItem | null>(null);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtering: displayName, email, role
    const filteredUsers = users.filter(
      (u) =>
        (u.displayName && u.displayName.toLowerCase().includes(query.toLowerCase())) ||
        u.email.toLowerCase().includes(query.toLowerCase()) ||
        (u.role && u.role.toLowerCase().includes(query.toLowerCase()))
    );

  // CRUD handlers using zustand store
  async function saveUser(user: UserItem) {
    if (user.uid) {
      // Full update
      await updateUser(user as StoreUser);
    } else {
      // Create
      await createUser(user as Omit<StoreUser, '_id'>);
    }
    setDrawerOpen(false);
    setEditing(null);
  }

  // Inline patch for role or status
  async function handlePatch(uid: string, partial: Partial<UserItem>) {
    await patchUser(uid, partial);
  }

  return (
    <>
      {loading && <div className="text-green-300">Loading users...</div>}
      {error && <div className="text-red-400">{error}</div>}
      <section className="px-6 lg:px-10 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-black/70 via-emerald-900/60 to-emerald-950/70 border border-green-700/40 p-6 shadow-xl backdrop-blur-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
              <p className="text-green-300 text-sm">View, edit, or remove users from your platform</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 font-semibold flex items-center gap-2 hover:from-emerald-700 hover:to-emerald-800 transition"
          >
            <UserPlus className="w-5 h-5" /> Add User
          </button>
        </motion.div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-green-500/30 bg-black/30 text-white py-2 px-4 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* User Table */}
        <div className="rounded-3xl bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-green-700/30 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-green-600/40">
              <tr>
                <th className="py-3 px-4 text-green-300">Name</th>
                <th className="py-3 px-4 text-green-300">Email</th>
                <th className="py-3 px-4 text-green-300">Role</th>
                <th className="py-3 px-4 text-green-300">Status</th>
                <th className="py-3 px-4 text-green-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.uid}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-green-500/20 hover:bg-emerald-900/20 transition"
                  >
                    <td className="py-3 px-4 font-medium text-white">{user.displayName || user.email}</td>
                    <td className="py-3 px-4 text-green-200">{user.email}</td>
                    <td className="py-3 px-4 capitalize text-green-300">
                      <select
                        value={user.role}
                        onChange={e => handlePatch(user.uid, { role: e.target.value as 'user' | 'admin' })}
                        className="bg-transparent text-green-300 border-none outline-none"
                        disabled={loading}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${!user.disabled ? 'bg-emerald-600/30 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}
                      >
                        {!user.disabled ? 'active' : 'inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(user);
                          setDrawerOpen(true);
                        }}
                        className="rounded-lg border border-green-500/30 px-2 py-1 hover:bg-emerald-900/30"
                      >
                        <Edit2 className="w-4 h-4 text-green-300" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        className="rounded-lg border border-red-500/30 px-2 py-1 hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Drawer for Add/Edit User */}
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/30" onClick={() => setDrawerOpen(false)} />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-black/90 border-l border-green-700/30 p-5 overflow-y-auto rounded-l-3xl"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{editing ? "Edit" : "Add"} User</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editing) saveUser({ ...editing });
                    setDrawerOpen(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-sm text-green-300">Name</label>
                    <input
                      type="text"
                      value={editing?.displayName || ""}
                      onChange={(e) => editing && setEditing({ ...editing, displayName: e.target.value })}
                      className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-green-300">Email</label>
                    <input
                      type="email"
                      value={editing?.email || ""}
                      onChange={(e) => editing && setEditing({ ...editing, email: e.target.value })}
                      className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-green-300">Role</label>
                    <select
                      value={editing?.role || "user"}
                      onChange={(e) => editing && setEditing({ ...editing, role: e.target.value as "user" | "admin" })}
                      className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-green-300">Status</label>
                    <select
                      value={editing?.disabled ? "inactive" : "active"}
                      onChange={(e) => editing && setEditing({ ...editing, disabled: e.target.value === "inactive" })}
                      className="w-full rounded-xl border border-green-500/30 bg-black/30 text-white py-2 px-3 outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-xl border px-4 py-2 text-white">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirm Delete Modal */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[420px] rounded-2xl bg-black/90 border border-green-700/30 p-5"
              >
                <h4 className="text-lg font-semibold text-white">Delete User</h4>
                <p className="text-green-300 mt-1">
                  Are you sure you want to delete {confirmDelete.displayName || confirmDelete.email}?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setConfirmDelete(null)} className="rounded-xl border px-4 py-2 text-white">
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteUser(confirmDelete.uid)}
                    className="rounded-xl bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
