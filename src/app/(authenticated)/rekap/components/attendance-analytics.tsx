"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IAttendance, Attendance } from "@/types/attendance";
import { format } from "date-fns";

type StatusKey = "h" | "s" | "i" | "a" | "b";

const STATUS_LABEL: Record<StatusKey, string> = {
  h: "Hadir",
  s: "Sakit",
  i: "Izin",
  a: "Alpa",
  b: "Bolos",
};

// Colors tuned to Tailwind palette. Used via ChartContainer CSS variables
const STATUS_COLORS: Record<StatusKey, string> = {
  h: "#16a34a", // green-600
  s: "#eab308", // yellow-500
  i: "#3b82f6", // blue-500
  a: "#ef4444", // red-500
  b: "#8b5cf6", // violet-500
};

type Counts = Record<StatusKey, number>;

function getItemCounts(item: IAttendance): Counts {
  // Prefer API-provided counts if present
  const hasApiCounts =
    item.count_h !== undefined ||
    item.count_s !== undefined ||
    item.count_i !== undefined ||
    item.count_a !== undefined ||
    item.count_b !== undefined;

  if (hasApiCounts) {
    return {
      h: item.count_h || 0,
      s: item.count_s || 0,
      i: item.count_i || 0,
      a: item.count_a || 0,
      b: item.count_b || 0,
    };
  }

  // Fallback: derive from attendances[] statuses
  const counts: Counts = { h: 0, s: 0, i: 0, a: 0, b: 0 };
  (item.attendances || []).forEach((att: Attendance) => {
    const status = (att.presence?.status || "").toLowerCase() as StatusKey;
    if (status && status in counts) counts[status] += 1;
  });
  return counts;
}

function getDateKey(item: IAttendance): string {
  const iso = (item.updated_at || item.date || item.created_at) as
    | string
    | number
    | Date;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return format(d, "yyyy-MM-dd");
}

export default function AttendanceAnalytics({
  items,
  title = "Analytics Kehadiran",
  description = "Ringkasan visual berdasarkan rentang tanggal",
}: {
  items: IAttendance[];
  title?: string;
  description?: string;
}) {
  const { seriesByDate, totals, maxValue, totalAll } = useMemo(() => {
    const perDate = new Map<string, Counts>();
    const totals: Counts = { h: 0, s: 0, i: 0, a: 0, b: 0 };

    for (const item of items || []) {
      const dateKey = getDateKey(item);
      if (!dateKey) continue;
      const counts = getItemCounts(item);

      // Accumulate per date
      const existing = perDate.get(dateKey) || { h: 0, s: 0, i: 0, a: 0, b: 0 };
      (Object.keys(existing) as StatusKey[]).forEach((k) => {
        existing[k] += counts[k];
      });
      perDate.set(dateKey, existing);

      // Accumulate totals
      (Object.keys(totals) as StatusKey[]).forEach((k) => {
        totals[k] += counts[k];
      });
    }

    const seriesByDate = Array.from(perDate.entries())
      .map(([date, c]) => ({ date, ...c }))
      .sort((a, b) => (a.date < b.date ? -1 : 1));

    const maxValue = seriesByDate.reduce((acc, row) => {
      const rowMax = Math.max(row.h, row.s, row.i, row.a, row.b);
      return Math.max(acc, rowMax);
    }, 0);

    const totalAll = (Object.values(totals) as number[]).reduce(
      (acc, n) => acc + n,
      0
    );

    return { seriesByDate, totals, maxValue, totalAll };
  }, [items]);

  const chartConfig = useMemo(() => {
    return {
      hadir: {
        label: STATUS_LABEL.h,
        color: STATUS_COLORS.h,
      },
      sakit: {
        label: STATUS_LABEL.s,
        color: STATUS_COLORS.s,
      },
      izin: {
        label: STATUS_LABEL.i,
        color: STATUS_COLORS.i,
      },
      alpa: {
        label: STATUS_LABEL.a,
        color: STATUS_COLORS.a,
      },
      bolos: {
        label: STATUS_LABEL.b,
        color: STATUS_COLORS.b,
      },
    } as const;
  }, []);

  const pieData = useMemo(
    () =>
      (Object.keys(totals) as StatusKey[]).map((k) => ({
        name: STATUS_LABEL[k],
        key: k,
        value: totals[k],
        fill: STATUS_COLORS[k],
      })),
    [totals]
  );

  const radarData = pieData.map((d) => ({ label: d.name, value: d.value }));

  const presentRate = totalAll > 0 ? Math.round((totals.h / totalAll) * 100) : 0;

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig as any}
            className="w-full h-[260px]"
          >
            <AreaChart data={seriesByDate} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, Math.max(5, maxValue)]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="h"
                name={STATUS_LABEL.h}
                stackId="1"
                stroke={STATUS_COLORS.h}
                fill={STATUS_COLORS.h}
              />
              <Area
                type="monotone"
                dataKey="s"
                name={STATUS_LABEL.s}
                stackId="1"
                stroke={STATUS_COLORS.s}
                fill={STATUS_COLORS.s}
              />
              <Area
                type="monotone"
                dataKey="i"
                name={STATUS_LABEL.i}
                stackId="1"
                stroke={STATUS_COLORS.i}
                fill={STATUS_COLORS.i}
              />
              <Area
                type="monotone"
                dataKey="a"
                name={STATUS_LABEL.a}
                stackId="1"
                stroke={STATUS_COLORS.a}
                fill={STATUS_COLORS.a}
              />
              <Area
                type="monotone"
                dataKey="b"
                name={STATUS_LABEL.b}
                stackId="1"
                stroke={STATUS_COLORS.b}
                fill={STATUS_COLORS.b}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Distribusi Status</CardTitle>
          <CardDescription>Ringkasan total per status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <BarChart data={[{ key: "total", ...totals }]}> 
              <CartesianGrid vertical={false} />
              <XAxis dataKey={() => "Total"} tickLine={false} axisLine={false} />
              <YAxis hide />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="h" name={STATUS_LABEL.h} fill={STATUS_COLORS.h} />
              <Bar dataKey="s" name={STATUS_LABEL.s} fill={STATUS_COLORS.s} />
              <Bar dataKey="i" name={STATUS_LABEL.i} fill={STATUS_COLORS.i} />
              <Bar dataKey="a" name={STATUS_LABEL.a} fill={STATUS_COLORS.a} />
              <Bar dataKey="b" name={STATUS_LABEL.b} fill={STATUS_COLORS.b} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Tren Hadir</CardTitle>
          <CardDescription>Per tanggal</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <LineChart data={seriesByDate} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, Math.max(5, maxValue)]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="h"
                name={STATUS_LABEL.h}
                stroke={STATUS_COLORS.h}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Komposisi</CardTitle>
          <CardDescription>Total per status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.map((entry) => (
                  <Cell key={entry.key} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Radar Status</CardTitle>
          <CardDescription>Perbandingan antar status</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <RadarChart data={radarData} outerRadius={80}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" />
              <PolarRadiusAxis angle={30} domain={[0, Math.max(5, maxValue)]} />
              <Radar
                dataKey="value"
                name="Jumlah"
                stroke="#64748b" // slate-500
                fill="#94a3b8" // slate-400
                fillOpacity={0.4}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Present Rate</CardTitle>
          <CardDescription>Persentase Hadir</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <RadialBarChart
              innerRadius={60}
              outerRadius={100}
              data={[{ name: "Hadir", value: presentRate }]}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                dataKey="value"
                cornerRadius={8}
                fill={STATUS_COLORS.h}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {/* Center label */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-medium text-xl fill-foreground"
              >
                {presentRate}%
              </text>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}


