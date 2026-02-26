import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Em um ambiente de produção real, é crucial que existam tanto a URL quanto a Service Role Key 
// (ou ANON Key, no caso de usarmos tokens gerados do lado cliente).
// Para o backend enviando o arquivo, usamos Service Role ou Anon dependendo da política.
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Exportar cliente (só instanciado se houver as chaves)
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
