'use client';

import { useService } from '@redtea/react-inversify';
import { use } from 'react';

import { useIOC } from '@/core/ioc/use-ioc.hook';
import { sipsModule } from '@/core/sips/sips.module';
import { SipsStore } from '@/core/sips/sips.store';

export default function SipsPage() {
  useIOC(sipsModule);
  const sipsStore = useService(SipsStore);

  use(sipsStore.init());

  return (
    <div className='p-4 h-screen'>
      <table>
        <thead className='text-left'>
          <tr>
            <th className='w-1/3'>Name</th>
            <th>APR</th>
          </tr>
        </thead>
        <tbody>
          {sipsStore.sips.map((sip, idx) => (
            <tr key={idx}>
              <td>{sip.name}</td>
              <td>{sip.apr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
