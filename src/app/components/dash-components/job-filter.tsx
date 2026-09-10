'use client';

import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { filterMenuDataArray } from 'lib/utils';
import { JobOpening } from 'types';

interface JobFilterProps {
  allJobs: JobOpening[];
  jobList: JobOpening[];
  setJobList: (jobs: JobOpening[]) => void;
}

export function JobFilter({ allJobs, jobList: _jobList, setJobList }: JobFilterProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Generate options from allJobs dynamically
  const filterMenus = useMemo(() => {
    return filterMenuDataArray.map((item) => {
      const uniqueOptions = Array.from(
        new Set(
          (allJobs || [])
            .map((job) => job?.[item.id])
            .filter((val): val is string => typeof val === 'string' && val.trim().length > 0)
        )
      );
      return {
        id: item.id,
        name: item.label,
        options: uniqueOptions,
      };
    });
  }, [allJobs]);

  const activeFiltersCount = Object.keys(filters).length;

  const handleFilterChange = (key: string, value: string) => {
    if (!value || value === "__ALL__") {
      setFilters((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const applyFilters = () => {
    const activeEntries = Object.entries(filters).filter(([_, v]) => v && v !== "__ALL__");
    if (activeEntries.length === 0) {
      setJobList(allJobs || []);
    } else {
      const filtered = (allJobs || []).filter((job) => {
        return activeEntries.every(([key, value]) => job?.[key] === value);
      });
      setJobList(filtered);
    }
    setIsDialogOpen(false);
  };

  const resetFilters = () => {
    setFilters({});
    setJobList(allJobs || []);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button
        variant={activeFiltersCount > 0 ? "default" : "outline"}
        size="sm"
        onClick={() => setIsDialogOpen(true)}
        className={`gap-1.5 text-xs font-medium h-9 ${
          activeFiltersCount > 0
            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
            : "border-gray-200 dark:border-gray-800"
        }`}
      >
        <Filter className="h-3.5 w-3.5" />
        <span>Filter</span>
        {activeFiltersCount > 0 && (
          <span className="ml-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.2">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Filter Job Openings
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">
              Refine jobs by company, role title, employment type, or location.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {filterMenus.map((menu) => (
              <div key={menu.id} className="space-y-1.5">
                <Label htmlFor={menu.id} className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {menu.name}
                </Label>
                <Select
                  value={filters[menu.id] || "__ALL__"}
                  onValueChange={(value) => handleFilterChange(menu.id, value)}
                >
                  <SelectTrigger id={menu.id} className="h-9 text-xs">
                    <SelectValue placeholder={`All ${menu.name}s`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__" className="text-xs text-gray-500">
                      All {menu.name}s
                    </SelectItem>
                    {menu.options.map((option) => (
                      <SelectItem key={option} value={option} className="text-xs">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={resetFilters}
              disabled={activeFiltersCount === 0}
              className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              Reset Filters
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={applyFilters}
                className="text-xs font-medium"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}