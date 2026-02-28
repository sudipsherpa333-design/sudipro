import { useQuery } from '@tanstack/react-query';
import { PlayCircle } from 'lucide-react';

export default function DemoResultsManager() {
  const { data: results, isLoading } = useQuery({
    queryKey: ['admin-demo-results'],
    queryFn: async () => {
      const res = await fetch('/api/admin/demo-results');
      return res.json();
    }
  });

  if (isLoading) return <div>Loading demo results...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <PlayCircle className="mr-3 text-accent" /> Demo Playground Results
      </h1>

      <div className="glass rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-medium text-gray-400">Date</th>
              <th className="p-4 font-medium text-gray-400">Demo Type</th>
              <th className="p-4 font-medium text-gray-400">Input Data</th>
              <th className="p-4 font-medium text-gray-400">Result Score</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(results) && results.map((result: any) => (
              <tr key={result._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-400 font-mono text-sm">
                  {new Date(result.createdAt).toLocaleString()}
                </td>
                <td className="p-4 font-medium text-accent">{result.demoType}</td>
                <td className="p-4 text-gray-400 text-sm">
                  {result.inputData?.fileName || JSON.stringify(result.inputData)}
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-success/20 text-success rounded text-sm font-bold">
                    {result.resultData?.score || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!Array.isArray(results) || results.length === 0) && (
          <div className="p-8 text-center text-gray-500">No demo results yet.</div>
        )}
      </div>
    </div>
  );
}
