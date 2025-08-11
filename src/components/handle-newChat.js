import { Supabase } from "@/Supabase/Supabase";
import Swal from "sweetalert2";
async function handleNewChat() {
  const {
    data: { user },
    error: userError,
  } = await Supabase.auth.getUser();

  try {
    if (user) {
      Swal.fire({
        title: "Agrega un chat",
        input: "text",
        inputPlaceholder: "Escribe el título aquí...",
        allowOutsideClick: false, // Evita cerrar al hacer clic fuera
        inputAttributes: {
          maxlength: 15,
        },
        customClass: { // Clases para sweetalert (estan en componentes/css/custom-sweetalert.css)
          popup: "swal-popup",
          title: "swal-title",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
        },
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Crear",
        inputValidator: (value) => {
          if (!value) {
            return "Debes ingresar un título";
          }
          return null;
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const titulo_chat = result.value;

          const { data: chatData, error } = await Supabase
            .from("Chats")
            .insert([
              {
                user_id: user.id,
                title: titulo_chat || "Nuevo Chat",
              },
            ]);

          if (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `No se pudo crear el chat: ${error.message}`,
            });
          } else {
            console.log("Chat creado:", chatData);
          }
        }
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `No se pudo crear el chat: ${error.message}`,
    });
    console.error("Error al crear el chat:", error);
  }
}

export default handleNewChat;