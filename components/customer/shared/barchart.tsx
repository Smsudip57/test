import React from 'react'

export default function BarChart() {
    const chartData = [
        { day: "S", value: 38, color: "bg-gray-300", hasStripes: true },
        { day: "M", value: 62, color: "bg-primary", hasStripes: false },
        { day: "T", value: 56, color: "bg-primary-light", hasStripes: false },
        { day: "W", value: 74, color: "bg-primary-dark", hasStripes: false, label: "74%" },
        { day: "T", value: 40, color: "bg-gray-300", hasStripes: true },
        { day: "F", value: 35, color: "bg-gray-300", hasStripes: true },
        { day: "S", value: 32, color: "bg-gray-300", hasStripes: true },
    ];

    // Find the maximum value to scale all bars proportionally
    const maxValue = Math.max(...chartData.map(bar => bar.value));
    const GeneralHeaderClass = "font-semibold mb-2 text-xl";
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-10">
            <span className={GeneralHeaderClass}>Project Analytics</span>
            <div className="flex gap-4 items-end justify-center h-48">
                {chartData.map((bar, index) => {
                    // Calculate height as percentage of max value
                    const heightPercent = (bar.value / maxValue) * 100;

                    return (
                        <div key={index} className="flex flex-col items-center gap-1">
                            <div className="relative h-48 flex items-end">
                                <div
                                    className={`${bar.color} rounded-full w-12 transition-all relative overflow-visible`}
                                    style={{
                                        height: `${heightPercent}%`,
                                        backgroundImage: bar.hasStripes ? 'repeating-linear-gradient(-25deg, transparent, transparent 3px, rgba(0,0,0,0.4) 3px, rgba(0,0,0,0.2) 6px)' : 'none'
                                    }}
                                >
                                    {bar.label && (
                                        <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                                            {bar.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{bar.day}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
