import { motion } from 'framer-motion';
import { MapPin, Clock, AlertTriangle, ShieldCheck, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComplaintItem = ({ complaint }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5"
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-gray-900 truncate pr-4">{complaint.title}</h4>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)} whitespace-nowrap`}>
          {complaint.status}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{complaint.description}</p>
      
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1.5">
          <Tag className="w-4 h-4" />
          <span className="truncate">{complaint.category}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span className="truncate">{complaint.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {complaint.aiAnalysis?.urgency && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getUrgencyColor(complaint.aiAnalysis.urgency)}`}>
              <AlertTriangle className="w-3 h-3" />
              {complaint.aiAnalysis.urgency} Urgency
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
              <ShieldCheck className="w-3 h-3 text-primary" />
              AI Analyzed
            </span>
          </div>
          <Link 
            to={`/complaint/${complaint._id}`}
            className="text-sm font-medium text-primary hover:text-blue-700 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      )}
      {!complaint.aiAnalysis?.urgency && (
        <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
          <Link 
            to={`/complaint/${complaint._id}`}
            className="text-sm font-medium text-primary hover:text-blue-700 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ComplaintItem;
