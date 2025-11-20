import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiArrowLeft, 
  FiTrash2, FiCalendar 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import dotnetAPI from '../../Api\'s/dotnetAPI';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH USER BY ID ----------------
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await dotnetAPI.get(`/user/${userId}`);
        setUser(res.data.data);  // ✔ Correct path
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ---------------- DELETE USER ----------------
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await dotnetAPI.delete(`/user/${userId}`);
      toast.success(res.data.message);
      navigate("/admin/users");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <Link
          to="/admin/users"
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link 
          to="/admin/users"
          className="flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Users
        </Link>

        {/* Card */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            
            {/* Profile */}
            <div className="flex items-center gap-5">
              <img
                src={user.profileImage || "https://via.placeholder.com/120"}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border-4 border-gray-700"
              />

              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              disabled={user.role === "admin"}
              className={`mt-4 md:mt-0 flex items-center px-4 py-2 rounded-lg ${
                user.role === "admin"
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              <FiTrash2 className="mr-2" /> Delete User
            </button>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            
            {/* Personal Info */}
            <div className="bg-gray-750 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiUser className="mr-2 text-purple-400" /> Personal Information
              </h2>

              <div className="space-y-4 text-white">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white flex items-center">
                    <FiMail className="mr-2 text-gray-400" /> {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Phone Number</p>
                  <p className="flex items-center">
                    <FiPhone className="mr-2 text-gray-400" /> {user.phoneNumber || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="flex items-center">
                    <FiMapPin className="mr-2 text-gray-400" /> {user.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-750 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FiCalendar className="mr-2 text-purple-400" /> Account Details
              </h2>

              <div className="space-y-4 text-white">
                <div>
                  <p className="text-sm text-gray-400">User ID</p>
                  <p className="font-mono">{user.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p>
                    {new Date(user.createdOn).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className={`px-2 py-1 text-xs rounded-full inline-block ${
                    user.isBlocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetails;
