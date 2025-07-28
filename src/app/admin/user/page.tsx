"use client";

import { useEffect, useState } from "react";
import { User } from "@/type/user";
import { getUsers, deleteUser } from "../../../api/admin_user_api";
import UserListTable from "@/components/ui/admin/user_list";
import FullPageLoader from "@/components/ui/full_page_loader";
import ErrorMessage from "@/components/ui/error_message";
import SuccessMessage from "@/components/ui/success_message";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setSuccess("User deleted successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="mx-auto p-4 space-y-4">
      {loading ? (
        <FullPageLoader message="Loading Users..." />
      ) : (
        <>
          {/* Error Message */}
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}
          <UserListTable users={users} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}
