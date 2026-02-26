"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
require("dotenv/config");
// Em um ambiente de produção real, é crucial que existam tanto a URL quanto a Service Role Key 
// (ou ANON Key, no caso de usarmos tokens gerados do lado cliente).
// Para o backend enviando o arquivo, usamos Service Role ou Anon dependendo da política.
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
// Exportar cliente (só instanciado se houver as chaves)
exports.supabase = supabaseUrl && supabaseKey ? (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey) : null;
