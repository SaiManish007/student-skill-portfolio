import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="mt-4 h-8 w-16 bg-slate-200 rounded"></div>
      <div className="mt-2 h-3 w-32 bg-slate-100 rounded"></div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-slate-200 rounded-xl shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-3 w-1/2 bg-slate-100 rounded"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full bg-slate-100 rounded"></div>
        <div className="h-3 w-4/5 bg-slate-100 rounded"></div>
      </div>
      <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="h-6 w-20 bg-slate-100 rounded-full"></div>
        <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
        <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
        <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-slate-100 flex gap-4 items-center">
          <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
          <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}
