"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { AdminUser, UsersPagination } from "@/types/admin";
import {
  UserCard,
  UserDetailsModal,
  UserContentModal,
  SearchBar,
  AdminPagination,
} from "@/components/admin";
import { Users, Shield, Loader2 } from "lucide-react";

const USERS_PER_PAGE = 12;

const DashboardPage = () => {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<UsersPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: USERS_PER_PAGE.toString(),
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data.users);
      setPagination(res.data.pagination);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, isAuthenticated, isAdmin]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handlers
  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleViewContent = (user: AdminUser) => {
    setSelectedUser(user);
    setShowContentModal(true);
  };

  const handleToggleAdmin = async (user: AdminUser) => {
    const action = user.isAdmin ? "remove admin from" : "make admin";
    const confirmed = confirm(`Are you sure you want to ${action} ${user.name}?`);

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user._id}/toggle-admin`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isAdmin: !u.isAdmin } : u
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const confirmed = confirm(
      `⚠️ Are you sure you want to DELETE ${user.name}?\n\nThis action cannot be undone!`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Remove from local state
      setUsers((prev) => prev.filter((u) => u._id !== user._id));

      // Update pagination count
      if (pagination) {
        setPagination({
          ...pagination,
          totalUsers: pagination.totalUsers - 1,
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowContentModal(false);
    setSelectedUser(null);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="p-5 sm:px-20 pb-20 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage users and platform settings</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{pagination?.totalUsers || 0}</p>
            </div>
            <Users size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Admin Users</p>
              <p className="text-3xl font-bold">
                {users.filter((u) => u.isAdmin).length}
              </p>
            </div>
            <Shield size={32} className="text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Pages</p>
              <p className="text-3xl font-bold">{pagination?.totalPages || 0}</p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name, email, or username..."
        />
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No users found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                onViewDetails={handleViewDetails}
                onViewContent={handleViewContent}
                onToggleAdmin={handleToggleAdmin}
                onDelete={handleDeleteUser}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <AdminPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Modals */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={closeModals} />
      )}

      {showContentModal && selectedUser && (
        <UserContentModal user={selectedUser} onClose={closeModals} />
      )}
    </div>
  );
};

export default DashboardPage;
