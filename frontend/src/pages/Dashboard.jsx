import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintItem from '../components/ComplaintItem';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', location: '' });
  const { user } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let endpoint = '/complaints';
      
      if (filters.location) {
        endpoint = `/complaints/search?location=${filters.location}`;
      } else if (filters.category) {
        endpoint = `/complaints?category=${filters.category}`;
      }
      
      const res = await api.get(endpoint);
      // Client-side category filtering if search by location was used
      let data = res.data;
      if (filters.location && filters.category) {
        data = data.filter(c => c.category === filters.category);
      }
      
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user?.name}. Manage your complaints here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <ComplaintForm onComplaintAdded={fetchComplaints} />
        </div>

        {/* Right Column: List & Filters */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </form>
            
            <div className="relative w-full md:w-auto flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity Board">Electricity Board</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Public Works">Public Works</option>
                <option value="General Support">General Support</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No complaints found</h3>
              <p className="mt-2 text-gray-500">There are no complaints matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.map((complaint) => (
                <ComplaintItem key={complaint._id} complaint={complaint} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
