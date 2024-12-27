const TeamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[100vw] h-full">
      <div className="px-4 md:px-0 md:w-[65vw] h-full mx-auto">{children}</div>
    </div>
  );
};

export default TeamLayout;
