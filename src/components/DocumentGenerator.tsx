import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { DocumentForm } from './DocumentForm';
import { DocumentPreview } from './DocumentPreview';
import { generatePDF } from '../utils/pdfGenerator';
import type { DocumentType, DocumentData } from '../types';

export function DocumentGenerator() {
  const [activeTab, setActiveTab] = useState<DocumentType>('devis');
  const [documentData, setDocumentData] = useState<DocumentData>({
    type: 'devis',
    documentNumber: '022/2026',
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    clientAddress: '',
    clientCity: '',
    items: [
      { designation: '', quantity: '', unitPrice: '', total: 0 }
    ],
    tvaRate: 20,
    remiseRate: 0,
    includeFooter: true,
  });

  const handleTabChange = (type: DocumentType) => {
    setActiveTab(type);
    setDocumentData({ ...documentData, type });
  };

  const handleDataChange = (data: Partial<DocumentData>) => {
    setDocumentData({ ...documentData, ...data });
  };

  const handleGeneratePDF = () => {
    generatePDF(documentData);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <FileText className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Manteau Vert</h1>
        </div>
        <p className="text-gray-600">Générateur de Documents</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => handleTabChange('devis')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'devis'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Devis
          </button>
          <button
            onClick={() => handleTabChange('facture')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'facture'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Facture
          </button>
          <button
            onClick={() => handleTabChange('bon_de_commande')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'bon_de_commande'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Bon de Commande
          </button>
          <button
            onClick={() => handleTabChange('bon_de_livraison')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'bon_de_livraison'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Bon de Livraison
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <DocumentForm data={documentData} onChange={handleDataChange} />
          
          {/* Generate PDF Button */}
          <button
            onClick={handleGeneratePDF}
            className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Générer PDF
          </button>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Aperçu</h2>
          <div className="border rounded-lg overflow-hidden">
            <DocumentPreview data={documentData} />
          </div>
        </div>
      </div>
    </div>
  );
}
