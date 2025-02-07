export default function Catchphrase() {
  const catchphrases = [
    "Make a ticket for your own movie review.",
    "당신만의 영화 리뷰 티켓을 만들어보세요.",
  ];

  return (
    <div className="relative z-10 mx-auto h-14 w-full overflow-hidden md:h-16">
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#121212] via-transparent to-[#121212]"></div>
      <div className="absolute left-0 flex animate-scroll whitespace-nowrap">
        {[...Array(4)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex">
            {catchphrases.map((catchphrase, index) => (
              <div
                key={`${groupIndex}-${index}`}
                className="flex h-16 w-96 flex-shrink-0 items-center justify-center px-4 text-base font-bold text-white md:w-[40rem] md:text-xl"
                style={{
                  animationDelay: `${(groupIndex * catchphrase.length + index) * -3.75}s`,
                }}
              >
                {catchphrase}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
