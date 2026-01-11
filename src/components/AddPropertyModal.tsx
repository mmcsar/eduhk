import React, { useState } from 'react';

export function AddPropertyModal({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    currency: 'USD',
    type: 'house',
    address: '',
    neighborhood: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    transaction_type: 'sale'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Ajouter une Propriété</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Ex: Villa luxueuse au Golf"
                className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de transaction</label>
              <select
                name="transaction_type"
                className="w-full rounded-lg border-gray-300 border p-2"
                value={formData.transaction_type}
                onChange={handleChange}
              >
                <option value="sale">Vente</option>
                <option value="rent">Location</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
              <select
                name="type"
                className="w-full rounded-lg border-gray-300 border p-2"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="house">Maison</option>
                <option value="apartment">Appartement</option>
                <option value="villa">Villa</option>
                <option value="land">Terrain</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="0.00"
                  className="w-full rounded-lg border-gray-300 border p-2"
                  value={formData.price}
                  onChange={handleChange}
                />
                <select
                  name="currency"
                  className="rounded-lg border-gray-300 border p-2 bg-gray-50"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="CDF">CDF</option>
                </select>
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                <input
                  type="text"
                  name="neighborhood"
                  placeholder="Ex: Lubumbashi Golf"
                  className="w-full rounded-lg border-gray-300 border p-2"
                  value={formData.neighborhood}
                  onChange={handleChange}
                />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
              <input
                type="number"
                name="bedrooms"
                className="w-full rounded-lg border-gray-300 border p-2"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
              <input
                type="number"
                name="bathrooms"
                className="w-full rounded-lg border-gray-300 border p-2"
                value={formData.bathrooms}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full rounded-lg border-gray-300 border p-2"
              placeholder="Décrivez le bien..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Publier l'annonce
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
