import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Tag, BrainCircuit, Activity } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await api.get(`/complaints`);
        // Note: For a real app, you should have a GET /api/complaints/:id endpoint.
        // For simplicity, we filter from all complaints here.
        const found = res.data.find(c => c._id === id);
        if (found) {
          setComplaint(found);
          setStatus(found.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (status === complaint.status) return;
    setUpdating(true);
    try {
      const res = await api.put(`/complaints/${id}`, { status });
      setComplaint(res.data);
      alert('Status updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-2xl font-bold text-gray-800">Complaint not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{complaint.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {complaint.status}
              </span>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
              {complaint.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">Category:</span> {complaint.category}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">Location:</span> {complaint.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">Submitted:</span> {new Date(complaint.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {(user?.role === 'admin' || user?._id === complaint.user) && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Update Status</h3>
              <div className="flex gap-4 items-center">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || status === complaint.status}
                  className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          <div className="bg-gradient-to-b from-indigo-50 to-white p-6 rounded-2xl shadow-sm border border-indigo-100 h-full">
            <div className="flex items-center gap-2 mb-6">
              <BrainCircuit className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-indigo-900">AI Analysis</h3>
            </div>
            
            {complaint.aiAnalysis?.urgency ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Urgency Level</p>
                  <div className="flex items-center gap-2">
                    <Activity className={`w-5 h-5 ${
                      complaint.aiAnalysis.urgency === 'High' ? 'text-red-500' :
                      complaint.aiAnalysis.urgency === 'Medium' ? 'text-orange-500' : 'text-green-500'
                    }`} />
                    <span className="font-semibold text-gray-900">{complaint.aiAnalysis.urgency}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Recommended Department</p>
                  <p className="font-medium text-gray-900">{complaint.aiAnalysis.department}</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">AI Summary</p>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-indigo-50/50">{complaint.aiAnalysis.summary}</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">Auto Response</p>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-indigo-50/50 italic">"{complaint.aiAnalysis.autoResponse}"</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">No AI analysis available for this complaint.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
