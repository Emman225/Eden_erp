
import React, { useState } from 'react';
import Card from '../shared/Card';
import Input from '../shared/forms/Input';
import Button from '../shared/Button';
import { ChurchIcon } from '../icons/Icon';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    onLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md px-4">
          <div className="flex justify-center mb-6">
             <div className="flex items-center">
                <ChurchIcon className="h-10 w-10 text-blue-600" />
                <span className="ml-3 text-3xl font-bold text-gray-800">Eglise-Tech</span>
             </div>
          </div>
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Connexion</h2>
          <p className="text-center text-gray-500 mb-6">Accédez à votre tableau de bord</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Numéro de téléphone ou Email"
              name="emailOrPhone"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="votre@email.com"
              required
            />
            <Input
              label="Mot de passe"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
            <div>
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Se connecter
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;