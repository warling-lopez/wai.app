"use server";
interface AuthFormProps {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
  }
  
const AuthForm = ({ children, onSubmit }: AuthFormProps) => {
return (
    <form onSubmit={onSubmit} className="space-y-4">
    {children}
    </form>
);
};

export default AuthForm;