import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../api/services/auth.service";
import * as addressService from "../../api/services/address.service";
import type { Address } from "../../types/commerce.types";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export function Account() {
  const { user, isAuthenticated, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "addresses">("profile");

  // Profile Form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Security Form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrCountry, setAddrCountry] = useState("India");
  const [addrPostalCode, setAddrPostalCode] = useState("");
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const res = await addressService.getAddresses();
      if (res.success && Array.isArray(res.data)) {
        setAddresses(res.data);
      }
    } catch {
      setAddresses([]);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await authService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      setUser(res.user);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in both old and new passwords");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsUpdatingPassword(true);
      await authService.updatePassword({ oldPassword, newPassword });
      toast.success("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    try {
      setIsUpdatingEmail(true);
      await authService.updateEmail({ email: newEmail.trim() });
      toast.success("Verification link sent to your new email. Please verify to complete update.");
      setNewEmail("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.prompt("Type 'DELETE' to permanently delete your account:");
    if (confirmed !== "DELETE") {
      if (confirmed !== null) toast.error("Account deletion cancelled");
      return;
    }

    try {
      await authService.deleteAccount();
      toast.success("Account deleted permanently");
      await logout();
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account");
    }
  };

  const handleOpenAddressModal = (addr?: Address) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrStreet(addr.street);
      setAddrCity(addr.city);
      setAddrState(addr.state);
      setAddrCountry(addr.country);
      setAddrPostalCode(addr.postalCode);
      setAddrIsDefault(addr.isDefault);
    } else {
      setEditingAddressId(null);
      setAddrStreet("");
      setAddrCity("");
      setAddrState("");
      setAddrCountry("India");
      setAddrPostalCode("");
      setAddrIsDefault(addresses.length === 0);
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim() || !addrState.trim() || !addrPostalCode.trim()) {
      toast.error("Please fill in all address fields");
      return;
    }

    try {
      setIsSavingAddress(true);
      if (editingAddressId) {
        await addressService.updateAddress(editingAddressId, {
          street: addrStreet.trim(),
          city: addrCity.trim(),
          state: addrState.trim(),
          country: addrCountry.trim(),
          postalCode: addrPostalCode.trim(),
          isDefault: addrIsDefault,
        });
        toast.success("Address updated successfully");
      } else {
        await addressService.createAddress({
          street: addrStreet.trim(),
          city: addrCity.trim(),
          state: addrState.trim(),
          country: addrCountry.trim(),
          postalCode: addrPostalCode.trim(),
          isDefault: addrIsDefault,
        });
        toast.success("Address added successfully");
      }
      setIsAddressModalOpen(false);
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await addressService.deleteAddress(addrId);
      toast.success("Address deleted");
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete address");
    }
  };

  if (!user) return null;

  return (
    <main className="grow max-w-container-max mx-auto px-margin-mobile md:px-gutter py-10 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-on-surface font-medium">My Account</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-3xl font-black text-on-surface">
            Account Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Manage your personal profile, security credentials, and delivery addresses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
            <Link to="/orders">
              <span className="material-symbols-outlined text-sm mr-1">shopping_bag</span>
              View Orders
            </Link>
          </Button>
          {user.role === "ADMIN" && (
            <Button asChild className="bg-primary-container text-on-primary rounded-xl text-xs font-semibold">
              <Link to="/admin">
                <span className="material-symbols-outlined text-sm mr-1">shield</span>
                Admin Dashboard
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Navigation Sidebar Tabs */}
        <div className="md:col-span-3 space-y-1.5">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">person</span>
            Profile Information
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">lock</span>
            Security & Login
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
              activeTab === "addresses"
                ? "bg-primary-container text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-lg">home_pin</span>
            Delivery Addresses
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-9 space-y-6">
          {/* 1. PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-6">
              <div>
                <h2 className="font-bold text-lg text-on-surface">Personal Profile</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update your contact details and display name
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-xl border border-outline-variant/30 bg-surface-container/50 px-4 py-2.5 text-sm text-on-surface-variant cursor-not-allowed"
                  />
                  <p className="text-[11px] text-outline mt-1">
                    To change your email address, use the Security tab.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container"
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </div>
          )}

          {/* 2. SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password update */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
                <div>
                  <h2 className="font-bold text-lg text-on-surface">Change Password</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Keep your account secure with a strong password
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container"
                  >
                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </div>

              {/* Email update */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-4">
                <div>
                  <h2 className="font-bold text-lg text-on-surface">Update Email Address</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    A confirmation link will be sent to the new email address
                  </p>
                </div>

                <form onSubmit={handleUpdateEmail} className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
                      New Email Address *
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="new.email@example.com"
                      required
                      className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingEmail}
                    className="bg-primary text-on-primary font-bold px-6 py-2.5 rounded-xl hover:bg-primary-container"
                  >
                    {isUpdatingEmail ? "Sending..." : "Send Verification Email"}
                  </Button>
                </form>
              </div>

              {/* Danger Zone: Delete Account */}
              <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 shadow-xs space-y-3">
                <h3 className="font-bold text-base text-red-800">Danger Zone</h3>
                <p className="text-xs text-red-700 leading-relaxed max-w-xl">
                  Permanently delete your account and all associated order histories and saved preferences. This action cannot be reversed.
                </p>
                <Button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl"
                >
                  Delete My Account
                </Button>
              </div>
            </div>
          )}

          {/* 3. ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg text-on-surface">Saved Delivery Addresses</h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Manage your shipping locations for fast checkout
                  </p>
                </div>

                <Button
                  onClick={() => handleOpenAddressModal()}
                  className="bg-primary text-on-primary font-bold px-4 py-2 rounded-xl hover:bg-primary-container flex items-center gap-1 text-xs"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Add Address
                </Button>
              </div>

              {isLoadingAddresses ? (
                <div className="py-12 text-center text-sm text-on-surface-variant">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="py-12 text-center text-sm text-on-surface-variant">
                  No saved addresses. Add an address to speed up checkout.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl border border-outline-variant/40 bg-surface flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-on-surface">
                            {addr.isDefault ? "Default Delivery Address" : "Delivery Address"}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-800 uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{addr.country}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/20">
                        <button
                          onClick={() => handleOpenAddressModal(addr)}
                          className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-outline-variant">•</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Edit/Create Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-outline-variant/40 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/20">
              <h3 className="font-bold text-base text-on-surface">
                {editingAddressId ? "Edit Address" : "Add New Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="e.g. 123 Fashion Street, Apt 4B"
                  required
                  className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    placeholder="State"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    placeholder="PIN Code"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    placeholder="Country"
                    required
                    className="w-full rounded-xl border border-outline-variant/60 bg-surface px-4 py-2 text-sm text-on-surface focus:border-primary-container focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="accent-primary-container"
                />
                <span className="text-xs text-on-surface-variant">
                  Set as default delivery address
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingAddress}
                  className="bg-primary text-on-primary rounded-xl px-5 py-2 text-xs font-bold hover:bg-primary-container"
                >
                  {isSavingAddress ? "Saving..." : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
