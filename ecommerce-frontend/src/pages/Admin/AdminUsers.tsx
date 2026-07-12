import { useEffect, useState, useCallback, useMemo } from "react";
import { Users as UsersIcon, ChevronLeft, ChevronRight, Search, Shield, ShieldOff } from "lucide-react";
import * as adminService from "../../api/services/admin.service";
import type { AdminUser, PaginationMeta } from "../../types/admin.types";
import { toast } from "sonner";

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await adminService.getAdminUsers(page, 15);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(currentPage); }, [currentPage, fetchUsers]);

  const handleToggleActive = useCallback(async (userId: string, currentActive: boolean) => {
    try {
      await adminService.updateUser(userId, { isActive: !currentActive });
      toast.success(currentActive ? "User deactivated" : "User activated");
      fetchUsers(currentPage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    }
  }, [currentPage, fetchUsers]);

  const handleToggleRole = useCallback(async (userId: string, currentRole: "CUSTOMER" | "ADMIN") => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    try {
      await adminService.updateUser(userId, { role: newRole });
      toast.success(`User role changed to ${newRole}`);
      fetchUsers(currentPage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  }, [currentPage, fetchUsers]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      u.firstName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.lastName?.toLowerCase().includes(q) ?? false)
    );
  }, [users, searchQuery]);

  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-24 animate-pulse rounded-lg bg-white/6" />
        <div className="h-96 animate-pulse rounded-2xl bg-white/4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Users</h1>
          <p className="mt-1 text-sm text-white/40">{pagination?.totalCount ?? 0} total users</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input type="text" placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/3 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-primary/30 focus:outline-none" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/6 bg-[#0f0f18]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                {["User", "Role", "Status", "Orders", "Joined", "Actions"].map((h) => (
                  <th key={h} className={`px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-white/30 ${h === "Orders" || h === "Joined" || h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-white/30">No users found</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-white/2">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/60 to-amber-500/60 text-xs font-bold text-white">
                        {user.firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/80">{user.firstName} {user.lastName ?? ""}</p>
                        <p className="text-[11px] text-white/30">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${user.role === "ADMIN" ? "border-primary/20 bg-primary/10 text-primary" : "border-white/10 bg-white/4 text-white/50"}`}>
                      {user.role === "ADMIN" ? <Shield className="h-2.5 w-2.5" /> : <UsersIcon className="h-2.5 w-2.5" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase ${user.isActive ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-red-500/20 bg-red-500/10 text-red-400"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-white/50">{user._count.orders}</td>
                  <td className="px-5 py-3.5 text-right text-xs text-white/40">{new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => handleToggleRole(user.id, user.role)} className="rounded-lg p-1.5 text-white/30 hover:bg-white/6 hover:text-white/60" aria-label={`Toggle role for ${user.firstName}`} title={user.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}>
                        {user.role === "ADMIN" ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-colors ${user.isActive ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"}`}
                        aria-label={`${user.isActive ? "Deactivate" : "Activate"} ${user.firstName}`}
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/30">Page {pagination.currentPage} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button disabled={!pagination.hasPrevPage} onClick={() => setCurrentPage((p) => p - 1)} className="flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 disabled:opacity-30 hover:bg-white/4">
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button disabled={!pagination.hasNextPage} onClick={() => setCurrentPage((p) => p + 1)} className="flex items-center gap-1 rounded-lg border border-white/8 px-3 py-1.5 text-xs text-white/50 disabled:opacity-30 hover:bg-white/4">
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
