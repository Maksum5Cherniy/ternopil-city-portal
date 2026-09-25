-- Review before applying with the neondb_owner connection.
-- The deternopil_runtime login is created separately in Neon.
-- These grants cover the 14 tables used by the current application only.
-- No schema CREATE, table ownership, or default future-table rights are granted.

GRANT USAGE ON SCHEMA public TO deternopil_runtime;

GRANT SELECT, INSERT, UPDATE ON TABLE public.users TO deternopil_runtime;
GRANT SELECT, INSERT, DELETE ON TABLE public.auth_sessions TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.email_verification_tokens TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.password_reset_tokens TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.auth_rate_limits TO deternopil_runtime;

GRANT SELECT, INSERT, UPDATE ON TABLE public.listings TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.seller_profiles TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.owner_claims TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.reports TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.reviews TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.notifications TO deternopil_runtime;

GRANT SELECT, INSERT ON TABLE public.audit_logs TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_content_items TO deternopil_runtime;
GRANT SELECT, INSERT, UPDATE ON TABLE public.site_settings TO deternopil_runtime;
