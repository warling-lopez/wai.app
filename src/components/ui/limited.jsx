// components/WallyAlert.js
import { useState } from "react";

const WallyAlert = ({
  type = "limit",
  title = "Has superado el límite de mensajes de WALLY.",
  message = "Wally ha alcanzado su límite de respuestas por chat.",
  buttonText = "Actualizar Plan",
  onButtonClick = () => alert("Redirigir a página de suscripción"),
  onClose = null,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Configuraciones por tipo de alerta usando clases de Tailwind
  const alertTypes = {
    limit: {
      container: "bg-chart-5 text-sidebar-primary-foreground",
      button: "bg-sidebar-primary-foreground text-sidebar-primary hover:bg-muted",
    },
    error: {
      container: "bg-destructive text-primary-foreground",
      button: "bg-primary-foreground text-destructive hover:bg-muted",
    },
    warning: {
      container: "bg-chart-3 text-primary-foreground",
      button: "bg-primary-foreground text-chart-3 hover:bg-muted",
    },
    info: {
      container: "bg-chart-5 text-primary-foreground",
      button: "bg-primary-foreground text-chart-5 hover:bg-muted",
    },
    success: {
      container: "bg-chart-2 text-primary-foreground",
      button: "bg-primary-foreground text-chart-2 hover:bg-muted",
    },
  };

  const currentStyle = alertTypes[type] || alertTypes.limit;

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="w-full flex justify-end font-sans">
      <div
        className={`
        ${currentStyle.container}
        p-4 px-5 
        flex flex-row justify-between items-center
        shadow-lg rounded-lg
        transition-all duration-200
      `}
      >
        {/* Contenido del mensaje */}
        <div className="flex-1 mr-5">
          <div className="font-semibold text-sm mb-1">{title}</div>
          <div className="text-sm opacity-90 leading-relaxed">{message}</div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          {/* Botón principal */}
          <button
            className={`
              ${currentStyle.button}
              border-none px-5 py-2.5 rounded-full
              text-sm font-medium cursor-pointer
              transition-all duration-100 ease-in-out
              focus:outline-none focus:chart-1 focus:chart-1 focus:ring-opacity-800
            `}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>

          {/* Botón cerrar */}
          {showCloseButton && (
            <button
              className="
                bg-transparent border-none text-current text-lg
                cursor-pointer p-2 rounded opacity-70
                hover:opacity-800 transition-opacity duration-100
                focus:outline-none focus:chart-1 focus:ring-white focus:ring-opacity-800
                flex items-center justify-center
              "
              onClick={handleClose}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallyAlert;

// Hook personalizado para manejar alertas (opcional)
export const useWallyAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (config) => {
    setAlert({
      id: Date.now(),
      ...config,
    });
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const showLimitAlert = (customMessage) => {
    showAlert({
      type: "limit",
      title: "Límite alcanzado",
      message: customMessage || "Has alcanzado el límite de mensajes de Wally.",
    });
  };

  const showErrorAlert = (customMessage) => {
    showAlert({
      type: "error",
      title: "Error",
      message: customMessage || "Ocurrió un error inesperado.",
    });
  };

  const showSuccessAlert = (customMessage) => {
    showAlert({
      type: "success",
      title: "Éxito",
      message: customMessage || "Operación completada correctamente.",
    });
  };

  const showWarningAlert = (customMessage) => {
    showAlert({
      type: "warning",
      title: "Advertencia",
      message: customMessage || "Ten cuidado con esta acción.",
    });
  };

  const showInfoAlert = (customMessage) => {
    showAlert({
      type: "info",
      title: "Información",
      message: customMessage || "Información importante.",
    });
  };

  return {
    alert,
    showAlert,
    hideAlert,
    showLimitAlert,
    showErrorAlert,
    showSuccessAlert,
    showWarningAlert,
    showInfoAlert,
  };
};

// Ejemplos de uso:

/*
// 1. Uso básico del componente
import WallyAlert from '@/components/WallyAlert';

export default function ChatPage() {
  return (
    <div className="p-4">
      <WallyAlert 
        type="limit"

        onButtonClick={() => router.push('/upgrade')}
      />
    </div>
  );
}

// 2. Uso con el hook personalizado
import WallyAlert, { useWallyAlert } from '@/components/WallyAlert';

export default function ChatPage() {
  const { alert, showLimitAlert, showErrorAlert, hideAlert } = useWallyAlert();

  const handleSendMessage = async () => {
    try {
      // Lógica de envío de mensaje
      const response = await sendMessage();
      
      if (response.limitReached) {
        showLimitAlert('Has alcanzado tu límite diario de mensajes.');
      }
    } catch (error) {
      showErrorAlert('No se pudo enviar el mensaje. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {alert && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <WallyAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={hideAlert}
            onButtonClick={() => {
              // Acciones específicas por tipo
              if (alert.type === 'limit') {
                router.push('/upgrade');
              } else if (alert.type === 'error') {
                handleSendMessage();
              }
              hideAlert();
            }}
          />
        </div>
      )}

      <div className="p-6">
        <button 
          onClick={() => showLimitAlert()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Mostrar Alerta de Límite
        </button>
        
        <button 
          onClick={() => showErrorAlert()}
          className="bg-red-500 text-white px-4 py-2 rounded ml-2"
        >
          Mostrar Alerta de Error
        </button>
      </div>
    </div>
  );
}

// 3. Uso con posicionamiento fijo (recomendado)
export default function Layout({ children }) {
  return (
    <div className="relative">
      {/* Alerta fija en la parte superior *-/}
      <div className="fixed top-0 left-0 right-0 z-50">
        <WallyAlert type="warning" title="Mantenimiento programado" />
      </div>
      
      <main className="pt-20"> {/* Espacio para la alerta fija *-/}
        {children}
      </main>
    </div>
  );
}
*/
