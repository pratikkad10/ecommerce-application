
export function AuthBackgroundGraphics() {
  return (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-container rounded-full blur-[100px]"></div>
    </div>
  );
}
