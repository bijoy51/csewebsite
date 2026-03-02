import Link from 'next/link';
import { cn } from '@/lib/utils';

/* ==========================================================================
   Hero Section
   ========================================================================== */

function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-oxford-blue">
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-oxford-blue-dark via-oxford-blue to-oxford-blue-light" />

      {/* Decorative gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-oxford-gold to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-oxford-gold/30 bg-oxford-gold/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-oxford-gold animate-pulse" />
            <span className="text-sm font-medium text-oxford-gold">
              Admissions Open for 2025-2026
            </span>
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Department of{' '}
            <span className="text-oxford-gold">
              Computer Science &amp; Engineering
            </span>
          </h1>

          <p className="mt-4 font-serif text-xl text-white/80 sm:text-2xl">
            Islamic University, Kushtia
          </p>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            Empowering the next generation of technologists through rigorous
            academics, cutting-edge research, and a commitment to ethical
            innovation since 1995.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="#programs"
              className="inline-flex items-center gap-2 rounded-lg bg-oxford-gold px-6 py-3 text-sm font-semibold text-oxford-blue-dark shadow-lg transition-all hover:bg-oxford-gold/90 hover:shadow-xl sm:px-8 sm:py-3.5 sm:text-base"
            >
              Explore Programs
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <Link
              href="#about"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-white/25 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10 sm:px-8 sm:py-3.5 sm:text-base"
            >
              Learn More
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {[
              { value: '30+', label: 'Years of Excellence' },
              { value: '30+', label: 'Faculty Members' },
              { value: '1200+', label: 'Alumni Network' },
              { value: '15+', label: 'Research Labs' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl font-bold text-oxford-gold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-white/55 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative right-side element (hidden on mobile) */}
      <div className="absolute -right-32 top-1/2 hidden h-[500px] w-[500px] -translate-y-1/2 rounded-full border border-oxford-gold/10 lg:block" />
      <div className="absolute -right-16 top-1/2 hidden h-[350px] w-[350px] -translate-y-1/2 rounded-full border border-oxford-gold/5 lg:block" />
    </section>
  );
}

/* ==========================================================================
   About Section
   ========================================================================== */

function AboutSection() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oxford-gold">
            About Us
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-oxford-blue sm:text-4xl">
            Pioneering CSE Education Since 1995
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-oxford-gold" />
        </div>

        {/* Description */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="space-y-5 text-base leading-relaxed text-gray-600 sm:text-lg">
            <p>
              The Department of <strong className="text-oxford-blue">Computer Science and Engineering (CSE)</strong> at{' '}
              <strong className="text-oxford-blue">Islamic University</strong> is committed to excellence in{' '}
              <strong className="text-oxford-blue">education</strong>, <strong className="text-oxford-blue">research</strong>, and{' '}
              <strong className="text-oxford-blue">innovation</strong>. We provide our students with a strong foundation in{' '}
              <strong className="text-oxford-blue">computer science principles</strong> while encouraging practical experience through{' '}
              <strong className="text-oxford-blue">projects</strong>, <strong className="text-oxford-blue">internships</strong>, and{' '}
              <strong className="text-oxford-blue">research</strong>.
            </p>
            <p>
              Our faculty members are <strong className="text-oxford-blue">highly qualified</strong> and actively involved in{' '}
              <strong className="text-oxford-blue">cutting-edge research</strong> and{' '}
              <strong className="text-oxford-blue">industry collaborations</strong>. They guide students to develop{' '}
              <strong className="text-oxford-blue">critical thinking</strong>, <strong className="text-oxford-blue">problem-solving skills</strong>, and{' '}
              <strong className="text-oxford-blue">creativity</strong>, preparing them for careers in{' '}
              <strong className="text-oxford-blue">software development</strong>, <strong className="text-oxford-blue">artificial intelligence</strong>,{' '}
              <strong className="text-oxford-blue">cybersecurity</strong>, <strong className="text-oxford-blue">data science</strong>, and more.
            </p>
            <p>
              The department boasts modern <strong className="text-oxford-blue">laboratories</strong> and{' '}
              <strong className="text-oxford-blue">computing facilities</strong>, including labs for{' '}
              <strong className="text-oxford-blue">programming</strong>, <strong className="text-oxford-blue">networking</strong>,{' '}
              <strong className="text-oxford-blue">cybersecurity</strong>, <strong className="text-oxford-blue">AI and machine learning</strong>, and{' '}
              <strong className="text-oxford-blue">software development</strong>. These labs enable students to gain{' '}
              <strong className="text-oxford-blue">hands-on experience</strong> and engage in{' '}
              <strong className="text-oxford-blue">innovative projects</strong> that address real-world challenges.
            </p>
            <p>
              We actively promote <strong className="text-oxford-blue">research and innovation</strong>, with ongoing projects in areas such as{' '}
              <strong className="text-oxford-blue">AI</strong>, <strong className="text-oxford-blue">machine learning</strong>,{' '}
              <strong className="text-oxford-blue">cloud computing</strong>, <strong className="text-oxford-blue">IoT</strong>,{' '}
              <strong className="text-oxford-blue">robotics</strong>, and <strong className="text-oxford-blue">data analytics</strong>. Students are encouraged to participate in{' '}
              <strong className="text-oxford-blue">conferences</strong>, <strong className="text-oxford-blue">workshops</strong>,{' '}
              <strong className="text-oxford-blue">hackathons</strong>, and <strong className="text-oxford-blue">research initiatives</strong> to enhance their learning and career prospects.
            </p>
            <p>
              Through <strong className="text-oxford-blue">student clubs</strong>, <strong className="text-oxford-blue">seminars</strong>, and{' '}
              <strong className="text-oxford-blue">mentorship programs</strong>, we foster{' '}
              <strong className="text-oxford-blue">collaboration</strong>, <strong className="text-oxford-blue">leadership</strong>, and{' '}
              <strong className="text-oxford-blue">lifelong learning</strong>. Our graduates are well-prepared to excel in both{' '}
              <strong className="text-oxford-blue">academic</strong> and <strong className="text-oxford-blue">professional fields</strong>, contribute to{' '}
              <strong className="text-oxford-blue">technological advancement</strong>, and become{' '}
              <strong className="text-oxford-blue">responsible innovators</strong> in society.
            </p>
          </div>
        </div>

        {/* Mission / Vision / Values Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Mission */}
          <div className="group rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-oxford-gold/30 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue transition-colors group-hover:bg-oxford-blue group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-oxford-blue">
              Our Mission
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-600">
              <li>1. To provide students with a strong foundation in <strong className="text-oxford-blue">computer science and engineering</strong> principles.</li>
              <li>2. To promote <strong className="text-oxford-blue">research</strong>, <strong className="text-oxford-blue">innovation</strong>, and <strong className="text-oxford-blue">entrepreneurship</strong>.</li>
              <li>3. To prepare graduates for <strong className="text-oxford-blue">leadership roles</strong> in industry, academia, and society.</li>
              <li>4. To foster a culture of <strong className="text-oxford-blue">lifelong learning</strong> and <strong className="text-oxford-blue">professional development</strong>.</li>
            </ul>
          </div>

          {/* Vision */}
          <div className="group rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-oxford-gold/30 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue transition-colors group-hover:bg-oxford-blue group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-oxford-blue">
              Our Vision
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              To be a center of excellence in <strong className="text-oxford-blue">computer science education</strong>,{' '}
              <strong className="text-oxford-blue">research</strong>, and <strong className="text-oxford-blue">innovation</strong>.
            </p>
          </div>

          {/* Values */}
          <div className="group rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:border-oxford-gold/30 hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue transition-colors group-hover:bg-oxford-blue group-hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-oxford-blue">
              Our Values
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Academic integrity, inclusive learning, collaborative research, and
              community engagement form the pillars of our department. We
              nurture an environment where intellectual curiosity thrives and
              every student can reach their full potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Programs Section
   ========================================================================== */

const programs = [
  {
    degree: 'B.Sc. in CSE',
    duration: '4 Years (8 Semesters)',
    credits: '160 Credits',
    description:
      'A comprehensive undergraduate program covering core areas of computer science including algorithms, data structures, software engineering, networking, artificial intelligence, and database systems. Students gain hands-on experience through labs, projects, and an industry internship.',
    highlights: [
      'Industry-aligned curriculum',
      'Mandatory internship program',
      'Final year thesis/project',
      'Well-equipped computer labs',
    ],
  },
  {
    degree: 'M.Sc. in CSE',
    duration: '1 Year (2 Semesters)',
    credits: '36 Credits',
    description:
      'An advanced program designed for graduates seeking deeper expertise in specialized areas of computer science. Students engage in coursework and a research thesis under faculty supervision, exploring topics like machine learning, cybersecurity, and distributed systems.',
    highlights: [
      'Research-focused curriculum',
      'Faculty-supervised thesis',
      'Seminar presentations',
      'Access to research labs',
    ],
  },
  {
    degree: 'Ph.D. in CSE',
    duration: '3-5 Years',
    credits: 'Research-Based',
    description:
      'A doctoral program for scholars committed to advancing the frontiers of computer science through original research. Ph.D. candidates work closely with their supervisors on nationally and internationally relevant research problems, publishing in reputed journals and conferences.',
    highlights: [
      'Original research contribution',
      'International collaboration',
      'Conference participation',
      'Teaching assistantship',
    ],
  },
];

function ProgramsSection() {
  return (
    <section id="programs" className="bg-oxford-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oxford-gold">
            Academic Programs
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-oxford-blue sm:text-4xl">
            Programs We Offer
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-oxford-gold" />
          <p className="mt-4 text-gray-600">
            Choose from our undergraduate, graduate, and doctoral programs
            designed to build strong foundations and advanced expertise.
          </p>
        </div>

        {/* Program Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {programs.map((program) => (
            <article
              key={program.degree}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg"
            >
              {/* Card Header */}
              <div className="bg-oxford-blue p-6 transition-colors group-hover:bg-oxford-blue-light">
                <h3 className="font-serif text-xl font-bold text-white">
                  {program.degree}
                </h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    {program.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                    {program.credits}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-relaxed text-gray-600">
                  {program.description}
                </p>

                {/* Highlights */}
                <ul className="mt-5 space-y-2">
                  {program.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 shrink-0 text-oxford-gold"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-oxford-blue transition-colors hover:text-oxford-gold"
                  >
                    Learn More
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Faculty Section
   ========================================================================== */

const chairman = {
  name: 'Dr. Md. Shohidul Islam',
  designation: 'Professor & Chairman',
};

const facultyMembers = [
  { name: 'Dr. Md. Farukuzzaman Khan', designation: 'Professor' },
  { name: 'Dr. Ahsan-Ul-Ambia', designation: 'Professor' },
  { name: 'Md. Ibrahim Abdullah', designation: 'Professor' },
  { name: 'Sujit Kumar Mondal', designation: 'Professor' },
  { name: 'Md. Aktaruzzaman', designation: 'Professor' },
  { name: 'Dr. Md. Robiul Hoque', designation: 'Professor' },
  { name: 'Dr. M. Muntasir Rahman', designation: 'Professor' },
  { name: 'Md. Nazrul Islam', designation: 'Professor' },
  { name: 'Dr. Md. Mojahidul Islam', designation: 'Professor' },
  { name: 'A.O.M Asaduzzaman', designation: 'Professor' },
  { name: 'Dr. Joyassree Sen', designation: 'Professor' },
  { name: 'Dr. Md. Habibur Rahman', designation: 'Professor' },
  { name: 'Dr. Md. Shamim Hossain', designation: 'Associate Professor' },
  { name: 'Mohammad Alamgir Hossain', designation: 'Associate Professor' },
  { name: 'Md. Atiqur Rahman', designation: 'Associate Professor' },
  { name: 'Bappa Sarkar', designation: 'Associate Professor' },
];

function FacultySection() {
  return (
    <section id="faculty" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oxford-gold">
            Our Faculty
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-oxford-blue sm:text-4xl">
            Meet Our Faculty Members
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-oxford-gold" />
          <p className="mt-4 text-gray-600">
            Our distinguished faculty of {facultyMembers.length + 1} members brings together
            expertise in diverse areas of computer science and engineering.
          </p>
        </div>

        {/* Chairman — Featured Card */}
        <div className="mx-auto mt-14 max-w-md">
          <article className="group overflow-hidden rounded-2xl border-2 border-oxford-gold/30 bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-3 border-oxford-gold/50 bg-white/15 font-serif text-3xl font-bold text-white shadow-lg">
                {chairman.name
                  .split(' ')
                  .filter((n) => n.length > 2)
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')}
              </div>
            </div>
            <div className="p-6 text-center">
              <span className="inline-block rounded-full bg-oxford-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-oxford-gold">
                Chairman
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-oxford-blue">
                {chairman.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-oxford-gold">
                {chairman.designation}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Department of Computer Science &amp; Engineering
              </p>
            </div>
          </article>
        </div>

        {/* Faculty Grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {facultyMembers.map((member) => (
            <article
              key={member.name}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-oxford-blue to-oxford-blue-light">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-oxford-gold/30 bg-white/10 font-serif text-xl font-bold text-white">
                  {member.name
                    .split(' ')
                    .filter((n) => n.length > 2)
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-serif text-sm font-bold text-oxford-blue">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-oxford-gold">
                  {member.designation}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   News & Events Section
   ========================================================================== */

const newsItems = [
  {
    date: 'Feb 20, 2026',
    category: 'Admission',
    title: 'Spring 2026 Admission Open for B.Sc. in CSE',
    excerpt:
      'Applications are now being accepted for the Spring 2026 semester. Eligible HSC graduates with a strong background in science may apply online or visit the department office.',
  },
  {
    date: 'Feb 10, 2026',
    category: 'Seminar',
    title: 'Guest Lecture on Generative AI and Its Applications',
    excerpt:
      'Professor Dr. Anisul Haque from BUET delivered an insightful seminar on the recent advances in generative AI and large language models, attended by over 200 students and faculty.',
  },
  {
    date: 'Jan 28, 2026',
    category: 'Achievement',
    title: 'IU CSE Team Wins Regional Programming Contest',
    excerpt:
      'Our undergraduate team secured 1st place at the Southwestern Regional ICPC Preliminary, qualifying for the national round. Congratulations to the team members and their coach.',
  },
  {
    date: 'Jan 15, 2026',
    category: 'Research',
    title: 'Faculty Paper Accepted at IEEE International Conference',
    excerpt:
      'A research paper by Dr. Farhana Akter on deep learning-based medical image segmentation has been accepted for presentation at the IEEE ICIP 2026 conference.',
  },
  {
    date: 'Dec 30, 2025',
    category: 'Notice',
    title: 'Updated Academic Calendar for 2026',
    excerpt:
      'The revised academic calendar for the year 2026 has been published. Students are advised to check the portal for class schedules, examination dates, and semester breaks.',
  },
  {
    date: 'Dec 18, 2025',
    category: 'Workshop',
    title: 'Two-Day Workshop on Cloud Computing and DevOps',
    excerpt:
      'The department organized a hands-on workshop covering AWS services, containerization with Docker, and CI/CD pipelines. Industry professionals from leading tech companies served as instructors.',
  },
];

const categoryColors: Record<string, string> = {
  Admission: 'bg-green-50 text-green-700',
  Seminar: 'bg-purple-50 text-purple-700',
  Achievement: 'bg-amber-50 text-amber-700',
  Research: 'bg-blue-50 text-blue-700',
  Notice: 'bg-red-50 text-red-700',
  Workshop: 'bg-teal-50 text-teal-700',
};

function NewsEventsSection() {
  return (
    <section id="news" className="bg-oxford-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oxford-gold">
            News &amp; Events
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-oxford-blue sm:text-4xl">
            Latest Announcements
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-oxford-gold" />
          <p className="mt-4 text-gray-600">
            Stay updated with the latest happenings, events, and achievements of
            our department.
          </p>
        </div>

        {/* News Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    categoryColors[item.category] ??
                      'bg-gray-50 text-gray-700'
                  )}
                >
                  {item.category}
                </span>
                <time className="text-xs text-gray-400">{item.date}</time>
              </div>

              <h3 className="mt-4 font-serif text-base font-bold leading-snug text-oxford-blue group-hover:text-oxford-blue-light">
                {item.title}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                {item.excerpt}
              </p>

              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-oxford-blue/70 transition-colors hover:text-oxford-gold"
              >
                Read More
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </article>
          ))}
        </div>

        {/* View All News */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-oxford-blue px-6 py-3 text-sm font-semibold text-oxford-blue transition-all hover:bg-oxford-blue hover:text-white"
          >
            View All News
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Contact Section
   ========================================================================== */

function ContactSection() {
  return (
    <section id="contact" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oxford-gold">
            Get in Touch
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-oxford-blue sm:text-4xl">
            Contact Us
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-oxford-gold" />
          <p className="mt-4 text-gray-600">
            Have questions about admissions, programs, or research
            collaborations? Reach out to us.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-8">
            {/* Address */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue">
                <svg
                  className="h-5 w-5"
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
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-oxford-blue">
                  Address
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Department of Computer Science &amp; Engineering
                  <br />
                  Islamic University
                  <br />
                  Kushtia-7003, Bangladesh
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue">
                <svg
                  className="h-5 w-5"
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
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-oxford-blue">
                  Phone
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  +880-71-74910-49 (Ext. 4152)
                </p>
                <p className="text-sm text-gray-600">
                  +880-71-74910-49 (Ext. 4153)
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue">
                <svg
                  className="h-5 w-5"
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
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-oxford-blue">
                  Email
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  <a
                    href="mailto:cse@iu.ac.bd"
                    className="transition-colors hover:text-oxford-blue"
                  >
                    cse@iu.ac.bd
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  <a
                    href="mailto:chairman.cse@iu.ac.bd"
                    className="transition-colors hover:text-oxford-blue"
                  >
                    chairman.cse@iu.ac.bd
                  </a>
                </p>
              </div>
            </div>

            {/* Office Hours */}
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-oxford-blue/5 text-oxford-blue">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-oxford-blue">
                  Office Hours
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Sunday - Thursday: 9:00 AM - 5:00 PM
                </p>
                <p className="text-sm text-gray-500">
                  Friday &amp; Saturday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Campus Map */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="relative h-full min-h-[400px]">
              <img
                src="/images/campus.jfif"
                alt="Islamic University Campus, Kushtia"
                className="h-full w-full object-cover"
                style={{ minHeight: '400px' }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="font-serif text-lg font-semibold text-white">
                  Islamic University Campus
                </p>
                <p className="mt-1 text-sm text-white/80">
                  Kushtia-Jhenaidah Highway, Kushtia, Bangladesh
                </p>
                <a
                  href="https://earth3dmap.com/#?l=islamic+university"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-oxford-blue px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-oxford-blue-light"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   Home Page (Composed)
   ========================================================================== */

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <FacultySection />
      <NewsEventsSection />
      <ContactSection />
    </>
  );
}
