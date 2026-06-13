// A small animated "buddy" character — one per connected user.
// Each buddy gets a color and a slightly different animation delay
// so the group feels alive rather than synced robots.

function Buddy({ name, color, delay = 0 }) {
  return (
    <div className="buddy">
      <div className="buddy-sprite" style={{ animationDelay: `${delay}s` }}>
        <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <rect x="6" y="8" width="24" height="22" rx="6" fill={color} />
          {/* Antenna */}
          <rect x="16" y="2" width="4" height="6" rx="2" fill={color} />
          <circle cx="18" cy="3" r="3" fill={color} />
          {/* Screen face */}
          <rect x="10" y="13" width="16" height="11" rx="3" fill="#0d1117" />
          {/* Eyes */}
          <rect
            className="buddy-eye"
            x="13"
            y="16.5"
            width="3"
            height="4"
            rx="1.5"
            fill={color}
          />
          <rect
            className="buddy-eye"
            x="20"
            y="16.5"
            width="3"
            height="4"
            rx="1.5"
            fill={color}
            style={{ animationDelay: "0.15s" }}
          />
          {/* Feet */}
          <rect x="10" y="30" width="5" height="4" rx="2" fill={color} opacity="0.7" />
          <rect x="21" y="30" width="5" height="4" rx="2" fill={color} opacity="0.7" />
        </svg>
      </div>
      <span className="buddy-name">{name}</span>
    </div>
  );
}

export default Buddy;