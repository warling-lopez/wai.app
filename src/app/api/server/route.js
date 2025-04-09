// app/api/server/route.js
export async function GET (request) {
    console.log('La API /api/server ha sido llamada');
    return new Response(JSON.stringify({ message: '¡Hola desde la API!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }