export type DocumentType = 'devis' | 'facture' | 'bon_de_commande' | 'bon_de_livraison';

export interface Item {
  designation: string;
  quantity: string;
  unitPrice: string;
  total: number;
}

export interface DocumentData {
  type: DocumentType;
  documentNumber: string;
  date: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  items: Item[];
  tvaRate: number;
  remiseRate: number;
  includeFooter: boolean;
}
