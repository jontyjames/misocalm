/**
 * ExperienceLoading - full-screen loader for immersive canvas practices.
 */

export default function ExperienceLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-void-black px-6"
      aria-label="Loading practice"
      aria-busy="true"
    >
      <div className="relative h-[110px] w-[110px]" style={{ animation: 'fadeIn 610ms ease-out' }}>
        {Array.from({ length: 7 }, (_, index) => {
          const size = 16 + index * 10;
          const inset = (110 - size) / 2;
          return (
            <div
              key={index}
              className="absolute rounded-full border border-indigo-400/20"
              style={{
                width: size,
                height: size,
                left: inset,
                top: inset,
                opacity: 0.18 + index * 0.08,
                boxShadow: index === 6 ? '0 0 34px rgba(99,102,241,0.18)' : 'none',
                animation: `fadeIn 987ms ease-out ${index * 55}ms both`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
