-- Add missing default triggers (Crunching and Whispering) to match constants.js
INSERT INTO triggers (name, is_custom, user_id) VALUES
  ('Crunching', false, NULL),
  ('Whispering', false, NULL)
ON CONFLICT DO NOTHING;
