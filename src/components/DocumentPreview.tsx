import type { DocumentData } from '../types';
import { calculateTotals, numberToFrenchWords } from '../utils/calculations';

interface DocumentPreviewProps {
  data: DocumentData;
}

export function DocumentPreview({ data }: DocumentPreviewProps) {
  const { totalHT, tvaAmount, remiseAmount, totalTTC } = calculateTotals(data);
  
  const getDocumentTitle = () => {
    switch (data.type) {
      case 'facture':
        return 'FACTURE';
      case 'bon_de_commande':
        return 'BON DE COMMANDE';
      case 'bon_de_livraison':
        return 'BON DE LIVRAISON';
      default:
        return 'DEVIS';
    }
  };

  // Only devis + facture show TVA lines
  const includeTVA = data.type === 'facture' || data.type === 'devis';

  return (
    <div className="bg-white p-8 text-sm" id="document-preview" style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: '#1f2937' }}>{getDocumentTitle()}</h1>
      </div>

      {/* Logo and Client Info */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <span className="text-5xl italic" style={{ fontFamily: 'Brush Script MT, cursive', color: '#f97316' }}>M</span>
          <span className="font-semibold" style={{ color: '#f97316' }}>ANTEAU VERT</span>
        </div>
        <div className="text-right text-sm">
          <div className="mb-1"><span className="font-semibold">A :</span> {data.clientName || '_______'}</div>
          <div className="mb-1"><span className="font-semibold">Adresse :</span> {data.clientAddress || '_______'}</div>
          <div><span className="font-semibold">Ville :</span> {data.clientCity || '_______'}</div>
        </div>
      </div>

      {/* Company Info */}
      <div className="mb-6 text-sm">
        <div className="mb-1"><span className="font-semibold">ICE :</span>00152439000002</div>
        <div className="mb-4"><span className="font-semibold">Adresse :</span> NR 23 BLOCK LOT BIRANZARANE BENSEFFAR SEFROU (M)</div>
        <div className="flex justify-between items-center">
          <div className="font-semibold italic">
            {data.type === 'devis' && 'DEVIS'}
            {data.type === 'facture' && 'FACTURE'}
            {data.type === 'bon_de_commande' && 'BON DE COMMANDE'}
            {data.type === 'bon_de_livraison' && 'BON DE LIVRAISON'}
            / N {data.documentNumber}
          </div>
          <div>Le {new Date(data.date).toLocaleDateString('fr-FR')}</div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse mb-6" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>
        <thead>
          <tr style={{ backgroundColor: '#f9fafb' }}>
            <th className="px-3 py-2 text-left font-semibold italic" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>Désignation</th>
            <th className="px-3 py-2 text-center font-semibold" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>Quantité</th>
            <th className="px-3 py-2 text-center font-semibold" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>Unité DH</th>
            <th className="px-3 py-2 text-right font-semibold italic" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>Prix</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="px-3 py-2 whitespace-pre-wrap align-top" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{item.designation || '-'}</td>
              <td className="px-3 py-2 text-center align-top" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{item.quantity || '-'}</td>
              <td className="px-3 py-2 text-center align-top" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{item.unitPrice || '-'}</td>
              <td className="px-3 py-2 text-right align-top" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{item.total > 0 ? item.total.toFixed(2) : '-'}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} className="px-3 py-2" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}></td>
            <td className="px-3 py-2 text-center font-semibold" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>TOTAL HT</td>
            <td className="px-3 py-2 text-right font-semibold" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{totalHT.toFixed(2)} DH</td>
          </tr>
          {remiseAmount > 0 && (
            <tr>
              <td colSpan={2} className="px-3 py-2" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}></td>
              <td className="px-3 py-2 text-center" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>Remise {data.remiseRate}%</td>
              <td className="px-3 py-2 text-right" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>-{remiseAmount.toFixed(2)} DH</td>
            </tr>
          )}
          {includeTVA && (
            <tr>
              <td colSpan={2} className="px-3 py-2" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}></td>
              <td className="px-3 py-2 text-center" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>TVA {data.tvaRate}%</td>
              <td className="px-3 py-2 text-right" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{tvaAmount.toFixed(2)} DH</td>
            </tr>
          )}
          <tr>
            <td colSpan={2} className="px-3 py-2" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}></td>
            <td className="px-3 py-2 text-center font-semibold" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>TOTAL TTC</td>
            <td className="px-3 py-2 text-right font-semibold" style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: '#9ca3af' }}>{totalTTC.toFixed(2)} DH</td>
          </tr>
        </tbody>
      </table>

      {/* Amount in words */}
      <div className="mb-8 text-sm">
        <p>
          Le présent {data.type === 'devis' ? 'devis' : data.type === 'facture' ? 'facture' : data.type === 'bon_de_livraison' ? 'bon de livraison' : 'bon de commande'} est arrêté à la somme de{' '}
          <span className="font-semibold">{numberToFrenchWords(totalTTC)} dirhams TTC</span>.
        </p>
      </div>

      {/* Footer */}
      {data.includeFooter && (
        <div className="text-sm space-y-1 pt-4" style={{ color: '#374151', borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: '#d1d5db' }}>
          <div><span className="font-semibold italic">ICE :</span> 003642783000046</div>
          <div><span className="font-semibold italic">TAXE profes :</span> 15303199</div>
          <div><span className="font-semibold italic">Adresse :</span> NR 23 BLOCK LOT BIRANZARANE BENSEFFAR SEFROU (M)</div>
          <div><span className="font-semibold italic">Tele :</span> 0660955530</div>
          <div><span className="font-semibold italic">R.I.B :</span> 350 810 0000000012977145 76</div>
        </div>
      )}
    </div>
  );
}