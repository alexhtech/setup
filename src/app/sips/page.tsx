'use client';

import { useService } from '@redtea/react-inversify';

import { ApiService } from '@/core/api/api.service';
import { GetSips } from '@/core/api/gql/sip/get-sips.gql.generated';

export default function SipsPage() {
  const apiService = useService(ApiService);
  const sips = apiService.querySuspense(GetSips);

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
          {sips.getSips.map((sip, idx) => (
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
