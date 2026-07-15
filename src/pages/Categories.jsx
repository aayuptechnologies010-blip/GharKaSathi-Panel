import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  FaPlus, FaEdit, FaTrashAlt, FaFolderPlus, FaCheckCircle, 
  FaTimesCircle, FaWrench, FaBolt, FaPaintRoller, FaUserFriends, 
  FaChild, FaUtensils, FaLeaf, FaSnowflake, FaTint, FaStore 
} from 'react-icons/fa';

// Map icons to categories
const iconMap = {
  plumber: FaTint,
  electrician: FaBolt,
  painter: FaPaintRoller,
  househelp: FaUserFriends,
  babycare: FaChild,
  cook: FaUtensils,
  gardener: FaLeaf,
  acrepair: FaSnowflake,
  rorepair: FaWrench,
  shopkeeper: FaStore
};

const initialCategories = [
  { id: 'CAT-01', name: 'Plumber', slug: 'plumber', providers: 48, status: 'Active', commission: '10%' },
  { id: 'CAT-02', name: 'Electrician', slug: 'electrician', providers: 52, status: 'Active', commission: '12%' },
  { id: 'CAT-03', name: 'Painter', slug: 'painter', providers: 24, status: 'Active', commission: '15%' },
  { id: 'CAT-04', name: 'House Help / Maid', slug: 'househelp', providers: 89, status: 'Active', commission: '5%' },
  { id: 'CAT-05', name: 'Baby Care / Nanny', slug: 'babycare', providers: 15, status: 'Active', commission: '8%' },
  { id: 'CAT-06', name: 'Cook', slug: 'cook', providers: 32, status: 'Active', commission: '8%' },
  { id: 'CAT-07', name: 'Gardener', slug: 'gardener', providers: 18, status: 'Active', commission: '10%' },
  { id: 'CAT-08', name: 'AC/Fridge Repair', slug: 'acrepair', providers: 29, status: 'Active', commission: '15%' },
  { id: 'CAT-09', name: 'RO Repair', slug: 'rorepair', providers: 14, status: 'Active', commission: '12%' },
  { id: 'CAT-10', name: 'Shopkeepers (Grocery, Medical, Hardware)', slug: 'shopkeeper', providers: 65, status: 'Active', commission: '5%' }
];

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);

  const handleToggleStatus = (category) => {
    const nextStatus = category.status === 'Active' ? 'Inactive' : 'Active';
    setCategories(categories.map(c => 
      c.id === category.id ? { ...c, status: nextStatus } : c
    ));
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${category.name} status updated to ${nextStatus}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handleAddCategory = () => {
    Swal.fire({
      title: 'Add New Category',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
            <input id="cat-name" class="swal2-input w-full m-0 rounded-xl" placeholder="e.g. Appliance Repair">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Default Commission (%)</label>
            <input id="cat-commission" class="swal2-input w-full m-0 rounded-xl" type="number" placeholder="e.g. 10">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Category',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#64748b',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('cat-name').value;
        const commission = document.getElementById('cat-commission').value;
        if (!name || !commission) {
          Swal.showValidationMessage('Please enter both name and commission percentage');
        }
        return { name, commission };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newCat = {
          id: `CAT-${String(categories.length + 1).padStart(2, '0')}`,
          name: result.value.name,
          slug: result.value.name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
          providers: 0,
          status: 'Active',
          commission: `${result.value.commission}%`
        };
        setCategories([...categories, newCat]);
        Swal.fire({
          title: 'Success!',
          text: `Category "${result.value.name}" has been created.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleEditCategory = (cat) => {
    Swal.fire({
      title: 'Edit Category',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
            <input id="cat-name" class="swal2-input w-full m-0 rounded-xl" value="${cat.name}">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Commission (%)</label>
            <input id="cat-commission" class="swal2-input w-full m-0 rounded-xl" type="number" value="${parseInt(cat.commission)}">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#64748b',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('cat-name').value;
        const commission = document.getElementById('cat-commission').value;
        if (!name || !commission) {
          Swal.showValidationMessage('Please fill in all fields');
        }
        return { name, commission };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(categories.map(c => 
          c.id === cat.id ? { ...c, name: result.value.name, commission: `${result.value.commission}%` } : c
        ));
        Swal.fire({
          title: 'Updated!',
          text: `Category details saved.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleDeleteCategory = (cat) => {
    Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to delete ${cat.name}? This will remove all bindings!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete!',
    }).then((result) => {
      if (result.isConfirmed) {
        setCategories(categories.filter(c => c.id !== cat.id));
        Swal.fire('Deleted!', 'Category has been removed.', 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Category Management</h1>
          <p className="text-slate-500 text-sm">Create and modify service categories and commission rates</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-sky-500/10 transition"
        >
          <FaPlus className="text-xs" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.slug] || FaFolderPlus;
          return (
            <div 
              key={cat.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition ${
                cat.status === 'Inactive' ? 'opacity-65' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                    <IconComponent className="text-xl" />
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    cat.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cat.status}
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight">{cat.name}</h4>
                  <p className="text-slate-400 text-xs mt-1">ID: {cat.id}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-50 pt-4 flex justify-between items-center text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Partners</p>
                  <p className="font-bold text-slate-700 mt-0.5">{cat.providers}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Commission</p>
                  <p className="font-bold text-slate-700 mt-0.5">{cat.commission}</p>
                </div>
                <div className="flex space-x-1.5">
                  <button 
                    onClick={() => handleToggleStatus(cat)}
                    className="p-2 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-lg transition"
                    title={cat.status === 'Active' ? 'Deactivate' : 'Activate'}
                  >
                    {cat.status === 'Active' ? <FaTimesCircle /> : <FaCheckCircle className="text-emerald-500" />}
                  </button>
                  <button 
                    onClick={() => handleEditCategory(cat)}
                    className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition"
                    title="Edit Details"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                    title="Delete Category"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
