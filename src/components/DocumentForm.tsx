import { Plus, Trash2 } from 'lucide-react';
import type { DocumentData, Item } from '../types';

interface DocumentFormProps {
  data: DocumentData;
  onChange: (data: Partial<DocumentData>) => void;
}

export function DocumentForm({ data, onChange }: DocumentFormProps) {
  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate total for item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(field === 'quantity' ? value as string : newItems[index].quantity) || 0;
      const unitPrice = parseFloat(field === 'unitPrice' ? value as string : newItems[index].unitPrice) || 0;
      newItems[index].total = quantity * unitPrice;
    }
    
    onChange({ items: newItems });
  };

  const addItem = () => {
    onChange({
      items: [...data.items, { designation: '', quantity: '', unitPrice: '', total: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (data.items.length > 1) {
      onChange({ items: data.items.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de Document
          </label>
          <input
            type="text"
            value={data.documentNumber}
            onChange={(e) => onChange({ documentNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Client Info (Facture only) */}
      {data.type === 'facture' && (
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Informations Client</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du Client
            </label>
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => onChange({ clientName: e.target.value })}
              placeholder="Palais al medina"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              value={data.clientAddress}
              onChange={(e) => onChange({ clientAddress: e.target.value })}
              placeholder="avenue allal al fassi"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              value={data.clientCity}
              onChange={(e) => onChange({ clientCity: e.target.value })}
              placeholder="Fes"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Articles</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">Article {index + 1}</span>
                {data.items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <textarea
                value={item.designation}
                onChange={(e) => handleItemChange(index, 'designation', e.target.value)}
                placeholder="Désignation"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
              />
              
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  placeholder="Qté"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  placeholder="Prix Unit."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  value={item.total.toFixed(2)}
                  disabled
                  placeholder="Total"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TVA and Remise */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            TVA (%)
          </label>
          <input
            type="number"
            value={data.tvaRate === 0 ? '' : data.tvaRate}
            onChange={(e) => {
              const raw = e.target.value;
              onChange({ tvaRate: raw === '' ? 0 : parseFloat(raw) || 0 });
            }}
            placeholder="0"
            disabled={data.type === 'bon_de_livraison' || data.type === 'bon_de_commande'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remise (%)
          </label>
          <input
            type="number"
            value={data.remiseRate === 0 ? '' : data.remiseRate}
            onChange={(e) => {
              const raw = e.target.value;
              onChange({ remiseRate: raw === '' ? 0 : parseFloat(raw) || 0 });
            }}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Footer Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="includeFooter"
          checked={data.includeFooter}
          onChange={(e) => onChange({ includeFooter: e.target.checked })}
          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor="includeFooter" className="text-sm font-medium text-gray-700">
          Inclure les informations de l'entreprise
        </label>
      </div>
    </div>
  );
}