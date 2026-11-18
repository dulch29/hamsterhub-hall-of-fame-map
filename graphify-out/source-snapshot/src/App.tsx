import { generateMockKids, MOCK_PROVINCE_NAMES } from './mock/generate';
import { prepareKids } from './data/prepareKids';
import { useState } from 'react';
import { PinCard } from './ui/PinCard';
import './ui/PinCard.css';

const kids = prepareKids(generateMockKids());

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = kids.find((kid) => kid.id === selectedId);
  return (
    <main>
      <h1>Hamsterhub Hall of Fame</h1>
      <p>Development starter with {kids.length} fictional students.</p>
      <ul>
        {kids.map((kid) => (
          <li key={kid.id}>
            <strong>{kid.displayName}</strong> &mdash; {MOCK_PROVINCE_NAMES[kid.province] ?? kid.province}
            <p>{kid.featuredProject?.title ?? 'No featured project yet'}</p>
            <button className="student-open" type="button" aria-haspopup="dialog" onClick={() => setSelectedId(kid.id)}>
              Explore {kid.displayName}
            </button>
          </li>
        ))}
      </ul>
      <p>The 3D map and member login are planned for later milestones.</p>
      {selected && <PinCard key={selected.id} kid={selected} onClose={() => setSelectedId(null)} />}
    </main>
  );
}
