# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please do the following:

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [INSERT EMAIL ADDRESS].

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information (as much as you can provide) to help us better understand the nature and scope of the possible issue:

* Type of issue (e.g. SQL injection, XSS, authentication bypass, etc.)
* Full paths of source file(s) related to the manifestation of the issue
* The location of the affected source code (tag/branch/commit or direct URL)
* Any special configuration required to reproduce the issue
* Step-by-step instructions to reproduce the issue
* Proof-of-concept or exploit code (if possible)
* Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer all communications to be in English.

## Policy

We follow the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## Security Update Process

1. Vulnerability is reported
2. Maintainers investigate and confirm the issue
3. A fix is developed in a private branch
4. A security advisory is drafted
5. The fix is released and the advisory is published
6. Reporter is credited (if desired)

## Known Security Features

- Input sanitization on all endpoints
- Rate limiting (20 requests/minute)
- Environment variable protection
- SQL injection prevention via Supabase
- CORS configuration
- Row-level security in database

## Security Best Practices for Users

1. **Never commit `.env` files** to version control
2. **Rotate API keys regularly** (every 90 days recommended)
3. **Use environment variables** for all sensitive data
4. **Enable HTTPS** in production deployments
5. **Configure CORS** to only allow trusted origins
6. **Monitor logs** for suspicious activity
7. **Keep dependencies updated** regularly

## Third-Party Security

This project uses several third-party services:

- **Supabase**: [Security Policy](https://supabase.com/security)
- **Google Gemini**: [Security & Privacy](https://ai.google.dev/gemini-api/docs/safety-guidance)
- **Vercel**: [Security](https://vercel.com/security)
- **Render**: [Security](https://render.com/security)

Please review their security policies as well.

## Security Acknowledgements

We would like to thank the following individuals for responsibly disclosing security issues:

* (None yet - be the first!)

---

Thank you for helping keep EcoCode and its users safe! 🔒
