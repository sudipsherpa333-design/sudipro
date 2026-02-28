import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Mail } from "lucide-react";

export default function ContactsManager() {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts");
      return res.json();
    },
  });

  const toggleRepliedMutation = useMutation({
    mutationFn: async ({ id, replied }: { id: string; replied: boolean }) => {
      await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replied }),
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] }),
  });

  if (isLoading) return <div>Loading contacts...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Submissions</h1>

      <div className="space-y-4">
        {Array.isArray(contacts) && contacts.map((contact: any) => (
          <div
            key={contact._id}
            className={`glass rounded-2xl border p-6 transition-colors ${contact.replied ? "border-white/5 opacity-70" : "border-accent/30"}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{contact.name}</h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-accent hover:underline flex items-center text-sm mt-1"
                >
                  <Mail size={14} className="mr-1" /> {contact.email}
                </a>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 font-mono block mb-2">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() =>
                    toggleRepliedMutation.mutate({
                      id: contact._id,
                      replied: !contact.replied,
                    })
                  }
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    contact.replied
                      ? "bg-success/20 text-success"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <Check size={14} />
                  <span>{contact.replied ? "Replied" : "Mark as Replied"}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-dark-bg rounded-xl border border-white/5">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Project Type
                </span>
                <span className="font-medium">{contact.projectType}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                  Budget
                </span>
                <span className="font-medium text-success">
                  {contact.budget}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider block mb-2">
                Message
              </span>
              <p className="text-gray-300 whitespace-pre-wrap">
                {contact.message}
              </p>
            </div>
          </div>
        ))}

        {(!Array.isArray(contacts) || contacts.length === 0) && (
          <div className="text-center py-12 text-gray-400 glass rounded-2xl border border-white/10">
            No contact submissions yet.
          </div>
        )}
      </div>
    </div>
  );
}
