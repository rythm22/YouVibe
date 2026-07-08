const MessageSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <div
      key={i}
      className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse"
    >
      <div className="flex-1 lg:block hidden">
        <div className="h-5 w-24 bg-zinc-800 rounded mb-2" />
        <div className="h-4 w-32 bg-zinc-800 rounded" />
      </div>
    </div>
  ));
};
export default MessageSkeleton;
