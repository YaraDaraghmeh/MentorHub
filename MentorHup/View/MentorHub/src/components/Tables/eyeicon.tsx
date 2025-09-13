const Eye = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className="w-[22px] h-[22px]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M4 12a8 8 0 0 1 16 0" />
    </svg>
  );
};

export default Eye;
