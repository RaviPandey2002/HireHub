'use client'

import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { filterMenuDataArray } from 'lib/utils'


export function JobFilter({ allJobs, jobList, setJobList }) {
  const [filteredJobs, setFilteredJobs] = useState(allJobs)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [filterMenus, setFilterMenus] = useState<Array<{ id: string; name: string; options: string[] }>>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({})
  const activeFiltersCount = Object.keys(filters).length;

  useEffect(() => {
    const generatedFilterMenus = filterMenuDataArray.map(item => ({
      id: item.id,
      name: item.label,
      options: [...new Set(filteredJobs.map(listItem => listItem[item.id as keyof typeof listItem]))] as string[], // Type assertion to enforce string[]
    }));
    setFilterMenus(generatedFilterMenus);
  }, []);


  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    applyFilters(allJobs); 
  }
  
  const applyFilters = (jobsToFilter) => {
    setAppliedFilters(filters);
    const newFilteredJobs = jobsToFilter.filter(job => {
      return Object.entries(filters).every(([key, value]) => {
        return job[key as keyof typeof job] === value;
      });
    });
    setJobList(newFilteredJobs);
    setIsDialogOpen(false);
    setIsSheetOpen(false);
  }


  const resetFilters = () => {
    setFilters({})
    setJobList(allJobs)
  }

  const FilterForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {filterMenus.map((menu) => (
        <div key={menu.id}>
          <Label htmlFor={menu.id}>{menu.name}</Label>
          <Select
            value={filters[menu.id] || ''}
            onValueChange={(value) => handleFilterChange(menu.id, value)}
          >
            <SelectTrigger id={menu.id}>
              <SelectValue placeholder={`${menu.name}`} />
            </SelectTrigger>
            <SelectContent>
              {menu.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button" onClick={resetFilters}>
          Reset
        </Button>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  )

  // const FilterButton = ({ onClick, className }: { onClick: () => void, className: string }) => (
  //   <Button
  //     variant={activeFiltersCount > 0 ? "default" : "outline"}
  //     className={`${className} ${activeFiltersCount > 0 ? "bg-primary text-primary-foreground font-bold" : ""}`}
  //     onClick={onClick}
  //   >
  //     <Filter className={`mr-2 h-4 w-4 ${activeFiltersCount > 0 ? "animate-pulse" : ""}`} />
  //     Filters {activeFiltersCount > 0 ? `( ${activeFiltersCount} )` : ""}
  //   </Button>
  // )

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Desktop Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          {/* <FilterButton onClick={() => setIsDialogOpen(true)} className="hidden md:flex mb-4" /> */}
          <Button onClick={() => setIsDialogOpen(true)} className="hidden md:flex mb-4" variant="outline" >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Job Filters</DialogTitle>
            <DialogDescription>
              Apply filters to find the perfect job opportunity.
            </DialogDescription>
          </DialogHeader>
          <FilterForm />
        </DialogContent>
      </Dialog>

      {/* Mobile Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          {/* <FilterButton onClick={() => setIsSheetOpen(true)} className="md:hidden mb-4" /> */}
          <Button className="md:hidden mb-4" variant="outline">
            <Filter className="mr-2 h-4 w-4 " />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90%]">
          <SheetHeader>
            <SheetTitle>Job Filters</SheetTitle>
            <SheetDescription>
              Apply filters to find the perfect job opportunity.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <FilterForm />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}