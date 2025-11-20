import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiUser, FiHome, FiSmartphone, FiHeart, FiShoppingCart,
  FiChevronDown, FiChevronUp, FiLogOut, FiPackage
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import logo from "../assets/img/snapmob-logo.png";
import { useClickAway } from './useClickAway';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount ,cartItemsCount} = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const mobileMenuRef = useClickAway(() => setMobileMenuOpen(false));
  const profileDropdownRef = useClickAway(() => setProfileDropdownOpen(false));
  const [liveWishlistCount, setLiveWishlistCount] = useState(wishlistCount);

  useEffect(() => {
    const updateWishlistCount = (e) => setLiveWishlistCount(e.detail);
    window.addEventListener("wishlist-updated", updateWishlistCount);
    return () => window.removeEventListener("wishlist-updated", updateWishlistCount);
  }, []);

  useEffect(() => setLiveWishlistCount(wishlistCount), [wishlistCount]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg bg-white' : 'shadow-sm bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-lg">
            <img src={logo} alt="SnapMob Logo" className="h-10 transition-transform duration-300 group-hover:scale-105" />
            <span className="ml-3 text-xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent hidden sm:inline-block">
              SnapMob
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" icon={<FiHome />}>Home</NavLink>
            <NavLink to="/products" icon={<FiSmartphone />}>Phones</NavLink>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Wishlist */}
            <Link to="/wishlist" className="p-2 rounded-full relative transition-colors text-gray-700 hover:bg-gray-100" aria-label="Wishlist">
              <FiHeart className="h-5 w-5" />
              {liveWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center bg-orange-600 text-white animate-pulse">
                  {liveWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="p-2 rounded-full relative transition-colors text-gray-700 hover:bg-gray-100" aria-label="Cart">
              <FiShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center bg-orange-600 text-white animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3 relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-orange-100 hover:bg-orange-200 text-orange-800 cursor-pointer"
                  aria-label="Profile menu" aria-expanded={profileDropdownOpen}
                >
                  <span className="truncate max-w-[100px]">Hi, {user.name.split(' ')[0]}</span>
                  {profileDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    role="menu"
                  >
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center">
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setProfileDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center">
                      <FiPackage className="mr-2" /> My Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center">
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-orange-500 hover:bg-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                <FiUser className="mr-1.5 h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden" ref={mobileMenuRef}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full transition-colors text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
          }`}
      >
        <div className="py-2">
          <MobileNavLink to="/" icon={<FiHome />}>Home</MobileNavLink>
          <MobileNavLink to="/products" icon={<FiSmartphone />}>Phones</MobileNavLink>
          <MobileNavLink to="/wishlist" icon={<FiHeart />} badge={wishlistCount}>Wishlist</MobileNavLink>
          <MobileNavLink to="/cart" icon={<FiShoppingCart />} badge={cartItemsCount}>Cart</MobileNavLink>

          {user ? (
            <>
              <MobileNavLink to="/profile" icon={<FiUser />}>Profile</MobileNavLink>
              <MobileNavLink to="/orders" icon={<FiPackage />}>My Orders</MobileNavLink>
              <MobileNavLink to="#" icon={<FiLogOut />} onClick={handleLogout}>Logout</MobileNavLink>
            </>
          ) : (
            <MobileNavLink to="/login" icon={<FiUser />}>Login</MobileNavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ====== Helpers ====== */
function NavLink({ to, children, icon }) {
  return (
    <Link to={to} className="px-3 py-2 rounded-full text-sm font-medium flex items-center transition-colors text-gray-700 hover:bg-orange-50 hover:text-orange-600">
      {icon}
      <span className="hidden lg:inline-block ml-1.5">{children}</span>
    </Link>
  );
}

function MobileNavLink({ to, children, onClick, icon, badge }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between px-5 py-3 mx-2 rounded-lg text-base font-medium transition-colors text-gray-700 hover:bg-orange-50 hover:text-orange-600"
    >
      <div className="flex items-center">
        <span className="mr-3 text-lg">{icon}</span>
        <span>{children}</span>
      </div>
      {badge > 0 && (
        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
          {badge}
        </span>
      )}
    </Link>
  );
}
