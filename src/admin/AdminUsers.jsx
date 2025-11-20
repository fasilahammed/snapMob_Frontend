import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiMail, FiTrash2, FiEye,
  FiLock, FiUnlock, FiShield, FiUserCheck
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLoading from './components/AdminLoading';
import dotnetAPI from '../Api\'s/dotnetAPI';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await dotnetAPI.get("/user");
        setUsers(response.data.data);

      } catch (error) {
        console.error( error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

const toggleBlockStatus = async (userId) => {
  try {
    const res = await dotnetAPI.patch(`/user/block-unblock/${userId}`);

    setUsers(users.map(u =>
      u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u
    ));

    toast.success(res.data.message);
  } catch (error) {
    toast.error("Failed to update block status");
  }
};



  const deleteUser = async (userId) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    const res = await dotnetAPI.delete(`/user/${userId}`);

    setUsers(users.filter(u => u.id !== userId));
    toast.success(res.data.message);
  } catch (error) {
    toast.error("Failed to delete user");
  }
};


  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FiShield className="text-purple-500" />;
      default:
        return <FiUserCheck className="text-blue-500" />;
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6 p-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiUser className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <FiUser className="text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name || 'No Name'}</div>
                          <div className="text-sm text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <FiMail className="mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role || 'user'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleBlockStatus(user.id, user.isBlocked)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${user.isBlocked
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200' 
                          }`}
                          disabled={user.role === 'admin'}
                      >
                        {user.isBlocked ? (
                          <>
                            <FiLock /> Blocked
                          </>
                        ) : (
                          <>
                            <FiUnlock /> Active
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.createdOn || Date.now()).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-blue-900/20"
                          title="View Details"
                        >
                          <FiEye />
                        </Link>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className={`p-2 rounded-full hover:bg-red-900/20 ${user.role === 'admin'
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-red-400 hover:text-red-300'
                            }`}
                          title={user.role === 'admin' ? 'Cannot delete admin' : 'Delete User'}
                          disabled={user.role === 'admin'}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    {searchTerm ? 'No matching users found' : 'No users available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;