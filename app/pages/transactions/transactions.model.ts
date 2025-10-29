import { useState } from 'react';


export interface ChipData {
 id: string;
 label: string;
 selected: boolean;
 range: string;
}

export function TransactionsModel() {
 const [chips, setChips] = useState<ChipData[]>([
    { id: '1', label: 'Tudo', selected: true, range: 'all' }, 
    { id: '2', label: 'Receitas', selected: false, range: 'incomes' },
    { id: '3', label: 'Despesas', selected: false, range: 'expenses' },
 ]);

 const toggleChip = (id: string) => {
  setChips((prevChips) =>
     prevChips.map((chip) =>

     chip.id === id ? { ...chip, selected: true } : { ...chip, selected: false }
    )
 );
 };

 return { chips, toggleChip };
}

