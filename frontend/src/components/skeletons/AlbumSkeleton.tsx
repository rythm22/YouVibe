const AlbumSkeleton = () => {
  return (
    <div className="h-full">
      <div className="relative min-h-full">
        {/* Background gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Album Header */}
          <div className="p-6 gap-6 pb-8 flex">
            {/* Album Cover Skeleton */}
            <div className="w-[240px] h-[240px] rounded bg-zinc-800 animate-pulse" />

            {/* Album Info Skeleton */}
            <div className="flex flex-col justify-end">
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="h-16 w-96 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Play Button Skeleton */}
          <div className="px-6 pb-4">
            <div className="w-14 h-14 rounded-full bg-zinc-800 animate-pulse" />
          </div>

          {/* Table Section */}
          <div className="bg-black/20 backdrop-blur-sm">
            {/* Table Header */}
            <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 border-b border-white/5">
              <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
            </div>

            {/* Song List Skeleton */}
            <div className="px-6">
              <div className="space-y-2 py-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 rounded-md"
                  >
                    <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-zinc-800 rounded animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumSkeleton;
