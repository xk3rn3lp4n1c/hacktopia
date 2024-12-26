const TeamLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[100vw] h-full">
      <div className="w-[65vw] h-full mx-auto">{children}</div>
    </div>
  );
};

export default TeamLayout;
