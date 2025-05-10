export const metadata = {
  title: "Iniciar sesión",
  description: "Página de login para acceder a tu cuenta",
};

export default function LoginLayout({ children }) {
  return (
    <div className="w-full  p-6 bg-white shadow-md rounded-xl">{children}</div>
  );
}
