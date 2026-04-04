"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  full_name: string;
  role: string;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/get-users");
      const data = await res.json();

      if (data.error) {
        console.error(data.error);
      } else {
        setUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      // remove from UI
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      console.error(data.error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 flex-1 h-[80vh] overflow-y-auto">
      {users.length === 0 && <p>No users found</p>}

      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between bg-gray-100 p-3 rounded shadow mb-2"
        >
          <div className="flex flex-col">
            <span><strong>Full Name:</strong> {user.full_name}</span>
            <span><strong>Username:</strong> {user.username}</span>
            <span><strong>Role:</strong> {user.role}</span>
          </div>

          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-500 font-bold px-2"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}