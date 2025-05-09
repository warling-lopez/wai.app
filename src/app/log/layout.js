export const metadata = {
    title: 'Iniciar sesión',
    description: 'Página de login para acceder a tu cuenta',
  };
  
  export default function LoginLayout({ children }) {
    return (
      <html lang="en">
        <body className="flex w-full items-center justify-center  bg-gray-100">
          <div className="w-full  p-6 bg-white shadow-md rounded-xl">
            {children}
          </div>
        </body>
      </html>
    );
  }
  