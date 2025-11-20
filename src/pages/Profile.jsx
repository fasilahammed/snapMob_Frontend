import React, { useState, useEffect } from "react";
import { FiEdit, FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getUserById, updateUserProfile, changePassword } from "../services/userService";
import { useWishlist } from "../context/WishlistContext";

export default function Profile() {
  const { user, logout, fetchFullUser } = useAuth();
  const { orders } = useCart();
  const { wishlistCount } = useWishlist();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    image: null,
  });

  const [pwd, setPwd] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  useEffect(() => {
    if (user) loadUser();
  }, [user]);

  const loadUser = async () => {
    const res = await getUserById(user.id);
    if (res.statusCode === 200) {
      setProfile(res.data);
      setForm({
        name: res.data.name,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber || "",
        address: res.data.address || "",
      });
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("Name", form.name);
    fd.append("Email", form.email);
    fd.append("PhoneNumber", form.phoneNumber);
    fd.append("Address", form.address);
    if (form.image) fd.append("ProfileImage", form.image);

    const res = await updateUserProfile(user.id, fd);
    if (res.statusCode === 200) {
      toast.success("Profile updated");
      await fetchFullUser();
      await loadUser();
      setEditMode(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!pwd.newPassword.match(strongPassword)) {
      toast.error("Password must contain A-Z, a-z, 0-9 & symbol");
      return;
    }

    if (pwd.newPassword !== pwd.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const payload = {
      OldPassword: pwd.oldPassword,
      NewPassword: pwd.newPassword,
    };

    const res = await changePassword(user.id, payload);
    if (res.statusCode === 200) {
      toast.success("Password changed");
      setShowPasswordForm(false);
      setPwd({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(res.message);
    }
  };

  if (!profile)
    return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8">

      {/* LEFT CARD */}
      <div className="w-1/4 bg-white rounded-xl shadow-sm p-6">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-4xl font-bold overflow-hidden">
            {profile.profileImage ? (
              <img src={profile.profileImage} className="w-full h-full object-cover" />
            ) : (
              profile.name.charAt(0).toUpperCase()
            )}
          </div>

          <h2 className="font-bold text-lg">{profile.name}</h2>
          <p className="text-gray-500 text-sm">{profile.email}</p>
        </div>

        <nav className="mt-8">
          <Link className="block bg-orange-50 text-orange-600 px-4 py-3 rounded-lg font-medium">
            My Profile
          </Link>

          <Link to="/orders" className="block px-4 py-3 mt-2 hover:bg-gray-50 rounded-lg">
            My Orders ({orders.length})
          </Link>

          <Link to="/wishlist" className="block px-4 py-3 mt-2 hover:bg-gray-50 rounded-lg">
            Wishlist ({wishlistCount})
          </Link>
        </nav>

        <div className="mt-8 pt-6 border-t">
          <p className="text-gray-500 text-sm">Member since</p>
          <p className="font-medium">{new Date(profile.createdOn).toLocaleDateString()}</p>

          <p className="text-gray-500 text-sm mt-3">Total orders</p>
          <p className="font-medium">{orders.length}</p>
        </div>

        <button
          onClick={logout}
          className="mt-6 w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
        >
          Logout
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <button className="text-orange-500" onClick={() => setEditMode(!editMode)}>
            <FiEdit className="inline mr-1" /> Edit
          </button>
        </div>

        {!editMode ? (
          <div className="grid grid-cols-2 gap-8 py-6">
            <ProfileItem icon={<FiUser />} label="Full Name" value={profile.name} />
            <ProfileItem icon={<FiMail />} label="Email" value={profile.email} />
            <ProfileItem icon={<FiPhone />} label="Phone" value={profile.phoneNumber || "Not provided"} />
            <ProfileItem icon={<FiMapPin />} label="Address" value={profile.address || "Not provided"} />
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="grid grid-cols-2 gap-6 py-6">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Input label="Phone" value={form.phoneNumber} onChange={(v) => setForm({ ...form, phoneNumber: v })} />
            <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />

            <div className="col-span-2">
              <label className="text-sm text-gray-500">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="block mt-2"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
            </div>

            <button className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">
              Save Changes
            </button>
          </form>
        )}

        {/* PASSWORD */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg font-semibold">Security</h2>

          {!showPasswordForm ? (
            <button className="text-orange-500 mt-3" onClick={() => setShowPasswordForm(true)}>
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">

              <PasswordField label="Current Password" value={pwd.oldPassword}
                             onChange={(v) => setPwd({ ...pwd, oldPassword: v })}
                             visible={passwordVisible} setVisible={setPasswordVisible} />

              <PasswordField label="New Password" value={pwd.newPassword}
                             onChange={(v) => setPwd({ ...pwd, newPassword: v })}
                             visible={passwordVisible} setVisible={setPasswordVisible} />

              <PasswordField label="Confirm New Password" value={pwd.confirmPassword}
                             onChange={(v) => setPwd({ ...pwd, confirmPassword: v })}
                             visible={passwordVisible} setVisible={setPasswordVisible} />

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded">Change Password</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="bg-orange-100 p-3 rounded-lg text-orange-500">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        className="w-full border px-4 py-2 rounded mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function PasswordField({ label, value, onChange, visible, setVisible }) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          className="w-full border px-4 py-2 rounded pr-10 mt-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-3 cursor-pointer text-gray-500"
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </span>
      </div>
    </div>
  );
}
