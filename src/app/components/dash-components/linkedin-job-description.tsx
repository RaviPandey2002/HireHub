"use client";

import { useMemo } from "react";
import {
  Briefcase,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  Check,
  Target,
  GraduationCap,
} from "lucide-react";
import { Badge } from "../ui/badge";

interface LinkedInJobDescriptionProps {
  description: string;
  skills?: string;
  type?: string;
  location?: string;
  experience?: string;
  companyName?: string;
}

export const LinkedInJobDescription = ({
  description,
  skills,
  type,
  location,
  experience,
  companyName,
}: LinkedInJobDescriptionProps) => {
  const skillsList = useMemo(() => {
    return (skills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [skills]);

  // Parse description text into structured sections and bullet points
  const parsedSections = useMemo(() => {
    if (!description) return [];

    const lines = description.split("\n");
    const sections: { title?: string; items: { type: "paragraph" | "bullet"; text: string }[] }[] = [];
    let currentSection: { title?: string; items: { type: "paragraph" | "bullet"; text: string }[] } = {
      items: [],
    };

    const cleanHeadingText = (line: string) => {
      return line
        .replace(/^#+\s*/, "")
        .replace(/^\*+|\*+$/g, "")
        .replace(/^_+|_+$/g, "")
        .trim();
    };

    const isHeaderLine = (line: string) => {
      const trimmed = line.trim();
      const clean = cleanHeadingText(trimmed);

      return (
        /^(about the role|about this role|about us|key responsibilities|responsibilities|qualifications|requirements|qualifications & requirements|skills & qualifications|what you'll do|what you will do|what we're looking for|what we are looking for|why join us|what we offer|who you are|the role|role overview|bonus points|preferred qualifications):?$/i.test(
          clean
        ) ||
        (clean.endsWith(":") && clean.length < 50 && !clean.startsWith("http"))
      );
    };

    const isBulletLine = (line: string) => {
      const trimmed = line.trim();
      return (
        trimmed.startsWith("•") ||
        trimmed.startsWith("- ") ||
        trimmed.startsWith("* ") ||
        trimmed.startsWith("– ") ||
        trimmed.startsWith("— ") ||
        /^\d+[\.\)]\s/.test(trimmed)
      );
    };

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      if (!line) return;

      if (isHeaderLine(line)) {
        if (currentSection.items.length > 0 || currentSection.title) {
          sections.push(currentSection);
        }
        const cleanTitle = cleanHeadingText(line).replace(/:$/, "").trim();
        currentSection = {
          title: cleanTitle,
          items: [],
        };
      } else if (isBulletLine(line)) {
        const cleanBulletText = line
          .replace(/^(?:[•\-\*–—]|\d+[\.\)])\s*/, "")
          .trim();
        currentSection.items.push({ type: "bullet", text: cleanBulletText });
      } else {
        currentSection.items.push({ type: "paragraph", text: line });
      }
    });

    if (currentSection.items.length > 0 || currentSection.title) {
      sections.push(currentSection);
    }

    return sections;
  }, [description]);

  return (
    <div className="space-y-6">
      {/* LinkedIn-style Key Highlights Snapshot Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Job Type
            </p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {type || "Full-Time"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Work Setup
            </p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {location || "Remote / Hybrid"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Experience
            </p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {experience ? `${experience} exp` : "Mid-Senior"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Turnaround
            </p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              24–48 Hours
            </p>
          </div>
        </div>
      </div>

      {/* Main Formatted Job Description */}
      <div className="space-y-6">
        {parsedSections.map((sec, secIdx) => {
          let headerIcon = <Target className="h-4 w-4 text-emerald-600" />;
          if (/responsibilit|what you('ll| will) do/i.test(sec.title || "")) {
            headerIcon = <CheckCircle2 className="h-4 w-4 text-blue-600" />;
          } else if (/qualification|requirement|who you are|bonus points|preferred/i.test(sec.title || "")) {
            headerIcon = <GraduationCap className="h-4 w-4 text-indigo-600" />;
          } else if (/about|overview|why join|what we offer/i.test(sec.title || "")) {
            headerIcon = <Building2 className="h-4 w-4 text-emerald-600" />;
          }

          return (
            <div key={secIdx} className="space-y-2.5">
              {sec.title && (
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/80">
                  {headerIcon}
                  <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {sec.title}
                  </h4>
                </div>
              )}

              <div className="space-y-2">
                {sec.items.map((item, itemIdx) => {
                  if (item.type === "bullet") {
                    return (
                      <div
                        key={itemIdx}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mt-0.5">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span>{item.text}</span>
                      </div>
                    );
                  }

                  return (
                    <p
                      key={itemIdx}
                      className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skills Section */}
      {skillsList.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Skills Associated with this Role
          </h4>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

