export default function Spinner({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div style={{ height: height, width: width }}>
      <svg className="animate-spin" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          style={{
            maxWidth: 100,
            fill: "transparent",
            stroke: "gray",
            strokeDashoffset: 75,
            strokeWidth: 4,
            strokeDasharray: 166,
          }}
        />
      </svg>
    </div>
  );
}
