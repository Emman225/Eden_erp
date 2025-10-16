import React from 'react';
import Card from '../shared/Card';

const NotificationPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Notifications & App Mobile</h2>
            <Card>
                <div className="p-8 text-center text-gray-500">
                    <h3 className="text-lg font-medium text-gray-800">Module en construction</h3>
                    <p className="mt-2">La gestion des notifications et de l'application mobile sera bientôt disponible ici.</p>
                </div>
            </Card>
        </div>
    );
};

export default NotificationPage;