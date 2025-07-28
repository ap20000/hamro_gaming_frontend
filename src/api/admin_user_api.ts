
import { User } from "@/type/user";

export async function getUsers(): Promise<User[]> {


  const res = await fetch(`/api/admin/users`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
     },
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data.users;
}

export async function deleteUser(userId: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`/api/admin/user/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete user.");
  }

  return data;
}
