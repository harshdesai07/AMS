import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ActionButtons = ({ onUpdate, onDelete }) => {
  return (
    <div className="flex space-x-1 sm:space-x-2 p-1">
      <motion.button
        onClick={onUpdate}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 6px rgba(59, 130, 246, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3.5 text-blue-600 rounded-full shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-blue-500/50 cursor-pointer"
      >
        <FaEdit className="text-xs sm:text-sm" />
      </motion.button>
      <motion.button
        onClick={onDelete}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 6px rgba(239, 68, 68, 0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="p-3.5 text-red-600 rounded-full shadow-md transition-all duration-300 hover:brightness-110 hover:shadow-red-500/50 cursor-pointer"
      >
        <FaTrash className="text-xs sm:text-sm" />
      </motion.button>
    </div>
  );
};

export default ActionButtons;
