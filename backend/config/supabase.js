import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

// backend/config/ -> .env está en backend/
dotenv.config({ path: `${__dirname}/../.env` });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
}

// Node 20 puede no traer soporte WebSocket nativo para realtime.
// Para evitar que falle el arranque, desactivamos realtime a nivel de WebSocket.
// Usamos el objeto `realtime` con la opción `websocket: null`.
export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    enabled: false,
    websocket: null,
    // Solución para Node 20 sin WebSocket nativo.
    // Aunque desactivemos realtime, Supabase crea el cliente realtime.
    // Proporcionamos transport para evitar el error de arranque.
    transport: ws,
  },
});





