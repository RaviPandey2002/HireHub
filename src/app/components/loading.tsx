import { Skeleton } from './ui/skeleton'

export default function Loading() {
  return (
    <Skeleton className="flex text-center justify-center min-h-[630px] h-full w-full bg-zinc-500 mt-5">
      Loading....
    </Skeleton>
  );
}
