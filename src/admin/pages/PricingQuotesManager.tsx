import { useQuery } from '@tanstack/react-query';
import { Calculator } from 'lucide-react';

export default function PricingQuotesManager() {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['admin-pricing-quotes'],
    queryFn: async () => {
      const res = await fetch('/api/admin/pricing-quotes');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading pricing quotes...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Calculator className="mr-3 text-accent" /> Generated Pricing Quotes
      </h1>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Date</th>
              <th className="p-4 font-medium text-gray-400">Project Type</th>
              <th className="p-4 font-medium text-gray-400">Features</th>
              <th className="p-4 font-medium text-gray-400">Timeline</th>
              <th className="p-4 font-medium text-gray-400 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {quotes?.map((quote: any) => (
              <tr key={quote._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-400 font-mono text-sm">
                  {new Date(quote.createdAt).toLocaleString()}
                </td>
                <td className="p-4 font-medium">{quote.projectType}</td>
                <td className="p-4 text-gray-400 text-sm">
                  {quote.features?.join(', ') || 'None'}
                </td>
                <td className="p-4 text-gray-400">{quote.timelineDays} Days</td>
                <td className="p-4 text-right font-bold text-success">
                  NPR {quote.totalPrice.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {quotes?.length === 0 && (
          <div className="p-8 text-center text-gray-500">No quotes generated yet.</div>
        )}
      </div>
    </div>
  );
}
