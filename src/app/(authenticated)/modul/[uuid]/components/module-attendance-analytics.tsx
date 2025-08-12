"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Attendance, OrbitPresence } from "@/types/attendance";
import { useAttendance } from "@/store/useAttendance";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

type StatusKey = "h" | "s" | "i" | "a" | "b";

const STATUS_LABEL: Record<StatusKey, string> = {
  h: "Hadir",
  s: "Sakit",
  i: "Izin",
  a: "Alpa",
  b: "Bolos",
};

const STATUS_COLORS: Record<StatusKey, string> = {
  h: "#16a34a",
  s: "#eab308",
  i: "#3b82f6",
  a: "#ef4444",
  b: "#8b5cf6",
};

type Counts = Record<StatusKey, number>;

export default function ModuleAttendanceAnalytics({ modulUuid }: { modulUuid: string }) {
  const getRecapAttendances = useAttendance((s) => s.getRecapAttendances);
  const [rows, setRows] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getRecapAttendances(modulUuid)
      .then((res) => {
        if (res.status === 200) {
          setRows(res.data.data as Attendance[]);
        }
      })
      .finally(() => setLoading(false));
  }, [modulUuid, getRecapAttendances]);

  const { sessions, totals, maxValue, totalAll } = useMemo(() => {
    const sessionMap = new Map<string, { meta: OrbitPresence; counts: Counts }>();
    const totals: Counts = { h: 0, s: 0, i: 0, a: 0, b: 0 };

    for (const row of rows) {
      const presenceList: OrbitPresence[] = (row.orbit_presence || []).filter(
        (p) => p.orbit_modul_uuid === modulUuid,
      );

      for (const p of presenceList) {
        if (!sessionMap.has(p.uuid)) {
          sessionMap.set(p.uuid, {
            meta: p,
            counts: { h: 0, s: 0, i: 0, a: 0, b: 0 },
          });
        }
        const rec = sessionMap.get(p.uuid)!;
        const status = (p.presence?.status || "") as StatusKey;
        if (status && status in rec.counts) {
          rec.counts[status] += 1;
          totals[status] += 1;
        }
      }
    }

    const sessions = Array.from(sessionMap.values())
      .map((s) => ({
        id: s.meta.uuid,
        title: s.meta.title,
        date: s.meta.created_at,
        ...s.counts,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const maxValue = sessions.reduce((acc, r) => {
      const m = Math.max(r.h, r.s, r.i, r.a, r.b);
      return Math.max(acc, m);
    }, 0);

    const totalAll = (Object.values(totals) as number[]).reduce((acc, n) => acc + n, 0);

    return { sessions, totals, maxValue, totalAll };
  }, [rows, modulUuid]);

  const chartConfig = useMemo(
    () => ({
      hadir: { label: STATUS_LABEL.h, color: STATUS_COLORS.h },
      sakit: { label: STATUS_LABEL.s, color: STATUS_COLORS.s },
      izin: { label: STATUS_LABEL.i, color: STATUS_COLORS.i },
      alpa: { label: STATUS_LABEL.a, color: STATUS_COLORS.a },
      bolos: { label: STATUS_LABEL.b, color: STATUS_COLORS.b },
    }),
    [],
  );

  const pieData = (Object.keys(totals) as StatusKey[]).map((k) => ({
    name: STATUS_LABEL[k],
    key: k,
    value: totals[k],
    fill: STATUS_COLORS[k],
  }));

  const radarData = pieData.map((d) => ({ label: d.name, value: d.value }));
  const presentRate = totalAll > 0 ? Math.round((totals.h / totalAll) * 100) : 0;

  if (loading) return null;
  if (!sessions.length) return null;

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Analytics Presensi</CardTitle>
          <CardDescription>Ringkasan per pertemuan</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <AreaChart data={sessions} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                tickFormatter={(value, index) => `${index + 1}`}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide domain={[0, Math.max(5, maxValue)]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="h" name={STATUS_LABEL.h} stackId="1" stroke={STATUS_COLORS.h} fill={STATUS_COLORS.h} />
              <Area type="monotone" dataKey="s" name={STATUS_LABEL.s} stackId="1" stroke={STATUS_COLORS.s} fill={STATUS_COLORS.s} />
              <Area type="monotone" dataKey="i" name={STATUS_LABEL.i} stackId="1" stroke={STATUS_COLORS.i} fill={STATUS_COLORS.i} />
              <Area type="monotone" dataKey="a" name={STATUS_LABEL.a} stackId="1" stroke={STATUS_COLORS.a} fill={STATUS_COLORS.a} />
              <Area type="monotone" dataKey="b" name={STATUS_LABEL.b} stackId="1" stroke={STATUS_COLORS.b} fill={STATUS_COLORS.b} />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total per Status</CardTitle>
          <CardDescription>Distribusi keseluruhan</CardDescription>
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
          <CardTitle>Tren Hadir per Pertemuan</CardTitle>
          <CardDescription>Per pertemuan</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig as any} className="w-full h-[260px]">
            <LineChart data={sessions} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis tickFormatter={(value, index) => `${index + 1}`} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, Math.max(5, maxValue)]} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="h" name={STATUS_LABEL.h} stroke={STATUS_COLORS.h} strokeWidth={2} dot={false} />
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
              <Radar dataKey="value" name="Jumlah" stroke="#64748b" fill="#94a3b8" fillOpacity={0.4} />
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
              <RadialBar dataKey="value" cornerRadius={8} fill={STATUS_COLORS.h} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
