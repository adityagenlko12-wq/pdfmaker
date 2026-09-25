import React from 'react';
import { UserCheck, LogOut } from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function ImpersonationBanner() {
  const { user, isImpersonating, stopImpersonating } = useSite();

  if (!isImpersonating || !user) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-2.5 shadow-lg sticky top-0 z-50 flex items-center justify-between text-xs sm:text-sm font-medium">
      <div className="flex items-center gap-2 max-w-xl truncate">
        <UserCheck className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" />
        <span>
          <strong>Admin Impersonation Mode:</strong> Currently acting as{' '}
          <span className="font-bold underline">{user.name}</span> ({user.email}) [Plan: {user.planId}]
        </span>
      </div>

      <button
        onClick={stopImpersonating}
        className="px-3 py-1 bg-white text-gray-900 hover:bg-amber-50 font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-2"
      >
        <LogOut className="w-3.5 h-3.5 text-amber-700" />
        <span>Exit Session</span>
      </button>
    </div>
  );
}
