import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";

export default function SettingsManager() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/settings");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      alert("Settings saved successfully!");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    saveMutation.mutate(data);
  };

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Global Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <div className="glass p-8 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-accent">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Hero Title
              </label>
              <input
                name="heroTitle"
                defaultValue={settings?.heroTitle}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Hero Subtitle
              </label>
              <textarea
                name="heroSubtitle"
                defaultValue={settings?.heroSubtitle}
                rows={3}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Users Served (Stats)
              </label>
              <input
                name="usersServed"
                defaultValue={settings?.usersServed}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10">
          <h2 className="text-xl font-bold mb-6 text-accent">
            Social & Contact Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Email Address
              </label>
              <input
                name="email"
                defaultValue={settings?.email}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                WhatsApp Number
              </label>
              <input
                name="whatsapp"
                defaultValue={settings?.whatsapp}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Telegram Username
              </label>
              <input
                name="telegram"
                defaultValue={settings?.telegram}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                LinkedIn Username
              </label>
              <input
                name="linkedin"
                defaultValue={settings?.linkedin}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                GitHub Username
              </label>
              <input
                name="github"
                defaultValue={settings?.github}
                className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="flex items-center space-x-2 px-8 py-4 bg-accent text-dark-bg font-bold rounded-xl hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          <span>
            {saveMutation.isPending ? "Saving..." : "Save All Settings"}
          </span>
        </button>
      </form>
    </div>
  );
}
