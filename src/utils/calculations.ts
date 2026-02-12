import type { DocumentData } from '../types';

export function calculateTotals(data: DocumentData) {
  const totalHT = data.items.reduce((sum, item) => sum + item.total, 0);
  const remiseAmount = totalHT * (data.remiseRate / 100);
  const totalAfterRemise = totalHT - remiseAmount;
  
  // TVA is included for facture and devis, but not for bon_de_commande or bon_de_livraison
  const includeTVA = data.type === 'facture' || data.type === 'devis';
  const tvaAmount = includeTVA ? totalAfterRemise * (data.tvaRate / 100) : 0;
  const totalTTC = totalAfterRemise + tvaAmount;

  return {
    totalHT,
    remiseAmount,
    tvaAmount,
    totalTTC,
  };
}

export function numberToFrenchWords(num: number): string {
  if (num === 0) return 'zéro';

  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  function convertLessThanThousand(n: number): string {
    if (n === 0) return '';
    
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    
    if (n < 100) {
      const ten = Math.floor(n / 10);
      const unit = n % 10;
      
      if (ten === 7 || ten === 9) {
        const base = tens[ten - 1];
        const remainder = n - (ten * 10);
        if (remainder < 10) {
          return base + '-' + units[remainder];
        } else {
          return base + '-' + teens[remainder - 10];
        }
      }
      
      if (ten === 8) {
        if (unit === 0) return 'quatre-vingts';
        return 'quatre-vingt-' + units[unit];
      }
      
      if (unit === 0) return tens[ten];
      if (unit === 1 && ten === 2) return 'vingt et un';
      if (unit === 1 && (ten === 3 || ten === 4 || ten === 5 || ten === 6)) return tens[ten] + ' et un';
      return tens[ten] + '-' + units[unit];
    }
    
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    
    let result = '';
    if (hundred === 1) {
      result = 'cent';
    } else {
      result = units[hundred] + ' cent';
      if (remainder === 0) result += 's';
    }
    
    if (remainder > 0) {
      result += ' ' + convertLessThanThousand(remainder);
    }
    
    return result;
  }

  function convert(n: number): string {
    if (n === 0) return 'zéro';
    
    const million = Math.floor(n / 1000000);
    const thousand = Math.floor((n % 1000000) / 1000);
    const remainder = n % 1000;
    
    let result = '';
    
    if (million > 0) {
      if (million === 1) {
        result += 'un million';
      } else {
        result += convertLessThanThousand(million) + ' millions';
      }
    }
    
    if (thousand > 0) {
      if (result) result += ' ';
      if (thousand === 1) {
        result += 'mille';
      } else {
        result += convertLessThanThousand(thousand) + ' mille';
      }
    }
    
    if (remainder > 0) {
      if (result) result += ' ';
      result += convertLessThanThousand(remainder);
    }
    
    return result;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);
  
  let result = convert(integerPart);
  
  if (decimalPart > 0) {
    result += ' virgule ' + convert(decimalPart);
  }
  
  // Capitalize first letter
  return result.charAt(0).toUpperCase() + result.slice(1);
}
