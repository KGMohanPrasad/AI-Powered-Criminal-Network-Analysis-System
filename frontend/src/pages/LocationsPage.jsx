import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  ExternalLink,
  Building,
  Navigation,
  CheckCircle,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';
import { locationsApi } from '../services/api';

export default function LocationsPage({ onNavigate }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    locationId: '',
    name: '',
    address: '',
    city: '',
    district: '',
    state: 'Tamil Nadu',
    latitude: '',
    longitude: '',
    relatedCases: '',
    relatedIncidents: '',
    relatedPersons: '',
    status: 'ACTIVE',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await locationsApi.getAll();
      if (res.success) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const cities = useMemo(() => {
    const set = new Set(locations.map((l) => l.city).filter(Boolean));
    return Array.from(set);
  }, [locations]);

  // Filtering & Search
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        loc.name?.toLowerCase().includes(q) ||
        loc.locationId?.toLowerCase().includes(q) ||
        loc.address?.toLowerCase().includes(q) ||
        loc.city?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || loc.status === statusFilter;
      const matchesCity = cityFilter === 'ALL' || loc.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [locations, searchTerm, statusFilter, cityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLocations.length / pageSize) || 1;
  const paginatedLocations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLocations.slice(start, start + pageSize);
  }, [filteredLocations, currentPage, pageSize]);

  const validateForm = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = 'Location name is required.';
    if (!formData.city?.trim()) errs.city = 'City is required.';
    if (formData.latitude && isNaN(Number(formData.latitude))) {
      errs.latitude = 'Latitude must be a valid decimal number.';
    }
    if (formData.longitude && isNaN(Number(formData.longitude))) {
      errs.longitude = 'Longitude must be a valid decimal number.';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (selectedLocation) {
        await locationsApi.update(selectedLocation.id, formData);
      } else {
        await locationsApi.create(formData);
      }
      setIsFormModalOpen(false);
      setSelectedLocation(null);
      fetchLocations();
    } catch (err) {
      console.error('Error saving location:', err);
    }
  };

  const handleDelete = async () => {
    if (!locationToDelete) return;
    try {
      await locationsApi.delete(locationToDelete.id);
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
      fetchLocations();
    } catch (err) {
      console.error('Error deleting location:', err);
    }
  };

  const openCreateModal = () => {
    setSelectedLocation(null);
    setFormData({
      locationId: '',
      name: '',
      address: '',
      city: 'Chennai',
      district: 'Central',
      state: 'Tamil Nadu',
      latitude: '13.0827',
      longitude: '80.2707',
      relatedCases: '',
      relatedIncidents: '',
      relatedPersons: '',
      status: 'ACTIVE',
      notes: '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const openEditModal = (loc) => {
    setSelectedLocation(loc);
    setFormData({
      locationId: loc.locationId || '',
      name: loc.name || '',
      address: loc.address || '',
      city: loc.city || '',
      district: loc.district || '',
      state: loc.state || '',
      latitude: loc.latitude ? String(loc.latitude) : '',
      longitude: loc.longitude ? String(loc.longitude) : '',
      relatedCases: loc.relatedCases || '',
      relatedIncidents: loc.relatedIncidents || '',
      relatedPersons: loc.relatedPersons || '',
      status: loc.status || 'ACTIVE',
      notes: loc.notes || '',
    });
    setFormErrors({});
    setIsFormModalOpen(true);
  };

  const exportCSV = () => {
    const headers = ['Location ID,Name,Address,City,District,State,Latitude,Longitude,Status,Related Cases'];
    const rows = filteredLocations.map(
      (l) =>
        `"${l.locationId}","${l.name}","${l.address || ''}","${l.city || ''}","${l.district || ''}","${l.state || ''}","${l.latitude || ''}","${l.longitude || ''}","${l.status}","${l.relatedCases || ''}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locations_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Geographic Infrastructure Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Investigation Locations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage monitored physical sites, intermodal transshipment points, depots, and incident rendezvous coordinates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('crime-map')}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-intel-card hover:bg-intel-panel border border-intel-border text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-cyan-400" />
            <span>Open Incident Map</span>
          </button>
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-intel-card hover:bg-intel-panel border border-intel-border text-slate-300 hover:text-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-cyan-glow flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Location</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-intel-card border border-intel-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by code, name, city, address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-intel-base border border-intel-border text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-intel-base border border-intel-border text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="MONITORED">MONITORED</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">City:</span>
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-intel-base border border-intel-border text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="ALL">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || statusFilter !== 'ALL' || cityFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setCityFilter('ALL');
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Locations Table */}
      <div className="rounded-2xl border border-intel-border bg-intel-card overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-intel-panel text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-intel-border sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-4">Location ID</th>
                <th className="py-3.5 px-4">Name & Address</th>
                <th className="py-3.5 px-4">Jurisdiction</th>
                <th className="py-3.5 px-4">Coordinates (GPS)</th>
                <th className="py-3.5 px-4">Related Dossiers</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-intel-border/60 font-sans">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4">
                      <div className="h-6 bg-intel-panel rounded-lg w-full"></div>
                    </td>
                  </tr>
                ))
              ) : paginatedLocations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <MapPin className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-medium text-slate-300">No investigation locations found</p>
                    <p className="text-xs text-slate-500 mt-1">Register monitored facilities or reset search filters</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-all cursor-pointer"
                    >
                      Add Location
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-intel-panel/50 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-medium text-cyan-400 whitespace-nowrap">
                      {loc.locationId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{loc.name}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{loc.address}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-200">{loc.city}</div>
                      <div className="text-[11px] text-slate-400">{loc.district || loc.state}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {loc.latitude && loc.longitude ? (
                        <span>
                          {Number(loc.latitude).toFixed(4)}° N, {Number(loc.longitude).toFixed(4)}° E
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Not Geo-coded</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                      {loc.relatedCases ? (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono text-[11px]">
                          {loc.relatedCases}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">None linked</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider ${
                          loc.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : loc.status === 'MONITORED'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                        }`}
                      >
                        {loc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedLocation(loc);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-intel-panel border border-transparent hover:border-intel-border transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(loc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-intel-panel border border-transparent hover:border-intel-border transition-colors"
                          title="Edit Location"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setLocationToDelete(loc);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-intel-panel border border-transparent hover:border-intel-border transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-intel-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded bg-intel-base border border-intel-border text-slate-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>
              Showing {filteredLocations.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{' '}
              {Math.min(currentPage * pageSize, filteredLocations.length)} of {filteredLocations.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-intel-panel border border-intel-border disabled:opacity-40 hover:text-slate-200"
            >
              Previous
            </button>
            <span className="px-2 font-bold text-cyan-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-intel-panel border border-intel-border disabled:opacity-40 hover:text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Detail Modal */}
      {isViewModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-intel-card border border-intel-border p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-intel-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedLocation.name}</h3>
                  <p className="text-xs font-mono text-cyan-400">{selectedLocation.locationId}</p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-intel-panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-mono">Address:</span>
                <p className="text-slate-200 font-medium">{selectedLocation.address || 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-mono">City / District:</span>
                  <p className="text-slate-200">{selectedLocation.city}, {selectedLocation.district || selectedLocation.state}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">Status:</span>
                  <p className="text-slate-200">{selectedLocation.status}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-mono">Latitude:</span>
                  <p className="text-slate-200 font-mono">{selectedLocation.latitude || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-mono">Longitude:</span>
                  <p className="text-slate-200 font-mono">{selectedLocation.longitude || 'N/A'}</p>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Related Cases:</span>
                <p className="text-slate-200">{selectedLocation.relatedCases || 'None'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Associated Incidents & Persons:</span>
                <p className="text-slate-200">{selectedLocation.relatedIncidents || ''} {selectedLocation.relatedPersons ? `• ${selectedLocation.relatedPersons}` : ''}</p>
              </div>
              {selectedLocation.notes && (
                <div>
                  <span className="text-slate-400 font-mono">Investigator Notes:</span>
                  <p className="text-slate-300 bg-intel-base p-2.5 rounded-xl border border-intel-border mt-1">
                    {selectedLocation.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-intel-border flex justify-end gap-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-intel-panel hover:bg-intel-border text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-intel-card border border-intel-border p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-intel-border">
              <h3 className="text-base font-bold text-slate-100">
                {selectedLocation ? 'Edit Investigation Location' : 'Register New Location'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-intel-panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Location Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Intermodal Freight Depot"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.name && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MONITORED">MONITORED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. Gate 12, Terminal Basin 4, Outer Harbour Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.city && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">District</label>
                  <input
                    type="text"
                    placeholder="e.g. Central"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">State</label>
                  <input
                    type="text"
                    placeholder="e.g. Tamil Nadu"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Latitude</label>
                  <input
                    type="text"
                    placeholder="e.g. 13.0900"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.latitude && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.latitude}</p>}
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Longitude</label>
                  <input
                    type="text"
                    placeholder="e.g. 80.2950"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                  {formErrors.longitude && <p className="text-rose-400 text-[10px] mt-0.5">{formErrors.longitude}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Related Cases</label>
                  <input
                    type="text"
                    placeholder="e.g. CASE-2026-0001"
                    value={formData.relatedCases}
                    onChange={(e) => setFormData({ ...formData, relatedCases: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Related Persons</label>
                  <input
                    type="text"
                    placeholder="e.g. DEMO-P001, DEMO-P008"
                    value={formData.relatedPersons}
                    onChange={(e) => setFormData({ ...formData, relatedPersons: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Surveillance / Site Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record observations, operational security flags, access gates..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-intel-base border border-intel-border text-slate-200 focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-intel-border flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-intel-panel hover:bg-intel-border text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 shadow-cyan-glow"
                >
                  {selectedLocation ? 'Update Location' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Section 41) */}
      {isDeleteModalOpen && locationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-intel-card border border-rose-500/30 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Delete Location?</h3>
                <p className="text-xs text-slate-400">This action will remove the record from investigation registry.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-intel-base p-3 rounded-xl border border-intel-border">
              Are you sure you want to delete <span className="font-bold text-cyan-400">{locationToDelete.name}</span> ({locationToDelete.locationId})?
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-intel-panel hover:bg-intel-border text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
