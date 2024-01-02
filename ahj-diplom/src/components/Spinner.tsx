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
          r="22"
          style={{
            maxWidth: 100,
            fill: "transparent",
            stroke: "purple",
            strokeDashoffset: 75,
            strokeWidth: 3,
            strokeDasharray: 166,
          }}
        />
      </svg>
    </div>
  );
}
