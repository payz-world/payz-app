// Customer navigation is presentation-only. Provider classifications and
// internal order processing are unchanged.
export const CUSTOMER_CATEGORIES = [
  { id: 'shopping', name: 'Shopping' },
  { id: 'food-beverage', name: 'Food & Beverage' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'sports', name: 'Sports' },
  { id: 'travel', name: 'Travel' },
  { id: 'lifestyle', name: 'Lifestyle' },
  { id: 'services', name: 'Services' },
];

export function customerCategoryName(id: string, fallback: string): string {
  return CUSTOMER_CATEGORIES.find(category => category.id === id)?.name || fallback;
}
