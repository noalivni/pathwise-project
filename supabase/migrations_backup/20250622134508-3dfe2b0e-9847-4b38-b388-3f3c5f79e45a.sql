
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role
FROM auth.users
WHERE email = 'livninoa@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin'::user_role;
