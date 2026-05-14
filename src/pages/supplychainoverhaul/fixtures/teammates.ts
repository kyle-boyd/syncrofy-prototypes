export interface Teammate {
  id: string;
  name: string;
  role: string;
}

export const teammates: Teammate[] = [
  { id: 't-maria', name: 'Maria Chen', role: 'Trading partner ops' },
  { id: 't-daniel', name: 'Daniel Park', role: 'Item master & catalog' },
  { id: 't-alex', name: 'Alex Rivera', role: 'EDI integrations' },
  { id: 't-priya', name: 'Priya Patel', role: 'Order operations' },
];
