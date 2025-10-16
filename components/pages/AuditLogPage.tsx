
import React from 'react';
import { AuditLog } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';

const AuditLogPage: React.FC = () => {
    const logs: AuditLog[] = dataService.getAuditLogs();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Journal des Actions Critiques</h2>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date & Heure</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Utilisateur</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Objet Concerné</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userName} ({log.user_id})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.objet} ({log.objet_id})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AuditLogPage;