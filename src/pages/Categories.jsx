import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { 
  FaPlus, FaEdit, FaTrashAlt, FaCheckCircle, 
  FaTimesCircle, FaSearch, FaFilter, FaAngleLeft, FaAngleRight, 
  FaBold, FaItalic, FaUnderline, FaListUl, FaHeading, FaEraser
} from 'react-icons/fa';
import { api } from '../services/api';

// Map icons to categories
const iconMap = {
  plumber: '🚰',
  electrician: '⚡',
  painter: '🎨',
  househelp: '🧹',
  babycare: '👶',
  cook: '🍳',
  gardener: '🌱',
  acrepair: '❄️',
  rorepair: '🔧',
  shopkeeper: '🏪'
};

// Rich Text Editor Component
function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    handleInput();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition">
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 bg-slate-50 border-b border-slate-100 text-slate-600 text-xs">
        <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-slate-200 rounded transition cursor-pointer" title="Bold">
          <FaBold />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-slate-200 rounded transition cursor-pointer" title="Italic">
          <FaItalic />
        </button>
        <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-slate-200 rounded transition cursor-pointer" title="Underline">
          <FaUnderline />
        </button>
        <div className="h-4 w-px bg-slate-200 mx-1"></div>
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-slate-200 rounded transition cursor-pointer" title="Bullet List">
          <FaListUl />
        </button>
        <button type="button" onClick={() => execCommand('formatBlock', 'h3')} className="p-2 hover:bg-slate-200 rounded transition cursor-pointer" title="Heading H3">
          <FaHeading />
        </button>
        <button type="button" onClick={() => execCommand('removeFormat')} className="p-2 hover:bg-slate-200 rounded transition cursor-pointer" title="Clear Formatting">
          <FaEraser />
        </button>
      </div>
      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 min-h-[140px] outline-none text-xs text-slate-700 prose prose-sm max-w-none bg-slate-50/10"
        style={{ minHeight: '140px' }}
      />
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    commissionPercent: '',
    icon: ''
  });

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Fetching Categories',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter Logic
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'active') return matchesSearch && cat.isActive;
    if (statusFilter === 'inactive') return matchesSearch && !cat.isActive;
    return matchesSearch;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleToggleStatus = async (category) => {
    const nextActive = !category.isActive;
    const nextStatusText = nextActive ? 'Active' : 'Inactive';
    
    try {
      await api.updateCategory(category._id, { isActive: nextActive });
      setCategories(categories.map(c => 
        c._id === category._id ? { ...c, isActive: nextActive } : c
      ));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `${category.name} status updated to ${nextStatusText}`,
        showConfirmButton: false,
        timer: 2000
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Unable to update category status.',
        confirmButtonColor: '#13264d'
      });
    }
  };

  const handleDeleteCategory = (cat) => {
    Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete "${cat.name}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteCategory(cat._id);
          setCategories(categories.filter(c => c._id !== cat._id));
          Swal.fire('Deleted!', 'Category has been removed.', 'success');
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: error.message || 'Unable to delete category.',
            confirmButtonColor: '#13264d'
          });
        }
      }
    });
  };

  // Open Modal for Add/Edit
  const openModal = (cat = null) => {
    if (cat) {
      setEditCategory(cat);
      setFormData({
        name: cat.name,
        description: cat.description || '',
        commissionPercent: cat.commissionPercent,
        icon: cat.icon || ''
      });
    } else {
      setEditCategory(null);
      setFormData({
        name: '',
        description: '',
        commissionPercent: '',
        icon: ''
      });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.commissionPercent) {
      Swal.fire('Validation Error', 'Please enter both name and commission percentage', 'error');
      return;
    }

    try {
      if (editCategory) {
        // Edit Mode
        const updatedCat = await api.updateCategory(editCategory._id, {
          name: formData.name,
          description: formData.description,
          commissionPercent: Number(formData.commissionPercent),
          icon: formData.icon
        });
        setCategories(categories.map(c => c._id === editCategory._id ? { ...c, ...updatedCat } : c));
        Swal.fire('Updated!', 'Category details saved.', 'success');
      } else {
        // Add Mode
        const newCat = await api.createCategory({
          name: formData.name,
          description: formData.description,
          commissionPercent: Number(formData.commissionPercent),
          icon: formData.icon
        });
        setCategories([...categories, newCat]);
        Swal.fire('Created!', `Category "${formData.name}" has been created.`, 'success');
      }
      closeModal();
    } catch (error) {
      Swal.fire('Error', error.message || 'Something went wrong', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Category Console</h1>
          <p className="text-slate-500 text-sm">Configure services, commissions and parameters</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition cursor-pointer"
        >
          <FaPlus className="text-xs" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-grow max-w-md">
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-xs" />
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
        </div>
        <div className="flex items-center space-x-3">
          <FaFilter className="text-slate-400 text-xs" />
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-800"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loading Categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium">No categories found matching filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Category Info</th>
                  <th className="py-4 px-6">Slug</th>
                  <th className="py-4 px-6 text-center">Commission</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                {currentItems.map((cat) => {
                  const icon = cat.icon || iconMap[cat.slug] || '📁';
                  return (
                    <tr key={cat._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl p-2 bg-slate-100 rounded-xl">{icon}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{cat.name}</p>
                            <p className="text-slate-400 text-[9px] font-mono mt-0.5">ID: {cat._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">{cat.slug}</span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-slate-800">
                        {cat.commissionPercent}%
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          cat.isActive 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleToggleStatus(cat)}
                            className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title={cat.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {cat.isActive ? <FaTimesCircle className="text-slate-400" /> : <FaCheckCircle className="text-emerald-500" />}
                          </button>
                          <button 
                            onClick={() => openModal(cat)}
                            className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition cursor-pointer"
                            title="Edit Category"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete Category"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredCategories.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-700">{indexOfFirstItem + 1}</strong> to{' '}
                <strong className="text-slate-700">{Math.min(indexOfLastItem, filteredCategories.length)}</strong> of{' '}
                <strong className="text-slate-700">{filteredCategories.length}</strong> entries
              </span>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FaAngleLeft className="text-xs" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      currentPage === page 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FaAngleRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Category Dialog Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 transform scale-100 transition-all duration-300 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                {editCategory ? 'Edit Category Parameters' : 'Add New Service Category'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Category Name */}
                <div className="space-y-1">
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">Category Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Plumber"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  />
                </div>

                {/* Default Commission */}
                <div className="space-y-1">
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">Commission (%) *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    max="100"
                    placeholder="e.g. 15"
                    value={formData.commissionPercent}
                    onChange={(e) => setFormData({ ...formData, commissionPercent: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                  />
                </div>
              </div>

              {/* Icon / Character */}
              <div className="space-y-1">
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">Emoji Icon (optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. 🚰"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>

              {/* Description Rich Text Editor */}
              <div className="space-y-1.5">
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-wider">Detailed Description</label>
                <RichTextEditor 
                  value={formData.description}
                  onChange={(content) => setFormData({ ...formData, description: content })}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
                >
                  {editCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
