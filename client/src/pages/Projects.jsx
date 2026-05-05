import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Plus, Briefcase, Trash2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await API.delete(`/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project', error);
      }
    }
  };

  if (loading) return <Layout><div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div></Layout>;

  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1">Manage your team's initiatives and track overall progress.</p>
        </div>
        {user.role === 'Admin' && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase size={24} />
                </div>
                {user.role === 'Admin' && (
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="text-slate-300 hover:text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
              <p className="text-slate-500 text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex items-center gap-3 mb-6 pt-6 border-t border-slate-50">
                <div className="flex -space-x-2">
                  {[project.admin, ...(project.members || [])].slice(0, 4).map((m, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 ring-1 ring-slate-100">
                      {m?.name?.charAt(0)}
                    </div>
                  ))}
                  {(project.members?.length + 1) > 4 && (
                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                      +{(project.members?.length + 1) - 4}
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{project.members?.length + 1} Members</span>
              </div>

              <Link 
                to={`/projects/${project._id}`}
                className="w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-slate-100 active:scale-95"
              >
                Launch Project
              </Link>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-slate-300" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">Get started by creating your first project to manage tasks and collaborate with your team.</p>
            {user.role === 'Admin' && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6">New Project</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Project Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Q3 Marketing Campaign"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="What is this project about?"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 text-slate-900 font-medium placeholder:text-slate-300 transition-all"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Projects;
