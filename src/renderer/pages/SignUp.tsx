import { FC, useEffect, useState } from 'react';
import { PuffLoader } from 'react-spinners';
import { XCircle, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';
import { server } from '../axios';

type Form = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp: FC = () => {
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [form, setForm] = useState<Form>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = form;
    const errors: string[] = [];
    setIsLoading(true);

    // check username for spaces
    if (username.includes(' ')) {
      errors.push('Username cannot contain spaces');
    }

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.includes(' ')) {
      errors.push('Password cannot contain spaces');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    // check email for validity
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email');
    }

    if (formErrors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const { data } = await server.post('/api/signup', { ...form });
    setIsLoading(false);

    if (data && data.status === 'ok') {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const handleFormChange = (formProp: keyof Form) => (e: any) => {
    setForm((prev) => ({ ...prev, [formProp]: e.target.value }));
  };

  useEffect(() => {
    if (formErrors.length > 0) {
      setIsLoading(false);
    }
  }, [formErrors]);

  return (
    <div style={{ height: 'calc(100vh - 28px)' }}>
      <div className="flex justify-center items-center">
        <div className="w-1/2 px-8 py-4 mt-48 rounded-xl border-[2px] border-red-700 bg-red-800">
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Username"
                type="text"
                onChange={handleFormChange('username')}
              />
              <Input
                placeholder="Email"
                type="text"
                onChange={handleFormChange('email')}
              />
              <Input
                placeholder="Password"
                type="password"
                onChange={handleFormChange('password')}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                onChange={handleFormChange('confirmPassword')}
              />
            </div>
            {formErrors.length > 0 && (
              <div className="flex flex-col mt-2 rounded-md p-4">
                {formErrors.map((error, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-2 text-[#ff8a8a]"
                  >
                    <XCircle width={12} />
                    <span className="text-sm text-[#ff8a8a]">{error}</span>
                  </div>
                ))}
              </div>
            )}
            <Button className="mt-4 py-3" disabled={isLoading} type="submit">
              Sign Up
            </Button>
          </form>
          <div className="mt-2">
            <Link to="/">
              <span className="text-sm text-white hover:underline">
                Back to login
              </span>
            </Link>
          </div>
          {success && (
            <div className="flex flex-row items-center bg-[#68874d] p-4 rounded-md mt-4">
              <UserCheck width={16} className="mr-2 text-white" />
              <span className="text-sm text-white">
                Account created successfully! You will be redirected to the
                login page shortly.
              </span>
            </div>
          )}
          {isLoading && (
            <div className="w-full flex justify-center mt-4">
              <PuffLoader color="red" size={80} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SignUp };
