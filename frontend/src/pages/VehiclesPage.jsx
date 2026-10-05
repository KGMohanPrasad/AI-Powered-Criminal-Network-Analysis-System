import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  Filter,
  Plus,
  MapPin,
  Briefcase,
  User,
  Shield,
  X
} from 'lucide-react';
import EthicsNoticeBanner from '../components/EthicsNoticeBanner';
import { vehiclesApi } from '../services/api';
import { toast } from '../utils/toast';

export default function VehiclesPage({ onNavigate }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: `TN-00-DEMO-${Math.floor(100 + Math.random() * 900)}`,
    vehicleType: 'Sedan',
    brand: 'Toyota',
    model: 'Camry',
    color: 'Dark Grey',
    owner: 'DEMO-P001',
    associatedCases: 'CASE-2026-0001',
    lastKnownLocation: 'Harbor Road Checkpoint',
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehiclesApi.getAll();
      setVehicles(res.data || []);
    } catch (err) {
      console.error('Failed to load vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await vehiclesApi.create(newVehicle);
      setVehicles((prev) => [res.data || newVehicle, ...prev]);
      setShowModal(false);
      toast.success('Synthetic vehicle record registered.');
    } catch (err) {
      setVehicles((prev) => [newVehicle, ...prev]);
      setShowModal(false);
      toast.info('Synthetic vehicle added to local view.');
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      (v.registrationNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.brand || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.owner || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.lastKnownLocation || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || v.vehicleType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-intel-card border border-intel-border">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Automotive Asset & Transport Registry
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
                {vehicles.length} Synthetic Vehicles
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Registered fleet assets, fictional license markers, and case movement logs.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-cyan-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Register Vehicle</span>
        </button>
      </div>

      <EthicsNoticeBanner />

      {/* Filter and Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 rounded-2xl bg-intel-card border border-intel-border">
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by registration plate, make, model, owner, or last location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-intel-panel border border-intel-border text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Commercial Truck</option>
            <option value="Van">Cargo Van</option>
            <option value="Motorcycle">Motorcycle</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="rounded-2xl bg-intel-card border border-intel-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-intel-panel/60 border-b border-intel-border text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Plate / Registration</th>
                <th className="py-3 px-4">Make & Model</th>
                <th className="py-3 px-4">Type & Color</th>
                <th className="py-3 px-4">Registered Owner</th>
                <th className="py-3 px-4">Associated Cases</th>
                <th className="py-3 px-4">Last Observed Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border">
              {filteredVehicles.map((v) => (
                <tr key={v.id || v.registrationNumber} className="hover:bg-intel-panel/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded bg-intel-panel border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                      {v.registrationNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-200">
                    {v.brand} {v.model}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="text-slate-300">{v.vehicleType}</span> — {v.color}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-purple-400">
                    {v.owner || 'Unregistered'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {v.associatedCases || 'None'}
                  </td>
                  <td className="py-3 px-4 text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{v.lastKnownLocation || 'Unknown'}</span>
                  </td>
                </tr>
              ))}

              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No vehicles found matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-intel-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-intel-border pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" />
                Register Synthetic Vehicle
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Registration Plate (Demo)
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehicle.registrationNumber}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, registrationNumber: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={newVehicle.vehicleType}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, vehicleType: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Commercial Truck</option>
                    <option value="Van">Cargo Van</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehicle.brand}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, brand: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehicle.model}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, model: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehicle.color}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, color: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Registered Owner
                  </label>
                  <input
                    type="text"
                    value={newVehicle.owner}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, owner: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Associated Case
                  </label>
                  <input
                    type="text"
                    value={newVehicle.associatedCases}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, associatedCases: e.target.value })
                    }
                    className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 font-mono outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                  Last Known Location
                </label>
                <input
                  type="text"
                  value={newVehicle.lastKnownLocation}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, lastKnownLocation: e.target.value })
                  }
                  className="w-full bg-intel-panel border border-intel-border text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-intel-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-intel-panel border border-intel-border text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-cyan-glow"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
