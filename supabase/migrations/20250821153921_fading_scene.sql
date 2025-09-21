/*
  # API Keys Storage

  1. New Tables
    - `api_keys`
      - `id` (uuid, primary key)
      - `service` (text, unique) - service name like 'coingecko', 'cryptonews'
      - `encrypted_key` (text) - encrypted API key
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `api_keys` table
    - Add policy for service role access only
    - Keys are encrypted before storage

  3. Notes
    - Only service role can access API keys for security
    - Client-side code will call edge functions to use these keys
    - Keys are encrypted using Supabase's built-in encryption
*/

-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text UNIQUE NOT NULL,
  encrypted_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access only
CREATE POLICY "Service role can manage API keys"
  ON api_keys
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();