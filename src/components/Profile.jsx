import { useEffect, useState } from "react";
import {
  BarChart3,
  Video,
  Star,
  Lock,
  Mail,
  Calendar,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import {
  getProfileAPI,
  getProfileStatsAPI,
  editProfileAPI,
  changePasswordAPI,
} from "../services/profileService";

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

const parseSimilarityScore = (aiResult) => {
  if (!aiResult) return null;

  let parsed = aiResult;
  if (typeof parsed === "string") {
    try {
      const cleaned = parsed.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return null;
    }
  }

  const raw = parsed?.similarityScore;
  if (raw === undefined || raw === null) return null;

  const numeric =
    typeof raw === "string" ? parseFloat(raw.replace("%", "")) : raw;

  return isNaN(numeric) ? null : numeric;
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [editMsg, setEditMsg] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    const res = await getProfileAPI();
    setProfile(res.data);
    setForm({ firstName: res.data.firstName, lastName: res.data.lastName || "" });
  };

  const loadStats = async () => {
    const res = await getProfileStatsAPI();
    setStats(res.data);
  };

  const saveProfile = async () => {
    setEditMsg("");
    try {
      await editProfileAPI(form);
      setProfile((p) => ({ ...p, ...form }));
      setEditing(false);
    } catch (err) {
      setEditMsg(err?.response?.data?.message || "Something went wrong");
    }
  };

 const handleUpdatePassword = async () => {
  setPasswordMsg("");

  if (passwords.newPassword !== passwords.confirmPassword) {
    setPasswordMsg("New password and confirm password don't match");
    return;
  }

  try {
    await changePasswordAPI({
      oldPassword: passwords.currentPassword, // <-- change here
      newPassword: passwords.newPassword,
    });

    setPasswordMsg("Password updated successfully");
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (err) {
    setPasswordMsg(
      err?.response?.data || "Something went wrong"
    );
  }
};

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  const STATS = [
    { icon: BarChart3, label: "Total Comparisons", value: stats?.totalComparisons ?? "—" },
    { icon: Video, label: "Videos Analyzed", value: stats?.videosAnalyzed ?? "—" },
    {
      icon: Star,
      label: "Avg. Similarity Score",
      value:
        stats?.avgSimilarityScore !== null && stats?.avgSimilarityScore !== undefined
          ? `${stats.avgSimilarityScore}%`
          : "—",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account information and password.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5"
          >
            <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-3">
              <Icon size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
              {value}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
              Profile Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-lg px-3 py-1.5 transition-colors"
              >
                <Pencil size={13} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 flex items-center justify-center font-semibold text-2xl font-['Space_Grotesk',sans-serif]">
              {profile.firstName?.charAt(0).toUpperCase()}
            </div>

            {!editing ? (
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
                {profile.firstName} {profile.lastName}
              </h3>
            ) : (
              <div className="flex gap-2">
                <input
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  placeholder="First name"
                  className="w-32 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                />
                <input
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  placeholder="Last name"
                  className="w-32 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            )}
          </div>

          {editing && (
            <div className="flex gap-2 mb-6">
              <button
                onClick={saveProfile}
                className="text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({ firstName: profile.firstName, lastName: profile.lastName || "" });
                }}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-4 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {editMsg && <p className="text-sm text-rose-600 mb-4">{editMsg}</p>}

          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-slate-400 dark:text-slate-500" />
              {profile.emailId}
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar size={15} className="text-slate-400 dark:text-slate-500" />
              Joined on{" "}
              {profile.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-7">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
              Change Password
            </h2>
            <span className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/30 rounded-lg px-3 py-1.5">
              <Lock size={13} />
              Secure
            </span>
          </div>

          <div className="space-y-4">
            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, currentPassword: e.target.value }))
              }
            />
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, newPassword: e.target.value }))
              }
            />
            <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
              }
            />

            {passwordMsg && (
              <p
                className={`text-sm ${
                  passwordMsg.includes("success") ? "text-teal-600" : "text-rose-600"
                }`}
              >
                {passwordMsg}
              </p>
            )}

            <button
              onClick={handleUpdatePassword}
              className="w-full bg-linear-to-r from-teal-600 to-teal-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Recent Comparisons */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-7 mt-6">
        <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif] mb-6">
          Recent Comparisons
        </h2>

        {stats?.recentComparisons?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentComparisons.map((comp) => {
              const score = parseSimilarityScore(comp.aiResult);

              return (
                <div
                  key={comp._id}
                  className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center shrink-0">
                      <Video size={15} className="text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {comp.video1?.split("?")[0]?.split("/").pop()} vs{" "}
                        {comp.video2?.split("?")[0]?.split("/").pop()}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {new Date(comp.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-3">
                    {score !== null ? (
                      <span className="text-sm font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-full px-3 py-1">
                        {score}%
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500">No comparisons yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;