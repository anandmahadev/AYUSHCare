import React from 'react';
import { Button } from './Button';

/**
 * Modern Practitioner Card displaying essential bio and specialities.
 */
export const PractitionerCard = ({ practitioner }) => {
  const { user, specialities, consultationFee, rating = 4.8 } = practitioner;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">
          ★ {rating}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-lg">
          {user.fullName.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
            {user.fullName}
          </h3>
          <p className="text-sm font-medium text-slate-500">
            {specialities[0]} Specialist
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {specialities.map((spec) => (
            <span key={spec} className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">Consultation</p>
          <p className="text-lg font-bold text-slate-900">₹{consultationFee}</p>
        </div>
        <Button variant="primary" size="sm" className="rounded-full shadow-md">
          Book Now
        </Button>
      </div>
    </div>
  );
};
