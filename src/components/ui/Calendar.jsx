import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Generate calendar dates
  const dates = [];

  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }

  for (let d = 1; d <= totalDays; d++) {
    dates.push(d);
  }

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

  const isToday = (date) => {
    return (
      date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-4 w-[300px] max-w-md border-2 border-gray-300" >
        
        {/* Header */}
        {/* <h2 className="text-2xl font-semibold text-center mb-4">
          Dynamic Calendar
        </h2> */}

        {/* Selectors */}
        <div className="flex  items-center gap-3 mb-6 ">
 <ChevronLeft className="h-8 w-8" />
          <select
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
            className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(+e.target.value)}
            className="w-1/2 border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          >
            {Array.from({ length: 15 }, (_, i) => 2020 + i).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          
           <ChevronRight className="h-8 w-8" />
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {dates.map((date, index) => (
            <button
              key={index}
              disabled={!date}
              onClick={() => date && setSelectedDate(date)}
              className={`
                h-10 rounded transition-all
                ${!date && "cursor-default"}
                ${
                  selectedDate === date
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100"
                }
                ${
                  isToday(date)
                    ? "border border-blue-500 font-semibold "
                    : ""
                }
              `}
            >
              {date || ""}
            </button>
          ))}
        </div>
         <div className="mt-5 flex  justify-end gap-3">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 w-[99px] ">
                    <p className="text-base ">Present</p>
                    <p className="text-lg font-semibold ">3</p>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 w-[99px]">
                    <p className="text-base ">Absent</p>
                    <p className="text-lg font-semibold ">2</p>
                  </div>
                </div>
      </div>
    </div>
  );
}





