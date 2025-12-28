export default function HalfDonutChart() {
    const donutData = [
        { label: "Completed", value: 30, color: "#446E6D" },
        { label: "In Progress", value: 40, color: "#1a2928" },
        { label: "Pending", value: 30, color: "url(#stripes-donut)", hasStripes: true },
    ];
    const GeneralHeaderClass = "font-semibold mb-2 text-xl";
    // Calculate total and percentages
    const totalValue = donutData.reduce((sum, item) => sum + item.value, 0);
    const dataWithPercentages = donutData.map(item => ({
        ...item,
        percentage: (item.value / totalValue) * 100
    }));

    // Calculate stroke dash arrays for semicircle (half of full circumference = π * radius)
    const radius = 110;
    const circumference = 2 * Math.PI * radius;
    const semicircumference = circumference / 2; // Only top half

    let cumulativeOffset = 0;
    const segments = dataWithPercentages.map((item, index) => {
        const segmentLength = (item.percentage / 100) * semicircumference;
        const segment = {
            ...item,
            strokeDasharray: `${segmentLength} ${circumference}`,
            strokeDashoffset: -cumulativeOffset,
        };
        cumulativeOffset += segmentLength;
        return segment;
    });

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <span className={GeneralHeaderClass}>Project Progress</span>
            <div className="flex flex-col items-center my-3">
                <div className="relative">
                    <svg width="280" height="150" viewBox="0 0 280 150" style={{ overflow: "visible" }}>

                        {segments.map((segment, index) => (
                            <circle
                                key={index}
                                cx="140"
                                cy="140"
                                r={radius}
                                stroke={segment.color}
                                strokeWidth="45"
                                fill="none"
                                strokeDasharray={segment.strokeDasharray}
                                strokeDashoffset={segment.strokeDashoffset}
                                strokeLinecap="round"
                                transform="rotate(-180 140 140)"
                            />
                        ))}

                        <defs>
                            <pattern id="stripes-donut" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
                                <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" />
                            </pattern>
                        </defs>
                    </svg>
                </div>
                <span className="text-4xl font-bold text-primary -mt-8">
                    {Math.round((donutData[0].value / totalValue) * 100)}%
                </span>
                <span className="text-sm text-primary font-medium">Project Ended</span>
                <div className="flex gap-6 mt-4">
                    {dataWithPercentages.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 mt-5">
                            {item.hasStripes ? (
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(-25deg, transparent, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.2) 6px)',
                                        backgroundColor: '#d1d5db'
                                    }}
                                />
                            ) : (
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                            )}
                            <span className="text-xs text-gray-700 font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};