import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/tasks/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Tasks', value: stats.total, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-100' },
    { title: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-100' },
    { title: 'In Progress', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-100' },
    { title: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-100' },
  ];

  if (loading) return <Layout><div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div></Layout>;

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Monitor your project performance and task status at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card) => (
          <div key={card.title} className={`bg-white p-6 rounded-2xl shadow-sm border ${card.border} hover:shadow-md transition-all duration-300 group`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className={card.color} size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overview</span>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold">{card.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Your latest task updates across all projects.</p>
          </div>
          <Link to="/projects" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 font-bold">Task Detail</th>
                <th className="px-8 py-4 font-bold">Project</th>
                <th className="px-8 py-4 font-bold">Status</th>
                <th className="px-8 py-4 font-bold">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recentTasks.length > 0 ? (
                stats.recentTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{task.title}</span>
                        <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                        {task.project?.name}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`
                        px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' : 
                          task.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' : 
                          'bg-slate-100 text-slate-600'}
                      `}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <Clock size={14} className={new Date(task.deadline) < new Date() && task.status !== 'Done' ? 'text-rose-500' : 'text-slate-300'} />
                        <span className={new Date(task.deadline) < new Date() && task.status !== 'Done' ? 'text-rose-600 font-bold' : ''}>
                          {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <ClipboardList className="text-slate-300" size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">No tasks found yet.</p>
                      <Link to="/projects" className="text-indigo-600 text-sm font-bold mt-2 hover:underline">Start by creating a project</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
