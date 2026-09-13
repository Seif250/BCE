// src/components/calculator/DiscountSimulator.tsx
import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface DiscountSimulatorProps {
  terms: number;
  setTerms: (t: number) => void;
  siblingCount: number;
  setSiblingCount: (c: number) => void;
  isYoungestSibling: boolean;
  setIsYoungestSibling: (v: boolean) => void;
}

export const DiscountSimulator: React.FC<DiscountSimulatorProps> = ({
  terms,
  setTerms,
  siblingCount,
  setSiblingCount,
  isYoungestSibling,
  setIsYoungestSibling,
}) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
      <h2 className="text-sm font-bold">{t.discountSimulatorTitle || 'Discount Simulator'}</h2>
      <div className="flex items-center space-x-2">
        <label className="text-sm">{t.termsLabel || 'Terms'}:</label>
        <select
          value={terms}
          onChange={e => setTerms(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}> {n} </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label className="text-sm">{t.siblingCountLabel || 'Sibling Count'}:</label>
        <select
          value={siblingCount}
          onChange={e => setSiblingCount(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {[1, 2, 3].map((n) => (
            <option key={n} value={n}> {n} </option>
          ))}
        </select>
      </div>
      {siblingCount > 1 && (
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isYoungestSibling}
            onChange={e => setIsYoungestSibling(e.target.checked)}
          />
          <span className="text-sm">{t.isYoungestSiblingLabel || 'Youngest Sibling Discount'}</span>
        </div>
      )}
    </div>
  );
};
