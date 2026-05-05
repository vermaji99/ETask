import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService, taskService, authService } from '../api/apiService';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: ''
  });

  const fetchData = async () => {
    try {
      const [projRes, tasksRes, membersRes] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        user.role === 'Admin' ? authService.getMembers() : Promise.resolve({ data: [] })
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error('Failed to fetch project data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.create({ ...newTask, project: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', deadline: '', assignedTo: '' });
      fetchData();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await taskService.updateStatus(taskId, status);
      fetchData();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await projectService.addMember(id, userId);
      setShowMemberModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'In Progress': return <Clock className="text-indigo-500" size={18} />;
      default: return <Circle className="text-slate-300" size={18} />;
    }
  };

  if (loading) return <Layout><div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div></Layout>;
  if (!project) return <Layout><div className="text-center py-20">
    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
      <Briefcase size={32} />
    </div>
    <h2 className="text-xl font-bold text-slate-900">Project not found</h2>
  </div></Layout>;

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
            Active Project
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{project.name}</h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">{project.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
              <Users size={16} className="text-slate-400" />
              <span className="text-sm font-bold text-slate-700">{project.members.length + 1} Team Members</span>
            </div>
            <div className="flex -space-x-3">
              {[project.admin, ...project.members].map((m, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-indigo-600 border-4 border-white flex items-center justify-center text-xs font-black text-white shadow-md" title={m.name}>
                  {m.name.charAt(0)}
                </div>
              ))}
              {user.role === 'Admin' && (
                <button 
                  onClick={() => setShowMemberModal(true)}
                  className="w-10 h-10 rounded-xl bg-slate-100 border-4 border-white border-dashed flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {user.role === 'Admin' && (
          <button 
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black hover:bg-indigo-600 transition-all duration-300 shadow-xl shadow-slate-100 active:scale-95 shrink-0"
          >
            <Plus size={20} />
            <span>Create Task</span>
          </button>
        )}
      </div>

      {/* Task Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {columns.map((col) => (
          <div key={col} className="bg-slate-100/50 p-6 rounded-3xl min-h-[600px] border border-slate-100">
            <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.15em]">{col}</h3>
              <span className="bg-white text-slate-500 px-3 py-1 rounded-full text-[10px] font-black border border-slate-200">
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            
            <div className="space-y-5">
              {tasks.filter(t => t.status === col).map((task) => (
                <div key={task._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <div className="relative group/menu">
                      <button className="text-slate-300 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                        <MoreVertical size={16} />
                      </button>
                      <div className="hidden group-focus-within/menu:block absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-10 w-48 py-2 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Move to</div>
                        {columns.filter(c => c !== task.status).map(c => (
                          <button 
                            key={c}
                            onClick={() => handleUpdateStatus(task._id, c)}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 line-clamp-2 leading-relaxed">{task.description}</p>
                  
                  <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${new Date(task.deadline) < new Date() && task.status !== 'Done' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                        <Calendar size={12} />
                        <span className="text-[10px] font-black">
                          {format(new Date(task.deadline), 'MMM d')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600 ring-1 ring-indigo-100" title={task.assignedTo?.name}>
                        {task.assignedTo?.name?.charAt(0)}
                      </div>
                      {getStatusIcon(task.status)}
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col).length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Task Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Design System Implementation"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold placeholder:text-slate-300 transition-all"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Detailed Description</label>
                <textarea 
                  required rows="3"
                  placeholder="What needs to be done?"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Due Date</label>
                  <input 
                    type="date" required
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold transition-all"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Assign Team Member</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold transition-all"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Select Member</option>
                    {[project.admin, ...project.members].map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors">Discard</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Add to Team</h2>
            <div className="max-h-80 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
              {members.filter(m => !project.members.some(pm => pm._id === m._id) && m._id !== project.admin._id).length > 0 ? (
                members
                  .filter(m => !project.members.some(pm => pm._id === m._id) && m._id !== project.admin._id)
                  .map(member => (
                    <div key={member._id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 group">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{member.name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{member.email}</p>
                      </div>
                      <button 
                        onClick={() => handleAddMember(member._id)}
                        className="bg-white text-indigo-600 p-2.5 rounded-xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all duration-300"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))
              ) : (
                <div className="text-center py-10">
                  <Users className="mx-auto text-slate-200 mb-4" size={48} />
                  <p className="text-slate-400 font-bold">No members available to add.</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-8">
              <button onClick={() => setShowMemberModal(false)} className="w-full py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors bg-slate-50 rounded-2xl hover:bg-slate-100">Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectDetail;
