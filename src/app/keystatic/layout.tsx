import type { ReactNode } from 'react';
import PainelTema from './PainelTema';

export const metadata = {
  title: 'Sala de Costura — Dalila Teles Veras',
};

export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PainelTema />
      {children}
    </>
  );
}
