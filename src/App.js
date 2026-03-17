import React, { useState, useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Legend,
  ErrorBar,
} from "recharts";
import {
  Anchor,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  Award,
  Calendar,
  FileDown,
  Share2,
  Info,
  Download,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  FileText,
  DollarSign,
} from "lucide-react";

// ─── Metric Definitions ─────────────────────────────────────────────────────
const metricDefinitions = {
  wOBA: "Weighted On-Base Average (wOBA) measures a hitter's overall offensive value, based on the relative values of each type of hit.",
  "ERA+": "ERA+ adjusts a pitcher's ERA for park factors and the league average, where 100 is average. Above 100 is better than average.",
  "Stuff+": "Stuff+ models the physical characteristics of a pitch (velocity, movement) to rate its 'nastiness' on a scale where 100 is average.",
  "Location+": "Location+ measures a pitcher's ability to command their pitches and hit their intended spots, where 100 is average.",
  FIP: "Fielding Independent Pitching (FIP) estimates a pitcher's ERA based on outcomes they control: strikeouts, walks, and home runs.",
  DRS: "Defensive Runs Saved (DRS) quantifies a player's total defensive value in terms of runs saved or cost.",
  OAA: "Outs Above Average (OAA) measures the cumulative effect of all individual plays a fielder has been credited with.",
  "Barrel %": "The percentage of batted balls that have the ideal combination of exit velocity and launch angle, typically resulting in extra-base hits.",
  "wRC+": "Weighted Runs Created Plus (wRC+) measures a hitter's total offensive value, adjusted for park and league. 100 is league average.",
  "ERA-": "ERA Minus (ERA-) adjusts a pitcher's ERA relative to the league. Below 100 is better than average.",
  WAR: "Wins Above Replacement (WAR) estimates the total number of wins a player contributes over a replacement-level player.",
  LI: "Leverage Index (LI) measures the importance of a game situation. An LI of 1.0 is average; 2.0+ is high leverage.",
};

// ─── COMPLETE DATASET — AS OF JULY 15, 2025 ────────────────────────────────
const completeData = {
  executive: [
    {
      title: "Win Upside",
      value: "+4.1 to +7.8",
      centralEstimate: 6.2,
      previous: 5.8,
      subtitle: "Central estimate: +6.2 wins (see methodology)",
      trend: [
        { month: "Apr", value: 0 }, { month: "May", value: 1.8 }, { month: "Jun", value: 3.9 }, { month: "Jul", value: 6.2 },
      ],
      status: "good",
      insight: "Range reflects interaction effects between initiatives (e.g., plate discipline gains partially overlap with launch angle work). Low end assumes partial adoption; high end assumes full implementation with favorable regression.",
      methodology: "Projected via delta-WAR model: each initiative's impact estimated independently, then discounted 15-25% for interaction effects. Range reflects 10th/90th percentile outcomes from 10,000 Monte Carlo simulations using historical intervention success rates.",
      dataQuality: { confidence: 72, sampleSize: "94 games", lastUpdated: "2025-07-15", source: "Internal Model" },
    },
    {
      title: "Current Record",
      value: "38-56",
      previous: 0.41,
      subtitle: "18 games below .500 — organization in sell-mode evaluation",
      delta: -32,
      status: "critical",
      insight: "Reaching 86 wins requires .714 baseball over 68 games, an unrealistic target. Front office focus should shift to asset maximization and prospect pipeline ROI ahead of the July 30 trade deadline.",
      dataQuality: { confidence: 100, sampleSize: "94 games", lastUpdated: "2025-07-15", source: "MLB Official" },
    },
    {
      title: "Team wOBA",
      value: ".301",
      previous: 0.298,
      subtitle: "Ranks 28th of 30 MLB teams",
      delta: -4.4,
      status: "critical",
      insight: "Offensive production sits 14 points below league average (.315). Primary drivers: high chase rate (31.4% vs 28.1% league) and inconsistent launch angles across the lineup.",
      dataQuality: { confidence: 95, sampleSize: "3,247 PA", lastUpdated: "2025-07-15", source: "Baseball Savant" },
      rank: 28,
      total: 30,
    },
    {
      title: "Pitching ERA+",
      value: "108",
      previous: 106,
      subtitle: "8% above league average — organizational strength",
      delta: 8,
      status: "good",
      insight: "Staff 4.10 ERA (108 ERA+) is a competitive foundation and a trade asset. Skenes is untouchable; Keller, Bednar, and Chapman carry significant deadline value.",
      dataQuality: { confidence: 98, sampleSize: "843.2 IP", lastUpdated: "2025-07-15", source: "FanGraphs" },
      rank: 11,
      total: 30,
    },
  ],

  // ─── Trade asset valuations ───
  tradeAssets: [
    {
      player: "Bryan Reynolds", age: 30, position: "CF/LF", contract: "$7.4M / 2 yrs control",
      fwar: 1.2, fwarPace: 2.1, percentile: 55,
      tradeValue: "Top-100 prospect + secondary piece",
      rationale: "Solid everyday outfielder with a track record, but 2025 regression and age reduce return ceiling. Best moved if a contender needs an outfield bat at the deadline.",
      status: "sell",
    },
    {
      player: "David Bednar", age: 29, position: "RP", contract: "$5.2M / 1 yr control",
      fwar: 0.8, fwarPace: 1.4, percentile: 70,
      tradeValue: "Top-100 prospect",
      rationale: "High-leverage reliever with closing experience. One year of control limits return but steady 3.24 ERA and 3.12 FIP make him attractive to any contender needing bullpen depth.",
      status: "sell",
    },
    {
      player: "Aroldis Chapman", age: 37, position: "RP", contract: "$10M / rental",
      fwar: 0.4, fwarPace: 0.7, percentile: 45,
      tradeValue: "Lottery ticket prospect",
      rationale: "Pure rental with diminished velocity but still effective. Low return ceiling but worth moving to clear salary and give innings to younger arms.",
      status: "sell",
    },
    {
      player: "Mitch Keller", age: 29, position: "SP", contract: "$5.1M / 2 yrs control",
      fwar: 1.4, fwarPace: 2.4, percentile: 60,
      tradeValue: "Top-50 prospect package",
      rationale: "Above-average stuff (103 Stuff+) with two years of control makes him the most valuable non-Skenes trade chip. Command inconsistency (89 Location+) slightly depresses value. Could justify keeping if 2026 contention is realistic.",
      status: "evaluate",
    },
    {
      player: "Paul Skenes", age: 23, position: "SP", contract: "Pre-arb / 5+ yrs control",
      fwar: 3.1, fwarPace: 5.4, percentile: 99,
      tradeValue: "Untouchable — franchise cornerstone",
      rationale: "Cy Young-caliber ace in his first full season with 5+ years of control. No realistic trade return justifies moving him. Build the 2026-27 contention window around him.",
      status: "keep",
    },
  ],

  offensiveMetrics: [
    {
      metric: "Launch Angle Variance",
      pirates: 8.2, league: 5.8,
      players: "Reynolds: 8.2°, Hayes: 7.8° vs Cruz: 4.1°",
      impact: "Inconsistent contact quality reduces barrel rate",
      priority: "High", sampleSize: "N=2,847 batted balls",
      recommendation: "4-week intensive: daily machine work targeting 10-25° launch window, video analysis of swing plane consistency, biomechanical assessment. Target: reduce variance by 30%.",
      dataQuality: { confidence: 88, sampleSize: "2,847 BBE", lastUpdated: "2025-07-15" },
    },
    {
      metric: "Chase Rate Gap",
      pirates: 31.4, league: 28.1,
      players: "Team-wide systematic issue across lineup",
      impact: "-3.3 percentage points vs league average",
      priority: "High", sampleSize: "N=9,241 pitches outside zone",
      recommendation: "Comprehensive plate discipline program: strike zone recognition drills, two-strike approach modifications, real-time chase rate feedback during BP.",
      dataQuality: { confidence: 94, sampleSize: "9,241 pitches", lastUpdated: "2025-07-15" },
    },
    {
      metric: "2-0 Count Performance",
      pirates: 7.2, league: 11.8,
      players: "All hitters underperforming in hitter's counts",
      impact: "-39% relative deficit in advantageous situations",
      priority: "Medium", sampleSize: "N=987 2-0 count situations",
      recommendation: "Aggressive approach training: video study of optimal 2-0 decisions, establish hunting zones by pitch type. Note: N=987 is marginal — monitor for stabilization before major program investment.",
      dataQuality: { confidence: 68, sampleSize: "987 counts", lastUpdated: "2025-07-15" },
    },
  ],

  monthlyWoba: [
    { month: "Apr", woba: 0.285, leagueAvg: 0.315 },
    { month: "May", woba: 0.298, leagueAvg: 0.315 },
    { month: "Jun", woba: 0.307, leagueAvg: 0.315 },
    { month: "Jul", woba: 0.301, leagueAvg: 0.315 },
  ],

  monthlyRecord: [
    { month: "April", wins: 10, losses: 18 },
    { month: "May", wins: 12, losses: 16 },
    { month: "June", wins: 11, losses: 17 },
    { month: "July", wins: 5, losses: 5 },
  ],

  winUpsideBreakdown: [
    { name: "Plate Discipline Program", wins: 1.8, low: 1.1, high: 2.4, color: "#3B82F6" },
    { name: "Launch Angle Consistency", wins: 0.7, low: 0.3, high: 1.2, color: "#10B981" },
    { name: "Keller Command Development", wins: 1.1, low: 0.5, high: 1.6, color: "#F97316" },
    { name: "Bednar Leverage Deployment", wins: 0.3, low: 0.1, high: 0.5, color: "#A855F7" },
    { name: "Defensive Positioning/Framing", wins: 0.4, low: 0.2, high: 0.7, color: "#6366F1" },
    { name: "2-0 Count Aggressiveness", wins: 0.6, low: 0.2, high: 0.9, color: "#EC4899" },
    { name: "Roster Optimization (Trade)", wins: 1.1, low: 0.5, high: 1.8, color: "#FDB827" },
  ],

  strikezone: [
    { zone: "Heart", frequency: 22, status: "Exploit", woba: 0.425, wobaLow: 0.365, wobaHigh: 0.485, sampleSize: 89, color: "#EF4444", analysis: "Opponents achieve .425 wOBA in the heart of the zone. Caution: N=89 yields a standard error of ~.050." },
    { zone: "Outer Third", frequency: 18, status: "Weakness", woba: 0.285, wobaLow: 0.225, wobaHigh: 0.345, sampleSize: 73, color: "#F97316", analysis: "Poor outer-third performance (.285 wOBA) suggests difficulty with breaking balls away. SE ~.055." },
    { zone: "Corners", frequency: 31, status: "Neutral", woba: 0.315, wobaLow: 0.270, wobaHigh: 0.360, sampleSize: 125, color: "#3B82F6", analysis: "Corner performance (.315) is league-average. Largest zone sample (N=125), most reliable estimate." },
    { zone: "Upper Zone", frequency: 15, status: "Strength", woba: 0.195, wobaLow: 0.135, wobaHigh: 0.255, sampleSize: 61, color: "#22C55E", analysis: "Excellent on elevated pitches (.195 wOBA). Note: N=61 means this could regress toward .230-.250." },
    { zone: "Lower Zone", frequency: 14, status: "Neutral", woba: 0.310, wobaLow: 0.245, wobaHigh: 0.375, sampleSize: 57, color: "#6B7280", analysis: "Lower zone performance (.310) is adequate. Smallest sample (N=57), widest confidence interval." },
  ],

  pitchingData: {
    rotation: [
      { name: "Paul Skenes", ip: 117.1, era: 2.01, stuff: 115, location: 96, mmWoba: 0.245, role: "Ace", wins: 2.8, fip: 2.84, kRate: 34.2 },
      { name: "Mitch Keller", ip: 126.1, era: 4.28, stuff: 103, location: 89, mmWoba: 0.365, role: "Workhorse", wins: 1.1, fip: 4.01, kRate: 23.8 },
      { name: "Luis Ortiz", ip: 98.2, era: 4.05, stuff: 97, location: 91, mmWoba: 0.335, role: "Mid-Rotation", wins: 0.6, fip: 4.18, kRate: 19.4 },
    ],
    bullpen: [
      { name: "David Bednar", saves: 8, era: 3.24, leverageUsage: 65, optimalUsage: 80, wins: 0.3, low: 0.1, high: 0.5, role: "Closer", fip: 3.12 },
      { name: "Aroldis Chapman", saves: 3, era: 3.89, leverageUsage: 42, optimalUsage: 68, wins: 0.15, low: 0.05, high: 0.25, role: "Setup", fip: 3.65 },
      { name: "Colin Holderman", saves: 2, era: 3.15, leverageUsage: 38, optimalUsage: 60, wins: 0.2, low: 0.08, high: 0.3, role: "Setup", fip: 3.28 },
    ],
    advancedMetrics: [
      { name: "First-Pitch Strike %", pirates: 59.8, league: 60.5, status: "warning", insight: "Slightly behind league average in getting ahead of hitters." },
      { name: "Barrel % Allowed", pirates: 6.2, league: 7.8, status: "good", insight: "Excels at limiting the most dangerous type of contact." },
      { name: "CSW %", pirates: 28.9, league: 28.5, status: "good", insight: "Staff effectively fools hitters and commands the zone." },
      { name: "Chase Contact % Allowed", pirates: 52.8, league: 59.8, status: "good", insight: "Pitchers are excellent at generating whiffs on chases." },
    ],
  },

  sprayChart: {
    pullRate: 42, centerRate: 35, oppositeRate: 23,
    gbFbRatio: 1.15, groundBallRate: 53.5, flyBallRate: 46.5,
    analysis: "High pull rate (42%) and ground ball tendency make the offense predictable. Opposing defenses deploy shifts effectively, turning potential hits into outs.",
    recommendation: "Implement opposite-field hitting program and focus on elevating the ball to counter shifts and increase extra-base hits.",
  },

  playerInsights: [
    {
      player: "Paul Skenes", impact: 2.8, type: "Cy Young Candidate",
      recommendation: "Continue secondary-pitch development while maintaining fastball dominance. Untouchable trade asset.",
      timeline: "Season-long",
      standardMetric: "ERA-", standardValue: 50, // ERA- where <100 is good
      metrics: [
        { name: "ERA", value: "2.01", percentile: 98, leagueAvg: "4.05" },
        { name: "WHIP", value: "0.93", percentile: 96, leagueAvg: "1.24" },
        { name: "K/9", value: "10.1", percentile: 89, leagueAvg: "8.8" },
        { name: "FIP", value: "2.84", percentile: 94, leagueAvg: "4.12" },
      ],
      analysis: "Elite rookie posting historically dominant numbers. 2.01 ERA leads MLB among qualified starters. 98.1 MPH average fastball with exceptional movement creates elite whiff rates.",
      pitchArsenal: [
        { pitch: "4-Seam FB", usage: 64, velocity: 98.1, whiffPct: 32, woba: 0.28 },
        { pitch: "Splinker", usage: 22, velocity: 89.2, whiffPct: 47, woba: 0.185 },
        { pitch: "Slider", usage: 14, velocity: 87.8, whiffPct: 41, woba: 0.26 },
      ],
      trend: [
        { month: "Apr", value: 61 }, { month: "May", value: 49 }, { month: "Jun", value: 47 }, { month: "Jul", value: 50 },
      ],
      dataQuality: { confidence: 99, sampleSize: "117.1 IP", lastUpdated: "2025-07-15" },
    },
    {
      player: "Oneil Cruz", impact: 1.6, type: "Power Development Case",
      recommendation: "Launch angle optimization to unlock elite exit velocity into consistent power production.",
      timeline: "Immediate focus",
      standardMetric: "wRC+", standardValue: 102,
      metrics: [
        { name: "Exit Velocity", value: "96.3 MPH", percentile: 100, leagueAvg: "88.9 MPH" },
        { name: "Barrel Rate", value: "22.2%", percentile: 100, leagueAvg: "7.1%" },
        { name: "Launch Angle", value: "9.8°", percentile: 22, leagueAvg: "12.4°" },
        { name: "wOBA", value: ".319", percentile: 45, leagueAvg: ".315" },
      ],
      analysis: "Elite exit velocity (96.3 MPH, leads MLB) but suboptimal launch angle (9.8°) limits power. 122.9 MPH HR Statcast record but only 12 HRs indicates mechanical inefficiency.",
      trend: [
        { month: "Apr", value: 85 }, { month: "May", value: 108 }, { month: "Jun", value: 98 }, { month: "Jul", value: 102 },
      ],
      dataQuality: { confidence: 92, sampleSize: "384 PA", lastUpdated: "2025-07-15" },
    },
    {
      player: "Ke'Bryan Hayes", impact: 1.5, type: "Defensive Wizard",
      recommendation: "Focus on elevating the ball to the pull side to leverage solid contact skills.",
      timeline: "Off-season",
      standardMetric: "wRC+", standardValue: 72,
      metrics: [
        { name: "DRS", value: "+15", percentile: 99, leagueAvg: "0" },
        { name: "OAA", value: "+12", percentile: 98, leagueAvg: "0" },
        { name: "Launch Angle", value: "4.5°", percentile: 15, leagueAvg: "12.0°" },
        { name: "wOBA", value: ".285", percentile: 28, leagueAvg: ".315" },
      ],
      analysis: "Generational defender at third base saving runs at elite rate. Offensive game held back by high ground ball rate and chronic back issues affecting swing mechanics.",
      trend: [
        { month: "Apr", value: 68 }, { month: "May", value: 75 }, { month: "Jun", value: 78 }, { month: "Jul", value: 72 },
      ],
      dataQuality: { confidence: 88, sampleSize: "312 PA", lastUpdated: "2025-07-15" },
    },
    {
      player: "Mitch Keller", impact: 1.1, type: "Command Development Priority",
      recommendation: "Location+ improvement through mechanical consistency and breaking ball command. High trade value if org decides to sell.",
      timeline: "Remainder of season",
      standardMetric: "ERA-", standardValue: 106,
      metrics: [
        { name: "ERA", value: "4.28", percentile: 35, leagueAvg: "4.05" },
        { name: "Stuff+", value: "103", percentile: 65, leagueAvg: "100" },
        { name: "Location+", value: "89", percentile: 28, leagueAvg: "100" },
        { name: "WHIP", value: "1.31", percentile: 42, leagueAvg: "1.24" },
      ],
      analysis: "Above-average stuff (103 Stuff+) undermined by below-average command (89 Location+). 14-point stuff/location gap creates vulnerability in crucial counts.",
      pitchArsenal: [
        { pitch: "Sinker", usage: 35, velocity: 95.2, whiffPct: 21, woba: 0.365 },
        { pitch: "Cutter", usage: 28, velocity: 90.8, whiffPct: 26, woba: 0.325 },
        { pitch: "Sweeper", usage: 18, velocity: 84.1, whiffPct: 33, woba: 0.295 },
        { pitch: "4-Seam FB", usage: 15, velocity: 95.0, whiffPct: 23, woba: 0.39 },
        { pitch: "Curveball", usage: 4, velocity: 79.8, whiffPct: 28, woba: 0.315 },
      ],
      trend: [
        { month: "Apr", value: 126 }, { month: "May", value: 115 }, { month: "Jun", value: 99 }, { month: "Jul", value: 106 },
      ],
      dataQuality: { confidence: 94, sampleSize: "126.1 IP", lastUpdated: "2025-07-15" },
    },
    {
      player: "Bryan Reynolds", impact: 0.6, type: "Regression Concern / Trade Candidate",
      recommendation: "Mechanical assessment for contact quality decline. Evaluate trade value before deadline.",
      timeline: "Immediate evaluation needed",
      standardMetric: "wRC+", standardValue: 88,
      metrics: [
        { name: "wOBA", value: ".298", percentile: 32, leagueAvg: ".315" },
        { name: "Barrel Rate", value: "3.8%", percentile: 15, leagueAvg: "7.1%" },
        { name: "Launch Angle", value: "11.2°", percentile: 58, leagueAvg: "12.4°" },
        { name: "Exit Velocity", value: "87.9 MPH", percentile: 41, leagueAvg: "88.9 MPH" },
      ],
      analysis: "Significant regression from previous seasons. Contact quality decline and reduced power suggest mechanical issues or injury. Trade value may be depreciating.",
      trend: [
        { month: "Apr", value: 78 }, { month: "May", value: 92 }, { month: "Jun", value: 95 }, { month: "Jul", value: 88 },
      ],
      dataQuality: { confidence: 91, sampleSize: "398 PA", lastUpdated: "2025-07-15" },
    },
    {
      player: "Andrew McCutchen", impact: 1.0, type: "Veteran Stabilizer",
      recommendation: "Optimize DH at-bats against LHP. Mentor role for young hitters.",
      timeline: "Season-long",
      standardMetric: "wRC+", standardValue: 108,
      metrics: [
        { name: "Launch Angle", value: "14.2°", percentile: 78, leagueAvg: "12.0°" },
        { name: "wOBA vs LHP", value: ".358", percentile: 82, leagueAvg: ".315" },
        { name: "OBP", value: ".324", percentile: 58, leagueAvg: ".318" },
        { name: "K%", value: "22.1%", percentile: 62, leagueAvg: "23.7%" },
      ],
      analysis: "Veteran presence providing steady production. Maintains optimal launch angle and professional plate approach. Valuable mentor for young players.",
      trend: [
        { month: "Apr", value: 98 }, { month: "May", value: 115 }, { month: "Jun", value: 105 }, { month: "Jul", value: 108 },
      ],
      dataQuality: { confidence: 87, sampleSize: "245 PA", lastUpdated: "2025-07-15" },
    },
  ],

  outlierMetrics: [
    {
      category: "Launch Angle Variance",
      description: "Consistency of contact angle — lower variance = more repeatable swing mechanics",
      players: [
        { name: "Bryan Reynolds", value: 8.2, percentile: 22, status: "concern" },
        { name: "Ke'Bryan Hayes", value: 7.8, percentile: 28, status: "concern" },
        { name: "Oneil Cruz", value: 4.1, percentile: 75, status: "good" },
        { name: "Andrew McCutchen", value: 3.9, percentile: 78, status: "good" },
      ],
      leagueAverage: 5.8,
      insight: "Reynolds and Hayes show 40%+ higher variance than elite contact hitters, reducing barrel rate consistency.",
      actionable: "4-week biomechanical assessment focusing on swing plane consistency and launch angle control.",
    },
    {
      category: "Chase Rate Gap",
      description: "Percentage of swings on pitches outside the strike zone — indicates plate discipline quality",
      players: [
        { name: "Team Average", value: 31.4, percentile: 32, status: "concern" },
        { name: "League Average", value: 28.1, percentile: 50, status: "neutral" },
      ],
      leagueAverage: 28.1,
      insight: "Pirates chase rate exceeds league average by 3.3 pp, contributing to poor situational hitting and reduced walk rates.",
      actionable: "Comprehensive plate discipline program with zone recognition drills and two-strike approach work.",
    },
    {
      category: "2-0 Count Deficit",
      description: "Performance in hitter-favorable counts (⚠️ smaller sample, N=987)",
      players: [
        { name: "Pirates Performance", value: 7.2, percentile: 22, status: "concern" },
        { name: "League Average", value: 11.8, percentile: 50, status: "neutral" },
      ],
      leagueAverage: 11.8,
      insight: "39% relative deficit in 2-0 count situations. Note: sample size (N=987) is marginal for firm conclusions — monitor through August before committing resources.",
      actionable: "Video study of optimal 2-0 decisions and pitch-type hunting zones. Low-cost intervention worth piloting given potential upside.",
    },
  ],

  actionPlan: {
    initiatives: [
      {
        category: "Offense", name: "Plate Discipline & Contact Quality",
        duration: "6 weeks", totalWins: 2.5, range: "1.4–3.6",
        status: "Prioritized",
        tasks: [
          { summary: "Team chase rate (31.4%) leads to weak contact and rally-killing strikeouts.", details: "Data-driven program using pitch-recognition drills to reduce chase rate below 29%, boosting OBP and run production.", wins: 1.3, range: "0.8–1.8" },
          { summary: "Reynolds and Hayes have inconsistent launch angles, limiting power output.", details: "Biomechanical assessments and targeted machine work to reduce LA variance by 25%, producing more consistent hard contact.", wins: 1.2, range: "0.6–1.8" },
        ],
      },
      {
        category: "Pitching", name: "Leverage & Command Optimization",
        duration: "4 weeks", totalWins: 1.4, range: "0.6–2.1",
        status: "Prioritized",
        tasks: [
          { summary: "Bednar used in only 65% of high-leverage situations (LI ≥ 1.5), below modeled optimal of ~80%.", details: "Deploy Bednar in situations with LI ≥ 1.5 more consistently, per RE24 leverage framework. Note: gains are modest (+0.1 to +0.5) due to inherent unpredictability of game situations.", wins: 0.3, range: "0.1–0.5" },
          { summary: "Keller's above-average stuff undermined by below-average command.", details: "Mechanical work and breaking ball development to raise Location+ to 95+, turning raw ability into consistent results.", wins: 1.1, range: "0.5–1.6" },
        ],
      },
      {
        category: "Defense", name: "Positional & Framing Refinement",
        duration: "Ongoing", totalWins: 1.1, range: "0.5–1.6",
        status: "Planning",
        tasks: [
          { summary: "Outfield defense can be further optimized through better positioning.", details: "Leverage spray chart data to refine outfield alignments per-hitter, targeting Outfield OAA improvement from +2 to +5.", wins: 0.7, range: "0.3–1.0" },
          { summary: "Catchers are below-average in pitch framing, costing borderline strikes.", details: "Specialized receiving mechanics program to improve 'Stolen Strike' rate to league average.", wins: 0.4, range: "0.2–0.6" },
        ],
      },
      {
        category: "Roster", name: "Trade Deadline Optimization",
        duration: "By July 30", totalWins: 1.1, range: "0.5–1.8",
        status: "Prioritized",
        tasks: [
          { summary: "Bednar (1 yr control) and Chapman (rental) are prime sell candidates for bullpen-needy contenders.", details: "Bednar's 3.24 ERA / 3.12 FIP should command a top-100 prospect. Chapman is a salary dump with lottery-ticket prospect return. Combined return strengthens 2026-27 pipeline.", wins: 0.6, range: "0.3–1.0" },
          { summary: "Reynolds' trade value is depreciating — evaluate sell window now.", details: "2 years of control at $7.4M AAV is attractive, but 2025 regression (.298 wOBA, 3.8% barrel rate) erodes leverage. If mechanical, hold and fix. If structural, sell before August.", wins: 0.5, range: "0.2–0.8" },
        ],
      },
    ],
  },

  defensiveMetrics: [
    { position: "3B", drs: 15, player: "Hayes", grade: "Elite", outs: "+12 OAA", context: "Generational range and arm" },
    { position: "SS", drs: 5, player: "Cruz", grade: "Above Avg", outs: "+4 OAA", context: "Improved routes, elite arm" },
    { position: "CF", drs: 3, player: "Reynolds", grade: "Above Avg", outs: "+2 OAA", context: "Solid routes, average arm" },
    { position: "RF", drs: 1, player: "Triolo", grade: "Average", outs: "0 OAA", context: "Adequate range" },
    { position: "LF", drs: -2, player: "Peguero", grade: "Below Avg", outs: "-1 OAA", context: "Limited range, poor routes" },
    { position: "2B", drs: -1, player: "Castro", grade: "Below Avg", outs: "-3 OAA", context: "Limited range on DPs" },
    { position: "1B", drs: 0, player: "Santana", grade: "Average", outs: "0 OAA", context: "Solid scoops, limited range" },
    { position: "C", drs: -2, player: "Delay", grade: "Below Avg", outs: "-1 OAA", context: "Below-avg framing" },
  ],

  defensiveNotes: [
    { title: "Outfield Jump & Route Efficiency", insight: "Oneil Cruz has dramatically improved his Outfield Jump, going from -3.1 ft vs average to -0.5 ft, turning a major weakness into a strength and accumulating +2 OAA.", color: "green" },
    { title: "Catcher Framing Deficit", insight: "Team catchers are below average in framing runs, costing the pitching staff borderline strikes. A clear area for improvement to support the elite pitching staff.", color: "orange" },
    { title: "Left Field Vulnerability", insight: "Peguero's defensive metrics in LF (-2 DRS, -1 OAA) make it the weakest position on the diamond. Worth evaluating platoon or replacement options.", color: "orange" },
  ],
};


// ─── REUSABLE COMPONENTS ────────────────────────────────────────────────────

const TooltipWrapper = ({ children, tooltipText }) => {
  if (!tooltipText) return <>{children}</>;
  return (
    <div className="relative flex items-center gap-1 group">
      {children}
      <Info size={12} className="text-gray-500 cursor-pointer" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-black/90 text-white text-xs rounded-lg p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 border border-yellow-400">
        {tooltipText}
      </div>
    </div>
  );
};

const TrendIndicator = ({ current, previous, isPositive = true }) => {
  if (typeof current !== "number" || typeof previous !== "number") return null;
  const trend = current - previous;
  const isGood = isPositive ? trend > 0 : trend < 0;
  return (
    <span className={`text-xs ml-2 ${isGood ? "text-green-400" : "text-red-400"}`}>
      {trend > 0 ? "↗" : "↘"} {Math.abs(trend).toFixed(2)}
    </span>
  );
};

const CollapsibleSection = ({ title, children, icon: Icon, defaultOpen = true }) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  return (
    <div className="bg-black/40 border border-gray-600 rounded-xl">
      <button className="w-full flex justify-between items-center p-4" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6" />} {title}
        </h3>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && <div className="p-6 pt-0">{children}</div>}
    </div>
  );
};

const KeyInsights = ({ insights }) => (
  <div className="bg-black/40 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
    <h3 className="text-lg font-bold text-yellow-400 mb-2">Key Insights</h3>
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
      {insights.map((insight, i) => (
        <li key={i}>{insight}</li>
      ))}
    </ul>
  </div>
);

const LeagueRankIndicator = ({ rank, total }) => {
  const percentage = ((total - rank + 1) / total) * 100;
  const getColor = () => {
    if (percentage > 66) return "bg-green-500";
    if (percentage > 33) return "bg-orange-500";
    return "bg-red-500";
  };
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>League Rank</span>
        <span>{rank}/{total}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div className={`h-2 rounded-full ${getColor()}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const DataQualityIndicator = ({ confidence, sampleSize, lastUpdated, source = "Multiple" }) => {
  const getColor = (c) => {
    if (c >= 95) return "#22C55E";
    if (c >= 85) return "#3B82F6";
    if (c >= 70) return "#F59E0B";
    return "#EF4444";
  };
  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return (
    <div className="flex items-center gap-2 mt-2 text-xs">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(confidence) }} title={`${confidence}% confidence`} />
      <span className="text-gray-400">{confidence}% conf • n={sampleSize} • {fmt(lastUpdated)}</span>
      <span className="text-gray-500">({source})</span>
    </div>
  );
};

const PirateTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border-2 border-yellow-400 rounded-lg p-3 text-sm shadow-xl z-50">
        <p className="mb-2 font-bold text-yellow-400">{label}</p>
        {payload.map((pl, i) => (
          <div key={i} style={{ color: pl.stroke || pl.color }} className="flex justify-between gap-4">
            <span>{pl.name}:</span>
            <span className="font-semibold">{pl.value && pl.value.toFixed ? pl.value.toFixed(3) : pl.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PercentileBar = ({ percentile }) => {
  const getColor = (p) => {
    if (p >= 90) return "#22C55E";
    if (p >= 75) return "#3B82F6";
    if (p >= 40) return "#FDB827";
    if (p >= 25) return "#F97316";
    return "#EF4444";
  };
  return (
    <div className="w-full space-y-1">
      <div className="bg-gray-700 rounded-full h-2 relative">
        <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${percentile}%`, backgroundColor: getColor(percentile) }} />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{percentile >= 75 ? "Elite" : percentile >= 50 ? "Above Avg" : percentile >= 25 ? "Below Avg" : "Poor"}</span>
        <span className="text-gray-400">{percentile}th %ile</span>
      </div>
    </div>
  );
};


// ─── METRIC CARD ────────────────────────────────────────────────────────────

const MetricCard = ({ title, value, previous, delta, subtitle, trend = [], status, insight, methodology, dataQuality, onClick, rank, total }) => {
  const getStatusColor = () => {
    if (status === "critical") return "#EF4444";
    if (status === "warning") return "#F97316";
    if (status === "good") return "#22C55E";
    if (delta === undefined) return "#FDB827";
    return delta > 0 ? "#22C55E" : "#EF4444";
  };
  return (
    <div className={`bg-black/60 border border-gray-600 p-4 rounded-xl transition-all relative ${onClick ? "cursor-pointer hover:border-yellow-400 hover:bg-black/80" : ""}`} onClick={onClick}>
      {dataQuality && (
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${dataQuality.confidence >= 95 ? "bg-green-500" : dataQuality.confidence >= 85 ? "bg-blue-500" : dataQuality.confidence >= 70 ? "bg-yellow-500" : "bg-red-500"}`} title={`Data Quality: ${dataQuality.confidence}%`} />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <TooltipWrapper tooltipText={metricDefinitions[title]}>
          <span className="text-xs text-gray-300 uppercase tracking-wide font-medium pr-4">{title}</span>
        </TooltipWrapper>
        {trend.length > 0 && (
          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <Line type="monotone" dataKey="value" stroke={getStatusColor()} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1 flex items-center">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
      {delta !== undefined && (
        <div className="flex items-center gap-1 text-sm font-medium mb-2" style={{ color: getStatusColor() }}>
          {delta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta > 0 ? "+" : ""}{delta}% vs League
        </div>
      )}
      {insight && <div className="text-xs text-gray-300 leading-relaxed border-t border-gray-700 pt-2 mb-2">{insight}</div>}
      {methodology && (
        <div className="text-xs text-blue-300 leading-relaxed border-t border-blue-900/50 pt-2 mb-2 bg-blue-900/20 p-2 rounded">
          <strong>Methodology:</strong> {methodology}
        </div>
      )}
      {rank && total && <LeagueRankIndicator rank={rank} total={total} />}
      {dataQuality && <DataQualityIndicator {...dataQuality} />}
    </div>
  );
};


// ─── STRIKE ZONE HEATMAP ────────────────────────────────────────────────────

const StrikeZoneHeatmap = ({ zoneData }) => {
  const [selectedMetric, setSelectedMetric] = useState("woba");
  const zoneGrid = [
    [
      { zone: "Corners", woba: 0.295, wobaRange: "±.055", frequency: 15, sampleSize: 67, color: "#3B82F6" },
      { zone: "Upper Zone", woba: 0.195, wobaRange: "±.060", frequency: 15, sampleSize: 61, color: "#22C55E" },
      { zone: "Corners", woba: 0.295, wobaRange: "±.055", frequency: 15, sampleSize: 58, color: "#3B82F6" },
    ],
    [
      { zone: "Outer Third", woba: 0.285, wobaRange: "±.055", frequency: 18, sampleSize: 73, color: "#F97316" },
      { zone: "Heart", woba: 0.425, wobaRange: "±.050", frequency: 22, sampleSize: 89, color: "#EF4444" },
      { zone: "Outer Third", woba: 0.285, wobaRange: "±.055", frequency: 18, sampleSize: 71, color: "#F97316" },
    ],
    [
      { zone: "Corners", woba: 0.315, wobaRange: "±.058", frequency: 31, sampleSize: 42, color: "#3B82F6" },
      { zone: "Lower Zone", woba: 0.31, wobaRange: "±.065", frequency: 14, sampleSize: 57, color: "#6B7280" },
      { zone: "Corners", woba: 0.315, wobaRange: "±.058", frequency: 31, sampleSize: 45, color: "#3B82F6" },
    ],
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {["woba", "frequency"].map((m) => (
          <button key={m} onClick={() => setSelectedMetric(m)} className={`px-3 py-1 rounded text-sm ${selectedMetric === m ? "bg-yellow-600 text-black" : "bg-gray-600 text-white"}`}>
            {m === "woba" ? "wOBA (±SE)" : "Frequency %"}
          </button>
        ))}
      </div>
      <div className="w-80 h-80 mx-auto">
        <div className="grid grid-cols-3 gap-1 w-full h-full border-4 border-white rounded-lg p-2 bg-green-800/20">
          {zoneGrid.flat().map((zone, idx) => {
            const value = selectedMetric === "woba" ? zone.woba : zone.frequency;
            const intensity = selectedMetric === "woba" ? Math.min(Math.max((value - 0.15) / 0.35, 0.1), 0.8) : 0.5;
            return (
              <div
                key={idx}
                className="relative border-2 border-white/50 flex flex-col items-center justify-center text-xs font-bold rounded cursor-pointer hover:border-yellow-400 transition-all"
                style={{ backgroundColor: zone.color + Math.round(intensity * 255).toString(16).padStart(2, "0"), minHeight: "85px" }}
                title={`${zone.zone} — N=${zone.sampleSize}`}
              >
                <span className="text-white bg-black/70 px-1 rounded text-xs font-bold">{zone.zone}</span>
                <span className="text-white bg-black/70 px-1 rounded text-xs mt-1">
                  {selectedMetric === "woba" ? value.toFixed(3) : value + "%"}
                </span>
                {selectedMetric === "woba" && <span className="text-yellow-200 text-xs mt-0.5">{zone.wobaRange}</span>}
                <span className="text-gray-200 text-xs mt-0.5">N={zone.sampleSize}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-orange-900/20 border border-orange-500/50 p-3 rounded-lg text-xs text-orange-200">
        <strong>⚠️ Sample Size Warning:</strong> Zone-level wOBA estimates carry standard errors of .050-.065 at these sample sizes (N=42 to N=89). Treat as directional indicators, not precise values. Confidence intervals shown as ±SE.
      </div>
      <div className="flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#22C55E" }} /><span className="text-gray-300">Elite (&lt;.28)</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }} /><span className="text-gray-300">Good (.28-.32)</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#F97316" }} /><span className="text-gray-300">Concern (.32-.40)</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#EF4444" }} /><span className="text-gray-300">Vulnerable (&gt;.40)</span></div>
      </div>
    </div>
  );
};


// ─── SPRAY CHART ────────────────────────────────────────────────────────────

const SprayChart = ({ sprayData }) => {
  const { pullRate, centerRate, oppositeRate, gbFbRatio, groundBallRate, flyBallRate, analysis, recommendation } = sprayData;
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="relative">
        <div className="w-80 h-80 mx-auto relative">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <path d="M 15 285 Q 150 15 285 285 Z" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M 15 285 Q 70 50 150 150 L 150 285 Z" fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="2" strokeDasharray="3,3" />
            <text x="60" y="180" className="text-sm font-bold" fill="#EF4444">Pull</text>
            <text x="60" y="195" className="text-lg font-bold" fill="#EF4444">{pullRate}%</text>
            <path d="M 100 150 Q 150 30 200 150 L 150 285 Z" fill="rgba(59, 130, 246, 0.2)" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3,3" />
            <text x="125" y="100" className="text-sm font-bold" fill="#3B82F6">Center</text>
            <text x="135" y="115" className="text-lg font-bold" fill="#3B82F6">{centerRate}%</text>
            <path d="M 200 150 Q 230 50 285 285 L 150 285 Z" fill="rgba(34, 197, 94, 0.2)" stroke="#22C55E" strokeWidth="2" strokeDasharray="3,3" />
            <text x="220" y="180" className="text-sm font-bold" fill="#22C55E">Oppo</text>
            <text x="225" y="195" className="text-lg font-bold" fill="#22C55E">{oppositeRate}%</text>
            <circle cx="150" cy="270" r="4" fill="#FDB827" stroke="#27251F" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 bg-black/80 text-white p-3 rounded-lg border border-gray-500">
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">{gbFbRatio}</div>
            <div className="text-xs">GB/FB Ratio</div>
            <div className="text-xs mt-1 text-gray-300">GB: {groundBallRate}% / FB: {flyBallRate}%</div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-red-900/30 p-3 rounded-lg border-l-4 border-red-400">
          <span className="text-red-200 font-medium">Pull Rate: {pullRate}%</span>
          <p className="text-red-100 text-xs mt-1">{analysis}</p>
        </div>
        <div className="bg-green-900/30 p-3 rounded-lg border-l-4 border-green-400">
          <span className="text-green-200 font-medium">Recommendation</span>
          <p className="text-green-100 text-xs mt-1">{recommendation}</p>
        </div>
      </div>
    </div>
  );
};


// ─── ACTION PLAN ────────────────────────────────────────────────────────────

const ActionPlanDisplay = ({ initiatives }) => {
  const getStatusColor = (s) => (s === "Prioritized" ? "bg-blue-600" : s === "Planning" ? "bg-orange-600" : "bg-gray-600");
  const getStatusIcon = (s) => (s === "Prioritized" ? <CheckCircle size={16} /> : s === "Planning" ? <Calendar size={16} /> : <Clock size={16} />);

  return (
    <div className="space-y-6">
      {initiatives.map((initiative, idx) => (
        <div key={idx} className="bg-black/40 border border-gray-600 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{initiative.name} ({initiative.category})</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 ${getStatusColor(initiative.status)}`}>
                {getStatusIcon(initiative.status)} {initiative.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">+{initiative.totalWins}</div>
              <div className="text-xs text-gray-400">Range: {initiative.range} wins • {initiative.duration}</div>
            </div>
          </div>
          <div className="space-y-3">
            {initiative.tasks.map((task, tIdx) => (
              <div key={tIdx} className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{task.summary}</h4>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">+{task.wins} wins</div>
                    <div className="text-xs text-gray-400">Range: {task.range}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{task.details}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};


// ─── TRADE ASSET TABLE ──────────────────────────────────────────────────────

const TradeAssetDisplay = ({ assets }) => {
  const statusColors = { sell: "text-red-400 bg-red-900/30", evaluate: "text-orange-400 bg-orange-900/30", keep: "text-green-400 bg-green-900/30" };
  return (
    <div className="space-y-4">
      {assets.map((asset, i) => (
        <div key={i} className={`bg-black/40 border border-gray-600 rounded-xl p-5 ${asset.status === "keep" ? "border-green-500/40" : asset.status === "sell" ? "border-red-500/40" : "border-orange-500/40"}`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-white">{asset.player}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[asset.status]}`}>{asset.status.toUpperCase()}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{asset.position} • Age {asset.age} • {asset.contract}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-400">{asset.fwar} fWAR</div>
              <div className="text-xs text-gray-400">{asset.fwarPace} pace</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">Estimated Return</div>
              <div className="text-sm font-medium text-yellow-400">{asset.tradeValue}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Rationale</div>
              <div className="text-xs text-gray-300">{asset.rationale}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


// ─── ONE-PAGE BRIEF ─────────────────────────────────────────────────────────

const OnePageBrief = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="one-page-brief">
      <div className="text-center border-b-2 border-yellow-600 pb-4">
        <h2 className="text-3xl font-bold text-yellow-400">Pittsburgh Pirates — Executive Brief</h2>
        <p className="text-gray-400 text-sm">As of July 15, 2025 • 15 Days to Trade Deadline</p>
      </div>

      <div className="bg-black/60 border border-gray-600 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3">State of the Organization</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          At 38-56 (.404), the Pirates are not competitive in 2025. The pitching staff (108 ERA+, 11th in MLB) anchored by Paul Skenes' Cy Young-caliber season is the organizational strength. The offense ranks 28th in wOBA (.301), driven by a team-wide plate discipline deficit and inconsistent contact quality. With 15 days to the trade deadline, the priority is maximizing asset returns from tradeable veterans while investing in the development pipeline that supports a 2027 contention window.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-black/60 border border-gray-600 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-400">38-56</div>
          <div className="text-xs text-gray-400">.404 Win%</div>
        </div>
        <div className="bg-black/60 border border-gray-600 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">.301</div>
          <div className="text-xs text-gray-400">Team wOBA (28th)</div>
        </div>
        <div className="bg-black/60 border border-gray-600 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">108</div>
          <div className="text-xs text-gray-400">ERA+ (11th)</div>
        </div>
        <div className="bg-black/60 border border-gray-600 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">+4.1–7.8</div>
          <div className="text-xs text-gray-400">Win Upside Range</div>
        </div>
      </div>

      <div className="bg-black/60 border border-gray-600 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3">Top 3 Decisions Before July 30</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <span className="bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <div>
              <div className="text-sm font-bold text-white">Trade Bednar & Chapman to contenders</div>
              <div className="text-xs text-gray-400">Combined return: top-100 prospect + lottery ticket. Clears $15M+ salary and opens bullpen innings for development arms.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-orange-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <div>
              <div className="text-sm font-bold text-white">Evaluate Reynolds: sell or rehabilitate?</div>
              <div className="text-xs text-gray-400">2025 regression (.298 wOBA, 3.8% barrel rate) is eroding trade value. If mechanical, hold and fix. If structural, sell now before further depreciation.</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <span className="bg-yellow-600 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <div>
              <div className="text-sm font-bold text-white">Keller: keep or sell for top prospect package?</div>
              <div className="text-xs text-gray-400">2 years of control at $5.1M makes him the highest-value trade chip after Skenes. Hold if 2026 contention is realistic; sell if timeline is 2027+.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/60 border border-gray-600 rounded-xl p-5">
        <h3 className="text-lg font-bold text-white mb-3">Development Priorities (Non-Trade)</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-900/20 p-3 rounded-lg">
            <div className="font-bold text-blue-400 mb-1">Plate Discipline (+1.4–3.6 wins)</div>
            <div className="text-xs text-gray-300">31.4% chase rate vs 28.1% league. Highest-ROI offensive intervention.</div>
          </div>
          <div className="bg-green-900/20 p-3 rounded-lg">
            <div className="font-bold text-green-400 mb-1">Keller Command (+0.5–1.6 wins)</div>
            <div className="text-xs text-gray-300">103 Stuff+ / 89 Location+. Closing this gap transforms him into a #2 starter.</div>
          </div>
          <div className="bg-purple-900/20 p-3 rounded-lg">
            <div className="font-bold text-purple-400 mb-1">Cruz Launch Angle</div>
            <div className="text-xs text-gray-300">96.3 MPH exit velo (leads MLB) at 9.8° LA. Optimizing to 12°+ unlocks 30+ HR power.</div>
          </div>
        </div>
      </div>
    </div>
  );
};


// ─── MODAL COMPONENTS ───────────────────────────────────────────────────────

const BaseModal = ({ children, onClose }) => {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);
  return children;
};

const PathwayModal = ({ pathway, onClose }) => {
  if (!pathway) return null;
  const getContent = () => {
    switch (pathway.title) {
      case "Win Upside":
        return {
          title: "Win Upside Breakdown (+4.1 to +7.8, central: +6.2)",
          color: "border-green-400", textColor: "text-green-400",
          icon: TrendingUp,
          children: (
            <div className="space-y-4">
              <p className="text-sm">The range reflects interaction effects between initiatives. The low end (4.1) assumes partial implementation with unfavorable regression; the high end (7.8) assumes full adoption with favorable regression.</p>
              <div className="bg-orange-900/20 border border-orange-500/50 p-3 rounded-lg text-xs text-orange-200">
                <strong>Methodology:</strong> Delta-WAR model with 15-25% discount for interaction effects. Range from 10,000 Monte Carlo simulations using historical intervention success rates (plate discipline programs succeed at ~60% rate, mechanical changes at ~40%).
              </div>
              <div className="bg-black/40 p-4 rounded-lg">
                {completeData.winUpsideBreakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                    <span className="font-medium text-gray-200">{item.name}</span>
                    <div className="text-right">
                      <span className="font-bold text-green-400">+{item.wins.toFixed(1)}</span>
                      <span className="text-xs text-gray-400 ml-2">({item.low}–{item.high})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ),
        };
      case "Current Record":
        return {
          title: "Record & Deadline Context",
          color: "border-red-400", textColor: "text-red-400",
          icon: Calendar,
          children: (
            <div className="space-y-4">
              <p className="text-sm">86 wins requires .714 over 68 remaining games (49-19). This is not a realistic target. The organizational focus should be on asset maximization ahead of July 30.</p>
              <div className="bg-black/40 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={completeData.monthlyRecord} aria-label="Monthly Record">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: "#D1D5DB" }} />
                    <YAxis tick={{ fill: "#D1D5DB" }} />
                    <Tooltip content={<PirateTooltip />} />
                    <Legend />
                    <Bar dataKey="wins" fill="#22C55E" name="Wins" />
                    <Bar dataKey="losses" fill="#EF4444" name="Losses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ),
        };
      case "Team wOBA":
        return {
          title: "Offensive Performance Deep Dive",
          color: "border-orange-400", textColor: "text-orange-400",
          icon: BarChart3,
          children: (
            <div className="space-y-4">
              <p className="text-sm">Team wOBA of .301 is 14 points below league average, primarily driven by high chase rate and inconsistent contact. Monthly trend showed improvement through June before slight July regression.</p>
              <div className="bg-black/40 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={completeData.monthlyWoba}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: "#D1D5DB" }} />
                    <YAxis tick={{ fill: "#D1D5DB" }} domain={[0.28, 0.35]} tickFormatter={(t) => t.toFixed(3)} />
                    <Tooltip content={<PirateTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="woba" name="Pirates wOBA" stroke="#FDB827" strokeWidth={2} />
                    <Line type="monotone" dataKey="leagueAvg" name="League Avg" stroke="#6B7280" strokeDasharray="5 5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ),
        };
      case "Pitching ERA+":
        return {
          title: "Pitching Strength Analysis",
          color: "border-blue-400", textColor: "text-blue-400",
          icon: Shield,
          children: (
            <div className="space-y-4">
              <p className="text-sm">108 ERA+ is a significant organizational strength and a source of trade assets. Skenes is untouchable; Keller and Bednar carry substantial deadline value.</p>
              <div className="bg-black/40 p-4 rounded-lg">
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart>
                    <CartesianGrid stroke="#374151" />
                    <XAxis type="number" dataKey="stuff" name="Stuff+" domain={[85, 120]} tick={{ fill: "#d1d5db" }} label={{ value: "Stuff+", position: "insideBottom", offset: -10, style: { fill: "#d1d5db" } }} />
                    <YAxis type="number" dataKey="location" name="Location+" domain={[85, 100]} tick={{ fill: "#d1d5db" }} label={{ value: "Location+", angle: -90, position: "insideLeft", style: { fill: "#d1d5db" } }} />
                    <Tooltip content={<PirateTooltip />} />
                    <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="4 4" />
                    <ReferenceLine y={92.5} stroke="#EF4444" strokeDasharray="4 4" />
                    <Scatter data={completeData.pitchingData.rotation} fill="#FDB827" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          ),
        };
      default: return null;
    }
  };
  const content = getContent();
  if (!content) return null;
  const Icon = content.icon;
  return (
    <BaseModal onClose={onClose}>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className={`bg-gray-900 border-2 ${content.color} rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${content.textColor} flex items-center gap-2`}><Icon className="w-8 h-8" /> {content.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          <div className="text-gray-300">{content.children}</div>
        </div>
      </div>
    </BaseModal>
  );
};

const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;
  const trendLabel = player.standardMetric === "ERA-" ? "ERA- (lower is better)" : "wRC+ (higher is better)";
  return (
    <BaseModal onClose={onClose}>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-400">{player.player} — Deep Dive</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
              <div className="space-y-4">
                {player.metrics?.map((m, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <TooltipWrapper tooltipText={metricDefinitions[m.name]}><span className="text-gray-300 font-medium">{m.name}</span></TooltipWrapper>
                      <div className="text-right"><span className="text-white font-bold">{m.value}</span><div className="text-xs text-gray-400">vs {m.leagueAvg} avg</div></div>
                    </div>
                    <PercentileBar percentile={m.percentile} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Development Strategy</h3>
              <div className="bg-black/40 p-4 rounded-lg space-y-4">
                <div><h4 className="text-sm font-semibold text-blue-200 mb-2">Analysis</h4><p className="text-gray-300 text-sm">{player.analysis}</p></div>
                <div><h4 className="text-sm font-semibold text-green-200 mb-2">Action Plan</h4><p className="text-blue-300 text-sm">{player.recommendation}</p></div>
                <div className="flex items-center gap-2 pt-2 border-t border-gray-700"><span className="text-xs text-gray-400">Projected Impact:</span><span className="text-green-400 font-bold">+{player.impact} wins</span></div>
              </div>
            </div>
          </div>
          {player.pitchArsenal && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pitch Arsenal</h3>
              <div className="overflow-x-auto bg-black/30 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-black/50">
                    <tr><th className="p-3">Pitch</th><th className="p-3">Usage</th><th className="p-3">Velo</th><th className="p-3">Whiff%</th><th className="p-3">wOBA</th><th className="p-3">Grade</th></tr>
                  </thead>
                  <tbody>
                    {player.pitchArsenal.map((p, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        <td className="p-3 font-medium text-white">{p.pitch}</td>
                        <td className="p-3 text-gray-300">{p.usage}%</td>
                        <td className="p-3 text-gray-300">{p.velocity} mph</td>
                        <td className="p-3 text-gray-300">{p.whiffPct}%</td>
                        <td className={`p-3 font-bold ${p.woba > 0.32 ? "text-red-400" : p.woba > 0.28 ? "text-yellow-400" : "text-green-400"}`}>{p.woba.toFixed(3)}</td>
                        <td className="p-3 text-xs">
                          {p.woba > 0.32 ? <span className="bg-red-900/30 text-red-200 px-2 py-1 rounded">Needs Work</span>
                            : p.woba < 0.25 ? <span className="bg-green-900/30 text-green-200 px-2 py-1 rounded">Elite</span>
                            : <span className="bg-blue-900/30 text-blue-200 px-2 py-1 rounded">Solid</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {player.trend && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Trend: {trendLabel}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={player.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" tick={{ fill: "#D1D5DB", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#D1D5DB", fontSize: 12 }} domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip content={<PirateTooltip />} />
                  <ReferenceLine y={100} stroke="#6B7280" strokeDasharray="3 3" label={{ value: "Avg (100)", position: "right", fill: "#6B7280", fontSize: 10 }} />
                  <Line type="monotone" dataKey="value" stroke="#FDB827" strokeWidth={3} name={player.standardMetric} />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-xs text-gray-400 mt-2 text-center">
                {player.standardMetric === "ERA-" ? "Below 100 = better than average" : "Above 100 = better than average"} • Reference line at 100 (league average)
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};


// ─── MAIN APP ───────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("brief");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const handleShareLink = async () => {
    const url = "https://buccos-analytics.com/dashboard-2025-report";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setShowCopyConfirm(true);
    setTimeout(() => setShowCopyConfirm(false), 2000);
  };

  const handleExportInsights = () => {
    const insights = {
      executiveBrief: {
        record: "38-56 (.404)",
        wOBA: ".301 (28th)",
        eraPlus: "108 (11th)",
        winUpside: { central: 6.2, range: [4.1, 7.8] },
        primaryRecommendation: "Sell-mode: trade Bednar, Chapman; evaluate Reynolds, Keller",
      },
      tradeAssets: completeData.tradeAssets.map((a) => ({ player: a.player, status: a.status, value: a.tradeValue, contract: a.contract })),
      actionItems: completeData.actionPlan.initiatives.map((i) => ({ name: i.name, category: i.category, wins: i.totalWins, range: i.range })),
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(insights, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pirates_executive_brief_2025-07-15.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const navigation = [
    { id: "brief", label: "One-Page Brief", icon: FileText },
    { id: "executive", label: "Executive Summary", icon: TrendingUp },
    { id: "trades", label: "Trade Assets", icon: DollarSign },
    { id: "offense", label: "Offense", icon: BarChart3 },
    { id: "pitching", label: "Pitching", icon: Shield },
    { id: "bullpen", label: "Bullpen", icon: Zap },
    { id: "defense", label: "Defense", icon: Anchor },
    { id: "players", label: "Players", icon: Users },
    { id: "outliers", label: "Outlier Metrics", icon: Eye },
    { id: "actions", label: "Action Plan", icon: Award },
  ];

  return (
    <>
      <style>{`
        .high-contrast { background: #000 !important; color: #FFF !important; }
        .high-contrast .bg-black\\/90, .high-contrast .bg-black\\/60, .high-contrast .bg-black\\/40, .high-contrast .bg-black\\/30, .high-contrast .bg-gray-900 { background: #111 !important; border-color: #FFF !important; }
        .high-contrast .text-gray-300, .high-contrast .text-gray-400, .high-contrast .text-gray-500 { color: #DDD !important; }
        .high-contrast .bg-yellow-600 { background: #FF0 !important; color: #000 !important; }
        .high-contrast .text-yellow-400 { color: #FF0 !important; }
        @media print { nav, header, footer, .no-print { display: none !important; } main { padding: 0 !important; } }
      `}</style>
      <div className={`min-h-screen ${isHighContrast ? "high-contrast" : ""}`} style={{ background: "linear-gradient(135deg, #27251F 0%, #1E1E1E 50%, #27251F 100%)", color: "#F9FAFB" }}>
        {showCopyConfirm && <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">Link copied!</div>}

        <div className="bg-blue-900/20 border-b border-blue-500/30 px-6 py-2 no-print">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
            <span className="text-blue-200">📊 Data as of July 15, 2025 • Last Updated: 11:59 PM ET • <strong className="text-red-300">PROOF OF CONCEPT — Static Data</strong></span>
            <span className="text-blue-300">94 games • 58% season • 15 days to trade deadline</span>
          </div>
        </div>

        <header className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 shadow-2xl no-print">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Anchor className="w-12 h-12 text-black" />
              <div>
                <h1 className="text-4xl font-bold text-black">Pittsburgh Pirates</h1>
                <p className="text-xl text-black/80">Performance Intelligence Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsHighContrast(!isHighContrast)} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30" title="Toggle High Contrast">
                {isHighContrast ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => window.print()} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30"><FileDown size={18} /> Print Brief</button>
              <button onClick={handleShareLink} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30"><Share2 size={18} /> Share</button>
              <button onClick={handleExportInsights} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30"><Download size={18} /> Export JSON</button>
            </div>
          </div>
        </header>

        <nav className="bg-black/90 border-b-2 border-yellow-600 no-print">
          <div className="max-w-7xl mx-auto flex overflow-x-auto">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`${activeTab === id ? "bg-yellow-600 text-black font-bold border-b-4 border-yellow-400" : "text-yellow-100 hover:bg-black/50 hover:text-white"} px-5 py-4 flex items-center gap-2 whitespace-nowrap transition-all border-b-4 border-transparent text-sm`}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6">

          {/* ─── ONE-PAGE BRIEF ─── */}
          {activeTab === "brief" && <OnePageBrief />}

          {/* ─── EXECUTIVE SUMMARY ─── */}
          {activeTab === "executive" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Win upside range: +4.1 to +7.8 (central: +6.2). Reflects interaction effects and implementation uncertainty.",
                "At 38-56, the organization is in sell-mode. Trade deadline asset maximization is the top priority.",
                "Offense (28th in wOBA) is the primary weakness; pitching (11th in ERA+) is the strength and source of trade value.",
              ]} />
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-yellow-400 mb-4">Strategic Assessment: July 15, 2025</h2>
                <p className="text-xl text-gray-300">38-56 (.404) | Sell-Mode Evaluation | 15 Days to Deadline</p>
                <div className="mt-4 bg-red-900/30 border border-red-500 rounded-lg p-3">
                  <p className="text-red-200 text-sm"><strong>Organizational Posture:</strong> Not competitive in 2025. Priority is trade deadline asset maximization and development pipeline investment for a 2027 contention window.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {completeData.executive.map((m, i) => <MetricCard key={i} {...m} onClick={() => setSelectedPathway(m)} />)}
              </div>
            </div>
          )}

          {/* ─── TRADE ASSETS ─── */}
          {activeTab === "trades" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Bednar and Chapman are the clearest sell candidates — bullpen-needy contenders will pay.",
                "Reynolds' trade value is depreciating. Mechanical assessment needed before deadline decision.",
                "Keller's 2 years of control at $5.1M makes him the highest-value chip after Skenes.",
                "Skenes is untouchable. No realistic return justifies moving a franchise-caliber ace with 5+ years of control.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Trade Deadline Asset Evaluation</h2>
              <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg text-sm text-blue-200 mb-4">
                <strong>Framework:</strong> Assets evaluated on current fWAR, pace, years of control, contract value, and market demand. Trade returns estimated based on recent comparable deadline deals and current prospect market dynamics.
              </div>
              <TradeAssetDisplay assets={completeData.tradeAssets} />
            </div>
          )}

          {/* ─── OFFENSE ─── */}
          {activeTab === "offense" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Chase rate (31.4%) is 3.3pp worse than league average — highest-ROI offensive fix.",
                "High launch angle variance for Reynolds and Hayes limits power consistency.",
                "2-0 count deficit is real but sample size (N=987) is marginal. Monitor before major investment.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Offensive Analysis</h2>
              <CollapsibleSection title="Critical Development Areas" icon={AlertTriangle}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-black/50">
                      <tr><th className="p-3">Metric</th><th className="p-3">Pirates</th><th className="p-3">League</th><th className="p-3">Sample</th><th className="p-3">Confidence</th><th className="p-3">Recommendation</th></tr>
                    </thead>
                    <tbody>
                      {completeData.offensiveMetrics.map((m, i) => (
                        <tr key={i} className="border-b border-gray-700">
                          <td className="p-3 font-medium text-white">{m.metric}</td>
                          <td className="p-3 text-red-300 font-bold">{m.pirates}</td>
                          <td className="p-3 text-gray-300">{m.league}</td>
                          <td className="p-3 text-blue-300 text-xs">{m.sampleSize}</td>
                          <td className="p-3 text-xs">
                            <span className={`px-2 py-0.5 rounded ${m.dataQuality.confidence >= 90 ? "bg-green-900/30 text-green-300" : m.dataQuality.confidence >= 80 ? "bg-blue-900/30 text-blue-300" : "bg-orange-900/30 text-orange-300"}`}>
                              {m.dataQuality.confidence}%
                            </span>
                          </td>
                          <td className="p-3 text-green-300 text-xs max-w-xs">{m.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
              <div className="grid md:grid-cols-2 gap-6">
                <CollapsibleSection title="Strike Zone Analysis"><StrikeZoneHeatmap zoneData={completeData.strikezone} /></CollapsibleSection>
                <CollapsibleSection title="Monthly wOBA Trend">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={completeData.monthlyWoba} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" tick={{ fill: "#D1D5DB" }} />
                      <YAxis tick={{ fill: "#D1D5DB" }} domain={[0.28, 0.35]} tickFormatter={(t) => t.toFixed(3)} />
                      <Tooltip content={<PirateTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="woba" name="Pirates wOBA" stroke="#FDB827" strokeWidth={2} />
                      <Line type="monotone" dataKey="leagueAvg" name="League Avg" stroke="#6B7280" strokeDasharray="5 5" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CollapsibleSection>
              </div>
            </div>
          )}

          {/* ─── PITCHING ─── */}
          {activeTab === "pitching" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Staff excels at limiting dangerous contact (6.2% Barrel% vs 7.8% league).",
                "Keller's 14-point Stuff+/Location+ gap is the primary development target.",
                "Staff Chase Contact % (52.8%) is elite, well below league average (59.8%).",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Pitching Analysis</h2>
              <CollapsibleSection title="Rotation" icon={Shield}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-black/50"><tr><th className="p-3">Pitcher</th><th className="p-3">IP</th><th className="p-3">ERA</th><th className="p-3">FIP</th><th className="p-3">Stuff+</th><th className="p-3">Loc+</th><th className="p-3">K%</th><th className="p-3">Impact</th></tr></thead>
                    <tbody>
                      {completeData.pitchingData.rotation.map((p, i) => (
                        <tr key={i} className="border-b border-gray-700 hover:bg-gray-800/30">
                          <td className="p-3 font-medium text-white">{p.name}</td>
                          <td className="p-3 text-gray-300">{p.ip}</td>
                          <td className="p-3 text-gray-300">{p.era}</td>
                          <td className="p-3 text-gray-300">{p.fip}</td>
                          <td className="p-3 font-bold" style={{ color: p.stuff > 105 ? "#22C55E" : p.stuff > 95 ? "#3B82F6" : "#F97316" }}>{p.stuff}</td>
                          <td className="p-3 font-bold" style={{ color: p.location > 90 ? "#22C55E" : p.location > 85 ? "#3B82F6" : "#EF4444" }}>{p.location}</td>
                          <td className="p-3 text-gray-300">{p.kRate}%</td>
                          <td className="p-3 text-green-400 font-bold">+{p.wins}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CollapsibleSection>
              <CollapsibleSection title="Advanced Metrics">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {completeData.pitchingData.advancedMetrics.map((m, i) => (
                    <div key={i} className={`p-4 rounded-lg bg-gray-800/50 border-l-4 ${m.status === "good" ? "border-green-400" : "border-orange-400"}`}>
                      <h4 className="text-sm font-bold text-gray-300">{m.name}</h4>
                      <div className="text-2xl font-bold text-white my-1">{m.pirates}%</div>
                      <div className="text-xs text-gray-400 mb-2">League: {m.league}%</div>
                      <p className="text-xs text-gray-300">{m.insight}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
              <div className="grid md:grid-cols-2 gap-6">
                <CollapsibleSection title="Stuff+ vs Location+ Matrix">
                  <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                      <CartesianGrid stroke="#374151" />
                      <XAxis type="number" dataKey="stuff" name="Stuff+" domain={[85, 120]} tick={{ fill: "#d1d5db" }} label={{ value: "Stuff+ (Raw Ability)", position: "insideBottom", offset: -15, style: { fill: "#d1d5db" } }} />
                      <YAxis type="number" dataKey="location" name="Location+" domain={[85, 100]} tick={{ fill: "#d1d5db" }} label={{ value: "Location+ (Command)", angle: -90, position: "insideLeft", offset: -5, style: { fill: "#d1d5db" } }} />
                      <Tooltip content={<PirateTooltip />} />
                      <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="4 4" />
                      <ReferenceLine y={92.5} stroke="#EF4444" strokeDasharray="4 4" />
                      <Scatter data={completeData.pitchingData.rotation} fill="#FDB827" />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-xs text-gray-300 bg-gray-800/50 p-3 rounded-lg space-y-1">
                    <p><strong className="text-green-400">Top-Right:</strong> Elite (high stuff + high command)</p>
                    <p><strong className="text-orange-400">Bottom-Right:</strong> Raw talent, poor command (Keller lives here)</p>
                    <p><strong className="text-blue-400">Top-Left:</strong> Crafty, succeeds with precision</p>
                    <p><strong className="text-red-400">Bottom-Left:</strong> Development needed</p>
                  </div>
                </CollapsibleSection>
                <CollapsibleSection title="Keller Development Case">
                  <div className="space-y-4">
                    <div className="bg-red-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-200 mb-2">The Problem</h4>
                      <p className="text-red-100 text-sm">103 Stuff+ / 89 Location+ creates a 14-point gap. Misses lead to .365 wOBA on middle-middle pitches.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-800 p-3 rounded-lg"><div className="text-xs text-gray-400">Stuff+</div><div className="text-2xl font-bold text-blue-400">103</div></div>
                      <div className="bg-gray-800 p-3 rounded-lg"><div className="text-xs text-gray-400">Location+</div><div className="text-2xl font-bold text-red-400">89</div></div>
                      <div className="bg-gray-800 p-3 rounded-lg"><div className="text-xs text-gray-400">MM wOBA</div><div className="text-2xl font-bold text-red-400">.365</div></div>
                    </div>
                    <div className="bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-200 mb-2">The Opportunity (+0.5–1.6 wins)</h4>
                      <p className="text-green-100 text-sm">Raising Location+ to 95+ through mechanical consistency and breaking ball development projects Keller as a solid #2 starter. Also increases trade value significantly.</p>
                    </div>
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          )}

          {/* ─── BULLPEN ─── */}
          {activeTab === "bullpen" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Bednar deployed in 65% of high-leverage (LI ≥ 1.5) situations vs modeled optimal of ~80%.",
                "Bullpen leverage optimization projects +0.1 to +0.5 wins (tempered from prior estimate per RE24 framework).",
                "Bednar and Chapman are prime sell candidates — bullpen arms command premium returns at the deadline.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Bullpen Strategy</h2>
              <CollapsibleSection title="Performance & Usage" icon={Zap}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs text-gray-400 uppercase bg-black/50"><tr><th className="p-3">Reliever</th><th className="p-3">Role</th><th className="p-3">ERA</th><th className="p-3">FIP</th><th className="p-3">Current HiLev%</th><th className="p-3">Target HiLev%</th><th className="p-3">Impact (range)</th></tr></thead>
                    <tbody>
                      {completeData.pitchingData.bullpen.map((r, i) => (
                        <tr key={i} className="border-b border-gray-700">
                          <td className="p-3 font-medium text-white">{r.name}</td>
                          <td className="p-3 text-gray-300">{r.role}</td>
                          <td className="p-3 text-gray-300">{r.era}</td>
                          <td className="p-3 text-gray-300">{r.fip}</td>
                          <td className="p-3 font-bold" style={{ color: r.leverageUsage < r.optimalUsage ? "#EF4444" : "#22C55E" }}>{r.leverageUsage}%</td>
                          <td className="p-3 text-blue-300">{r.optimalUsage}%</td>
                          <td className="p-3 text-green-400">+{r.wins} ({r.low}–{r.high})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 bg-blue-900/20 border border-blue-500/50 p-3 rounded-lg text-xs text-blue-200">
                  <strong>Methodology note:</strong> Optimal usage targets derived from RE24 leverage framework. High-leverage defined as LI ≥ 1.5. Research (Tango, Lichtman, Dolphin) suggests total bullpen optimization is worth ~1-2 wins/season for an entire pen. Individual reliever gains are modest. Estimates tempered accordingly and shown as ranges.
                </div>
              </CollapsibleSection>
              <div className="grid md:grid-cols-2 gap-6">
                <CollapsibleSection title="Leverage Usage Gap">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={completeData.pitchingData.bullpen} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                      <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#9CA3AF" }} />
                      <Tooltip content={<PirateTooltip />} />
                      <Legend />
                      <Bar dataKey="leverageUsage" name="Current" fill="#EF4444" />
                      <Bar dataKey="optimalUsage" name="Target" fill="#22C55E" />
                    </BarChart>
                  </ResponsiveContainer>
                </CollapsibleSection>
                <CollapsibleSection title="Trade Deadline Consideration">
                  <div className="space-y-4 text-sm text-gray-300">
                    <p className="p-4 bg-red-900/30 rounded-lg border-l-4 border-red-400">
                      <strong>Sell Signal:</strong> Optimizing Bednar's in-game usage adds +0.1 to +0.5 wins for the remainder of 2025. Trading him to a contender and reinvesting the prospect return into the 2026-27 pipeline likely generates more long-term value.
                    </p>
                    <p className="p-4 bg-orange-900/30 rounded-lg border-l-4 border-orange-400">
                      <strong>Chapman:</strong> Pure rental. Move for whatever prospect capital is available. Opens innings for young arms.
                    </p>
                  </div>
                </CollapsibleSection>
              </div>
            </div>
          )}

          {/* ─── DEFENSE ─── */}
          {activeTab === "defense" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Hayes at 3B (+15 DRS, +12 OAA) is the defensive anchor — elite value.",
                "Catcher framing is a weakness, costing borderline strikes for an already-strong pitching staff.",
                "LF (Peguero) is the weakest defensive position. Evaluate platoon or replacement options.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Defensive Analysis</h2>
              <CollapsibleSection title="Full Defensive Spectrum (DRS by Position)" icon={Anchor}>
                <div className="grid md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={completeData.defensiveMetrics} aria-label="DRS by Position">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="position" tick={{ fill: "#9CA3AF" }} />
                      <YAxis tick={{ fill: "#9CA3AF" }} />
                      <Tooltip content={<PirateTooltip />} />
                      <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
                      <Bar dataKey="drs" fill="#FDB827" name="DRS" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 overflow-y-auto max-h-96">
                    {completeData.defensiveMetrics.map((pos, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <span className="font-medium text-white">{pos.position} — {pos.player}</span>
                          <div className="text-xs text-gray-400">{pos.grade} • {pos.context}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${pos.drs > 0 ? "text-green-400" : pos.drs < 0 ? "text-red-400" : "text-gray-400"}`}>{pos.drs > 0 ? "+" : ""}{pos.drs}</div>
                          <div className="text-xs text-gray-400">{pos.outs}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>
              <CollapsibleSection title="Positional Notes">
                <div className="grid md:grid-cols-3 gap-4">
                  {completeData.defensiveNotes.map((n, i) => (
                    <div key={i} className={`p-4 rounded-lg bg-gray-800/50 border-l-4 ${n.color === "green" ? "border-green-400" : "border-orange-400"}`}>
                      <h4 className="font-semibold text-gray-200 mb-2">{n.title}</h4>
                      <p className="text-sm text-gray-300">{n.insight}</p>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
              <CollapsibleSection title="Spray Chart Analysis"><SprayChart sprayData={completeData.sprayChart} /></CollapsibleSection>
            </div>
          )}

          {/* ─── PLAYERS ─── */}
          {activeTab === "players" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "All player trends now standardized: hitters use wRC+ (above 100 = above avg), pitchers use ERA- (below 100 = above avg).",
                "Skenes is performing at a Cy Young level. Cruz has the highest physical ceiling on the roster.",
                "Reynolds' regression warrants immediate mechanical assessment and trade evaluation.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Player Development Spotlight</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completeData.playerInsights.map((p, i) => (
                  <div key={i} onClick={() => setSelectedPlayer(p)} className="bg-black/40 border border-gray-600 hover:border-yellow-400 p-6 rounded-xl cursor-pointer group transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{p.player}</h3>
                        <p className="text-sm text-yellow-400 font-medium">{p.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">+{p.impact}</div>
                        <div className="text-xs text-gray-400">Win Impact</div>
                      </div>
                    </div>
                    <div className="space-y-4 mb-4">
                      {p.metrics.slice(0, 2).map((m, j) => (
                        <div key={j}>
                          <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{m.name}:</span><span className="text-white font-bold">{m.value}</span></div>
                          <PercentileBar percentile={m.percentile} />
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 border-t border-gray-700 pt-3">
                      <div className="flex justify-between mb-2">
                        <span>{p.standardMetric}: <strong className="text-white">{p.standardValue}</strong></span>
                        <span className={p.standardMetric === "ERA-" ? (p.standardValue < 100 ? "text-green-400" : "text-red-400") : (p.standardValue > 100 ? "text-green-400" : "text-red-400")}>
                          {p.standardMetric === "ERA-" ? (p.standardValue < 100 ? "Above Avg" : "Below Avg") : (p.standardValue > 100 ? "Above Avg" : "Below Avg")}
                        </span>
                      </div>
                      <span className="text-yellow-400 font-semibold group-hover:text-yellow-300">Click for deep dive →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── OUTLIERS ─── */}
          {activeTab === "outliers" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Launch angle variance for Reynolds and Hayes is 40%+ above elite contact hitters.",
                "Chase rate gap is a team-wide systematic issue, not driven by one player.",
                "2-0 count deficit is directionally concerning but sample size is marginal — treat as hypothesis, not conclusion.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Outlier Metrics</h2>
              {completeData.outlierMetrics.map((o, i) => (
                <CollapsibleSection title={o.category} key={i}>
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm text-gray-300">{o.description}</p>
                    <div className="text-lg font-bold text-blue-400">League Avg: {o.leagueAverage}</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Performance</h4>
                      <div className="space-y-2">
                        {o.players.map((p, j) => (
                          <div key={j} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                            <span className="text-gray-300">{p.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${p.status === "good" ? "text-green-400" : p.status === "concern" ? "text-red-400" : "text-gray-400"}`}>{p.value}</span>
                              <span className="text-xs text-gray-400">({p.percentile}th)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-900/30 p-3 rounded-lg"><h5 className="font-semibold text-blue-200 mb-1">Impact</h5><p className="text-blue-100 text-sm">{o.insight}</p></div>
                      <div className="bg-green-900/30 p-3 rounded-lg"><h5 className="font-semibold text-green-200 mb-1">Action</h5><p className="text-green-100 text-sm">{o.actionable}</p></div>
                    </div>
                  </div>
                </CollapsibleSection>
              ))}
            </div>
          )}

          {/* ─── ACTION PLAN ─── */}
          {activeTab === "actions" && (
            <div className="space-y-8">
              <KeyInsights insights={[
                "Total win upside: +4.1 to +7.8 (central: +6.2). Ranges reflect interaction effects between initiatives.",
                "New: Trade Deadline Optimization added as a formal initiative category (+0.5 to +1.8 wins via pipeline value).",
                "All estimates shown as ranges, not point values, to reflect implementation uncertainty.",
              ]} />
              <h2 className="text-3xl font-bold text-yellow-400">Action Plan</h2>
              <ActionPlanDisplay initiatives={completeData.actionPlan.initiatives} />
              <div className="bg-purple-900/30 border-2 border-purple-400 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2"><Calendar className="w-6 h-6" /> Aggregate Impact</h3>
                <div className="text-center bg-black/60 p-4 rounded-lg border border-gray-500">
                  <p className="text-lg text-gray-300 mb-2"><strong>Total:</strong> <span className="text-green-400 font-bold text-2xl">+4.1 to +7.8 wins</span> <span className="text-gray-400 text-sm">(central: +6.2)</span></p>
                  <p className="text-sm text-gray-400 mb-2">Current: 38-56 → Best-case 2025 projection: ~46-48 wins above current pace</p>
                  <p className="text-xs text-orange-300">These improvements are building blocks for a 2027 contention window, not a 2025 playoff push. Trade returns compound the developmental value.</p>
                </div>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg text-xs text-blue-200">
                <strong>Model Limitations:</strong> Win estimates are not simply additive. Plate discipline improvements partially overlap with launch angle gains (both improve contact quality). Bullpen optimization gains are contingent on Bednar remaining on the roster. Trade value estimates depend on market dynamics at the deadline. Ranges reflect 10th-90th percentile simulation outcomes; actual results may fall outside these bounds.
              </div>
            </div>
          )}
        </main>

        <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
        <PathwayModal pathway={selectedPathway} onClose={() => setSelectedPathway(null)} />

        <footer className="bg-black/90 border-t-2 border-yellow-600 py-6 mt-12 no-print">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Anchor className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-bold text-white">Pittsburgh Pirates Performance Intelligence Dashboard</span>
              <Anchor className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-gray-400 text-sm">Data compiled and analyzed by Jacob Rafalson, Carnegie Mellon University</p>
            <p className="text-gray-400 text-sm mt-1">
              <strong>Sources:</strong> Statcast • Baseball Savant • FanGraphs • Baseball-Reference |
              <strong> Period:</strong> March 27 – July 15, 2025 |
              <strong> Sample:</strong> 36,347 pitch events
            </p>
            <p className="text-gray-500 text-xs mt-2">⚠️ Proof of concept — static data. Production deployment requires API integration for live updates.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
