'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Notice {
  _id: string;
  type: 'image' | 'text' | 'card';
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
}

const categoryColors: Record<string, string> = {
  Admission: 'bg-green-50 text-green-700',
  Seminar: 'bg-purple-50 text-purple-700',
  Achievement: 'bg-amber-50 text-amber-700',
  Research: 'bg-blue-50 text-blue-700',
  Notice: 'bg-red-50 text-red-700',
  Workshop: 'bg-teal-50 text-teal-700',
  Event: 'bg-indigo-50 text-indigo-700',
};

function formatDisplayDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function CardNotice({ notice }: { notice: Notice }) {
  return (
    <article className="group flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        {notice.category ? (
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', categoryColors[notice.category] ?? 'bg-gray-50 text-gray-700')}>
            {notice.category}
          </span>
        ) : (
          <span />
        )}
        <time className="text-xs text-gray-400">{formatDisplayDate(notice.date)}</time>
      </div>
      <h3 className="mt-4 font-serif text-base font-bold leading-snug text-oxford-blue group-hover:text-oxford-blue-light">
        {notice.title}
      </h3>
      {notice.content && (
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{notice.content}</p>
      )}
    </article>
  );
}

function TextNotice({ notice }: { notice: Notice }) {
  return (
    <article className="flex flex-col rounded-xl border-l-4 border-oxford-gold bg-oxford-cream p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-oxford-blue text-oxford-gold">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-serif text-base font-bold text-oxford-blue leading-snug">{notice.title}</h3>
            <time className="text-xs text-gray-500 shrink-0">{formatDisplayDate(notice.date)}</time>
          </div>
          {notice.content && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{notice.content}</p>
          )}
        </div>
      </div>
    </article>
  );
}

function ImageNotice({ notice }: { notice: Notice }) {
  return (
    <article className="group col-span-1 md:col-span-2 lg:col-span-3 flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="relative w-full overflow-hidden bg-gray-100" style={{ maxHeight: '400px' }}>
        <img
          src={notice.imageUrl}
          alt={notice.title}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ maxHeight: '400px' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg font-bold text-oxford-blue">{notice.title}</h3>
          <time className="text-xs text-gray-400 shrink-0 ml-4">{formatDisplayDate(notice.date)}</time>
        </div>
        {notice.content && (
          <p className="text-sm text-gray-500 leading-relaxed">{notice.content}</p>
        )}
      </div>
    </article>
  );
}

export default function NoticesSection() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notices')
      .then((r) => r.json())
      .then((data) => setNotices(data.notices || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="notices" className="bg-oxford-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-oxford-gold">
            Notices
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-oxford-blue sm:text-4xl">
            Notice Board
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-oxford-gold" />
          <p className="mt-4 text-gray-600">
            Stay updated with the latest announcements, events, and notices from our department.
          </p>
        </div>

        {/* Notices */}
        <div className="mt-14">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-oxford-blue border-t-transparent" />
            </div>
          ) : notices.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p className="text-sm">No notices published yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notices.map((notice) => {
                if (notice.type === 'image') return <ImageNotice key={notice._id} notice={notice} />;
                if (notice.type === 'text') return <TextNotice key={notice._id} notice={notice} />;
                return <CardNotice key={notice._id} notice={notice} />;
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
