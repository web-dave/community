interface IUnit {
  id: string;
  reachable: boolean;
  condition: 'clean' | 'dirty' | 'dangerous';
  type: 'Office' | 'Attractions' | 'Flat' | 'Safety' | 'School' | 'Shopping';
}
