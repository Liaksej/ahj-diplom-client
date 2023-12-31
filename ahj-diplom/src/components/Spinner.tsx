export default function Spinner({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div className={`w-[7rem] h-[7rem]`}>
      <svg className="animate-spin" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="17"
          style={{
            maxWidth: 100,
            fill: "transparent",
            stroke: "gray",
            strokeDashoffset: 75,
            strokeWidth: 3,
            strokeDasharray: 166,
          }}
        />
      </svg>
    </div>
  );
}
