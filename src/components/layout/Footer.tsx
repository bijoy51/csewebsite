import Link from 'next/link';

const quickLinks = [
  { label: 'About the Department', href: '#about' },
  { label: 'Academic Programs', href: '#programs' },
  { label: 'Faculty Members', href: '#faculty' },
  { label: 'Research', href: '#research' },
  { label: 'Admission', href: '#admission' },
  { label: 'Contact Us', href: '#contact' },
];

const resourceLinks = [
  { label: 'Student Portal', href: '/login?tab=student' },
  { label: 'Teacher Portal', href: '/login?tab=teacher' },
  { label: 'Academic Calendar', href: '#' },
  { label: 'Library', href: '#' },
  { label: 'Notices & Circulars', href: '#news' },
  { label: 'Downloads', href: '#' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-oxford-blue text-white" role="contentinfo">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Department Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-oxford-gold font-serif text-lg font-bold text-oxford-blue-dark">
                IU
              </div>
              <div>
                <p className="font-serif text-lg font-bold leading-tight text-white">
                  IU CSE
                </p>
                <p className="text-xs leading-tight text-oxford-gold">
                  Islamic University
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              The Department of Computer Science and Engineering at Islamic
              University, Kushtia, is committed to excellence in education,
              research, and innovation in computing and technology.
            </p>
            {/* Social placeholder */}
            <div className="mt-6 flex gap-3">
              {/* Facebook */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-oxford-gold hover:text-oxford-blue-dark"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-oxford-gold hover:text-oxford-blue-dark"
                aria-label="Twitter"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-oxford-gold hover:text-oxford-blue-dark"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-oxford-gold hover:text-oxford-blue-dark"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-base font-semibold text-oxford-gold">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-oxford-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-serif text-base font-semibold text-oxford-gold">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-oxford-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-base font-semibold text-oxford-gold">
              Contact Us
            </h3>
            <address className="mt-4 space-y-3 text-sm not-italic text-white/65">
              {/* Location */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-oxford-gold/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>
                  Department of CSE,
                  <br />
                  Islamic University,
                  <br />
                  Kushtia-7003, Bangladesh
                </span>
              </div>
              {/* Phone */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-oxford-gold/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <span>+880-71-74910-49 (Ext. 4152)</span>
              </div>
              {/* Email */}
              <div className="flex gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-oxford-gold/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <a
                  href="mailto:cse@iu.ac.bd"
                  className="transition-colors hover:text-oxford-gold"
                >
                  cse@iu.ac.bd
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-white/50">
              &copy; {currentYear} Department of Computer Science &amp;
              Engineering, Islamic University. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-xs text-white/50 transition-colors hover:text-oxford-gold"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-white/50 transition-colors hover:text-oxford-gold"
              >
                Terms of Use
              </a>
              <a
                href="https://iu.ac.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/50 transition-colors hover:text-oxford-gold"
              >
                IU Main Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
