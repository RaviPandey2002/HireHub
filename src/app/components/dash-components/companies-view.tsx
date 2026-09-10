"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  MapPin,
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { CompanySummary } from "types";

interface Company {
  companyName: string;
  location: string;
  jobCount: number;
}
export type Company = CompanySummary;

interface CompaniesViewProps {
  companies: Company[];
  companies: CompanySummary[];
}

function getCompanyMonogram(name: string) {
  return (name || "C")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Consistent colorful gradient per company name
const gradients = [
  "from-emerald-600 to-teal-700",
  "from-blue-600 to-indigo-700",
  "from-purple-600 to-violet-700",
  "from-amber-600 to-orange-700",
  "from-rose-600 to-pink-700",
  "from-cyan-600 to-blue-700",
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export const CompaniesView = ({ companies }: CompaniesViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Derive distinct locations
  const locations = useMemo(() => {
    const locs = new Set<string>();
    companies.forEach((c) => {
      if (c.location) {
        // Simplify location or keep as-is
        locs.add(c.location.trim());
      }
    });
    return Array.from(locs).slice(0, 8);
  }, [companies]);

  const totalOpenRoles = useMemo(() => {
    return companies.reduce((acc, c) => acc + (c.jobCount || 0), 0);
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !selectedLocation || c.location.toLowerCase() === selectedLocation.toLowerCase();

      return matchesSearch && matchesLocation;
    });
  }, [companies, searchQuery, selectedLocation]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. HERO HEADER                                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-purple-50/70 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Companies Hiring on HireHub
              </h1>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-semibold"
              >
                {companies.length} Organizations
              </Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore leading technical organizations, discover their engineering hubs, and connect with active open roles across top tech stacks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xs text-center min-w-[130px]">
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {totalOpenRoles}
              </p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Live Positions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. SEARCH & LOCATION FILTER TOOLBAR                         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search by company name or location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing{" "}
            <strong className="text-slate-800 dark:text-slate-200 font-bold">
              {filteredCompanies.length}
            </strong>{" "}
            of {companies.length} companies
          </p>
        </div>

        {/* Location Filter Pills */}
        {locations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Locations:
            </span>
            <button
              onClick={() => setSelectedLocation(null)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedLocation === null
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Locations
            </button>
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedLocation === loc
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. COMPANIES GRID                                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      {filteredCompanies.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No matching companies found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              We couldn&apos;t find any hiring companies matching &ldquo;{searchQuery || selectedLocation}&rdquo;.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedLocation(null);
            }}
            className="text-xs font-semibold"
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompanies.map((company) => {
            const monogram = getCompanyMonogram(company.companyName);
            const gradientClass = getGradient(company.companyName);

            return (
              <div
                key={company.companyName}
                className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-2xs gap-5"
              >
                <div className="space-y-4">
                  {/* Top Row: Monogram + Name + Active Hiring Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientClass} text-white font-extrabold text-base shadow-sm group-hover:scale-105 transition-transform`}
                      >
                        {monogram}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors truncate">
                          {company.companyName}
                        </h3>
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                          <span className="truncate">{company.location}</span>
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Hiring
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    Actively seeking engineering talent for technical teams located in {company.location}.
                  </p>
                </div>

                {/* Bottom Row: Role Count + Action CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    {company.jobCount} open {company.jobCount === 1 ? "role" : "roles"}
                  </Badge>

                  <Link
                    href={`/jobs?company=${encodeURIComponent(company.companyName)}`}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    Explore Jobs <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
