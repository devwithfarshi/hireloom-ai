import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Role } from '../types';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role');

  const handleRoleSelect = (selectedRole: Role.RECRUITER | Role.CANDIDATE) => {
    navigate(`/register?role=${selectedRole}`);
  };

  return (
    <AuthLayout>
      {!role ? (
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Choose Account Type</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Select the type of account you want to create
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => handleRoleSelect(Role.RECRUITER)}>
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Recruiter</h2>
                <p className="text-sm text-gray-500">Create job postings and manage candidates</p>
                <Button className="w-full">Select Recruiter</Button>
              </div>
            </Card>
            <Card className="p-6 cursor-pointer hover:border-primary transition-colors" onClick={() => handleRoleSelect(Role.CANDIDATE)}>
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Candidate</h2>
                <p className="text-sm text-gray-500">Apply for jobs and track applications</p>
                <Button className="w-full">Select Candidate</Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <RegisterForm />
      )}
    </AuthLayout>
  );
}