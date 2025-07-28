import { Trash } from "lucide-react";
import { User } from "@/type/user";

interface UserListProps {
  users: User[];
  onDelete: (id: string) => void;
}

export default function UserListTable({ users, onDelete }: UserListProps) {
  return (
    <div className="overflow-x-auto bg-gaming-white shadow-sm shadow-gaming-gray/10 rounded-xl">
      <table className="min-w-full divide-y divide-gaming-gray/10">
        <thead className="bg-gaming-white/10">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Email
            </th>

            <th className="px-6 py-3  text-left text-sm font-semibold font-sans text-gaming-gray/90">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gaming-gray/10">
          {users.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gaming-gray font-sans">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gaming-gray/80 font-sans">
                {user.email}
              </td>

              <td className="px-px py-4 whitespace-nowrap text-left">
                <button
                  onClick={() => onDelete(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-gaming-white px-3 py-1.5 rounded-md flex items-center gap-1"
                >
                  <Trash size={14} />
                  <span className="text-sm font-sans">Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
