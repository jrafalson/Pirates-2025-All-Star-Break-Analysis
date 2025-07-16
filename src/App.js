import React, { useState, useEffect } from "react";
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
  ChevronUp
} from "lucide-react";

// Definitions for advanced metrics for use in tooltips
const metricDefinitions = {
    wOBA: "Weighted On-Base Average (wOBA) measures a hitter's overall offensive value, based on the relative values of each type of hit.",
    "ERA+": "ERA+ adjusts a pitcher's ERA for park factors and the league average, where 100 is average. Above 100 is better than average.",
    "Stuff+": "Stuff+ models the physical characteristics of a pitch (velocity, movement) to rate its 'nastiness' on a scale where 100 is average.",
    "Location+": "Location+ measures a pitcher's ability to command their pitches and hit their intended spots, where 100 is average.",
    FIP: "Fielding Independent Pitching (FIP) estimates a pitcher's ERA based on outcomes they control: strikeouts, walks, and home runs.",
    DRS: "Defensive Runs Saved (DRS) quantifies a player's total defensive value in terms of runs saved or cost.",
    OAA: "Outs Above Average (OAA) measures the cumulative effect of all individual plays a fielder has been credited with.",
    "Barrel %": "The percentage of batted balls that have the ideal combination of exit velocity and launch angle, typically resulting in extra-base hits."
};


// Complete Dataset with Enhanced Context and adjusted verbiage - DATA AS OF JULY 15, 2025
const completeData = {
  executive: [
    {
      title: "Win Upside",
      value: "+6.2",
      previous: 5.8,
      subtitle: "Total available improvement through strategic optimization",
      trend: [
        { month: "Apr", value: 0 }, { month: "May", value: 1.8 }, { month: "Jun", value: 3.9 }, { month: "Jul", value: 6.2 }
      ],
      status: "good",
      insight: "Analytical models identify strategic areas where tactical improvements can deliver measurable wins. Updated projections based on July 15 performance data show more conservative but achievable targets.",
      dataQuality: { confidence: 85, sampleSize: "94 games", lastUpdated: "2025-07-15", source: "Multiple" }
    },
    {
      title: "Current Record",
      value: "38-56",
      previous: 0.410, // Previous winning percentage
      subtitle: "18 games below .500 - Wild Card target: 86-89 wins",
      delta: -32,
      status: "critical",
      insight: "Currently tracking 18 games below .500 pace. To reach wild card contention (86 wins), Pirates must play .714 baseball for remaining 68 games - requiring significant organizational improvements.",
      dataQuality: { confidence: 100, sampleSize: "94 games", lastUpdated: "2025-07-15", source: "MLB Official" }
    },
    {
      title: "Team wOBA",
      value: ".301",
      previous: 0.298,
      subtitle: "Ranks 28th of 30 MLB teams",
      delta: -4.4,
      status: "critical",
      insight: "Offensive production sits 14 points below league average (.315). Primary drivers are poor plate discipline (31.4% chase rate vs 28.1% league) and suboptimal launch angles.",
      dataQuality: { confidence: 95, sampleSize: "3,247 PA", lastUpdated: "2025-07-15", source: "Baseball Savant" },
      rank: 28,
      total: 30
    },
    {
      title: "Pitching ERA+",
      value: "108",
      previous: 106,
      subtitle: "8% above league average - organizational strength",
      delta: 8,
      status: "good",
      insight: "The pitching staff's 4.10 ERA (108 ERA+) represents competitive foundation. Paul Skenes' development and bullpen optimization can extend this advantage.",
      dataQuality: { confidence: 98, sampleSize: "843.2 IP", lastUpdated: "2025-07-15", source: "FanGraphs" },
      rank: 11,
      total: 30
    }
  ],

  offensiveMetrics: [
    {
      metric: "Launch Angle Variance",
      pirates: 8.2,
      league: 5.8,
      players: "Reynolds: 8.2°, Hayes: 7.8° vs Cruz: 4.1°",
      impact: "Inconsistent contact quality reduces barrel rate",
      priority: "High",
      sampleSize: "N=2,847 batted balls",
      recommendation: "Implement 4-week intensive program: daily machine work targeting 10-25° launch window, video analysis of swing plane consistency, and biomechanical assessment to reduce variance by 30%.",
      dataQuality: { confidence: 88, sampleSize: "2,847 BBE", lastUpdated: "2025-07-15" }
    },
    {
      metric: "Chase Rate Gap",
      pirates: 31.4,
      league: 28.1,
      players: "Team-wide systematic issue across lineup",
      impact: "-3.3 percentage points vs league average",
      priority: "High",
      sampleSize: "N=9,241 pitches outside zone",
      recommendation: "Deploy comprehensive plate discipline program: establish strike zone recognition drills, implement two-strike approach modifications, and introduce real-time chase rate feedback during batting practice sessions.",
      dataQuality: { confidence: 94, sampleSize: "9,241 pitches", lastUpdated: "2025-07-15" }
    },
    {
      metric: "2-0 Count Performance",
      pirates: 7.2,
      league: 11.8,
      players: "All hitters underperforming in hitter's counts",
      impact: "-39% relative deficit in advantageous situations",
      priority: "Medium",
      sampleSize: "N=987 2-0 count situations",
      recommendation: "Develop aggressive approach training for favorable counts: video study of optimal 2-0 swing decisions, establish hunting zones for specific pitch types, and track improvement through weekly metrics.",
      dataQuality: { confidence: 82, sampleSize: "987 counts", lastUpdated: "2025-07-15" }
    }
  ],
  
  monthlyWoba: [
      { month: 'Apr', woba: .285, leagueAvg: .315 }, 
      { month: 'May', woba: .298, leagueAvg: .315 }, 
      { month: 'Jun', woba: .307, leagueAvg: .315 }, 
      { month: 'Jul', woba: .301, leagueAvg: .315 }
  ],
  
  monthlyRecord: [
      { month: 'April', wins: 10, losses: 18 },
      { month: 'May', wins: 12, losses: 16 },
      { month: 'June', wins: 11, losses: 17 },
      { month: 'July', wins: 5, losses: 5 },
  ],

  winUpsideBreakdown: [
      { name: "Plate Discipline Program", wins: 1.8, color: "#3B82F6" },
      { name: "Launch Angle Consistency", wins: 0.7, color: "#10B981" },
      { name: "Keller Command Development", wins: 1.1, color: "#F97316" },
      { name: "Bednar Leverage Deployment", wins: 0.5, color: "#A855F7" },
      { name: "Defensive Positioning/Framing", wins: 0.4, color: "#6366F1" },
      { name: "2-0 Count Aggressiveness", wins: 0.6, color: "#EC4899" },
      { name: "Roster Optimization (Trade)", wins: 1.1, color: "#FDB827" },
  ],

  strikezone: [
    {
      zone: "Heart",
      frequency: 22,
      status: "Exploit",
      woba: 0.425,
      sampleSize: 89,
      color: "#EF4444",
      analysis: "Opponents achieve .425 wOBA when attacking the heart of the zone, indicating Pirates hitters are successfully making contact on middle-middle pitches.",
      recommendation: "Continue aggressive approach on heart-of-zone pitches while improving recognition of borderline strikes to avoid expanding the zone unnecessarily."
    },
    {
      zone: "Outer Third",
      frequency: 18,
      status: "Weakness",
      woba: 0.285,
      sampleSize: 73,
      color: "#F97316",
      analysis: "Poor performance on outer-third pitches (.285 wOBA) suggests difficulty handling breaking balls and changeups away from the zone.",
      recommendation: "Implement opposite-field training and two-strike approach work to better handle outer-third offerings and reduce chase rate on pitches outside the zone."
    },
    {
      zone: "Corners",
      frequency: 31,
      status: "Neutral",
      woba: 0.315,
      sampleSize: 125,
      color: "#3B82F6",
      analysis: "Corner performance (.315 wOBA) represents league-average production, indicating adequate approach but room for improvement in borderline pitch recognition.",
      recommendation: "Focus on plate discipline training to improve take rate on borderline pitches while maintaining aggressive approach on strikes in hitting zones."
    },
    {
      zone: "Upper Zone",
      frequency: 15,
      status: "Strength",
      woba: 0.195,
      sampleSize: 61,
      color: "#22C55E",
      analysis: "Excellent performance on elevated pitches (.195 wOBA) demonstrates strong approach against high fastballs and breaking balls in upper zone.",
      recommendation: "Leverage this strength by training hitters to lay off high pitches outside the zone while maintaining aggressive approach on elevated strikes."
    },
    {
      zone: "Lower Zone",
      frequency: 14,
      status: "Neutral",
      woba: 0.310,
      sampleSize: 57,
      color: "#6B7280",
      analysis: "Lower zone performance (.310 wOBA) is adequate but could improve with better approach to breaking balls and off-speed pitches down in the zone.",
      recommendation: "Develop low-zone hitting approach through tee work and machine sessions focused on driving pitches in the bottom third of the strike zone."
    }
  ],

  pitchingData: {
    rotation: [
      { name: "Paul Skenes", ip: 117.1, era: 2.01, stuff: 115, location: 96, mmWoba: 0.245, role: "Ace", wins: 2.8, fip: 2.84, kRate: 34.2 },
      { name: "Mitch Keller", ip: 126.1, era: 4.28, stuff: 103, location: 89, mmWoba: 0.365, role: "Workhorse", wins: 1.1, fip: 4.01, kRate: 23.8 },
      { name: "Luis Ortiz", ip: 98.2, era: 4.05, stuff: 97, location: 91, mmWoba: 0.335, role: "Mid-Rotation", wins: 0.6, fip: 4.18, kRate: 19.4 }
    ],
    bullpen: [
      { name: "David Bednar", saves: 8, era: 3.24, leverageUsage: 65, optimalUsage: 88, wins: 0.5, role: "Closer", fip: 3.12 },
      { name: "Aroldis Chapman", saves: 3, era: 3.89, leverageUsage: 42, optimalUsage: 72, wins: 0.2, role: "Setup", fip: 3.65 },
      { name: "Colin Holderman", saves: 2, era: 3.15, leverageUsage: 38, optimalUsage: 65, wins: 0.3, role: "Setup", fip: 3.28 }
    ],
    advancedMetrics: [
        { name: "First-Pitch Strike %", pirates: 59.8, league: 60.5, status: "warning", insight: "Slightly behind league average in getting ahead of hitters."},
        { name: "Barrel % Allowed", pirates: 6.2, league: 7.8, status: "good", insight: "Excels at limiting the most dangerous type of contact."},
        { name: "CSW % (Called + Swinging Strike)", pirates: 28.9, league: 28.5, status: "good", insight: "Staff effectively fools hitters and commands the zone."},
        { name: "Chase Contact % Allowed", pirates: 52.8, league: 59.8, status: "good", insight: "Pitchers are excellent at getting whiffs on pitches out of the zone."}
    ]
  },

  sprayChart: {
    pullRate: 42,
    centerRate: 35,
    oppositeRate: 23,
    gbFbRatio: 1.15,
    groundBallRate: 53.5,
    flyBallRate: 46.5,
    analysis: "The team's high pull rate (42%) and ground ball tendency make the offense predictable. Opposing defenses can deploy shifts effectively, turning potential hits into routine outs and stifling rallies before they begin.",
    recommendation: "Implement an opposite-field hitting program and focus on elevating the ball to counter defensive shifts and increase extra-base hits."
  },

  playerInsights: [
    {
      player: "Paul Skenes",
      impact: 2.8,
      type: "Cy Young Candidate",
      recommendation: "Continue secondary-pitch development while maintaining fastball dominance",
      timeline: "Season-long",
      metrics: [
        { name: "ERA", value: "2.01", percentile: 98, leagueAvg: "4.05" },
        { name: "WHIP", value: "0.93", percentile: 96, leagueAvg: "1.24" },
        { name: "K/9", value: "10.1", percentile: 89, leagueAvg: "8.8" },
        { name: "FIP", value: "2.84", percentile: 94, leagueAvg: "4.12" }
      ],
      analysis: "Elite rookie posting historically dominant numbers. 2.01 ERA leads MLB among qualified starters. His 98.1 MPH average fastball with exceptional movement creates elite whiff rates.",
      pitchArsenal: [
        { pitch: "4-Seam FB", usage: 64, velocity: 98.1, whiffPct: 32, woba: 0.280 },
        { pitch: "Splinker", usage: 22, velocity: 89.2, whiffPct: 47, woba: 0.185 },
        { pitch: "Slider", usage: 14, velocity: 87.8, whiffPct: 41, woba: 0.260 }
      ],
      trend: [
        { month: "Apr", value: 2.45 }, { month: "May", value: 1.98 }, { month: "Jun", value: 1.89 }, { month: "Jul", value: 2.01 }
      ],
      dataQuality: { confidence: 99, sampleSize: "117.1 IP", lastUpdated: "2025-07-15" }
    },
    {
      player: "Oneil Cruz",
      impact: 1.6,
      type: "Power Development Case",
      recommendation: "Launch angle optimization to unlock elite exit velocity into consistent power production.",
      timeline: "Immediate focus",
      metrics: [
        { name: "Exit Velocity", value: "96.3 MPH", percentile: 100, leagueAvg: "88.9 MPH" },
        { name: "Barrel Rate", value: "22.2%", percentile: 100, leagueAvg: "7.1%" },
        { name: "Launch Angle", value: "9.8°", percentile: 22, leagueAvg: "12.4°" },
        { name: "wOBA", value: ".319", percentile: 45, leagueAvg: ".315" }
      ],
      analysis: "Elite exit velocity (96.3 MPH leads MLB) but suboptimal launch angle (9.8°) limits power production. Set Statcast record with 122.9 MPH home run but only 12 HRs total indicates mechanical inefficiency.",
      trend: [
        { month: "Apr", value: 85 }, { month: "May", value: 108 }, { month: "Jun", value: 98 }, { month: "Jul", value: 102 }
      ],
      dataQuality: { confidence: 92, sampleSize: "384 PA", lastUpdated: "2025-07-15" }
    },
    {
      player: "Ke'Bryan Hayes",
      impact: 1.5,
      type: "Defensive Wizard",
      recommendation: "Focus on elevating the ball to the pull side to better leverage his solid contact skills.",
      timeline: "Off-season",
      metrics: [
        { name: "DRS", value: "+15", percentile: 99, leagueAvg: "0" },
        { name: "OAA", value: "+12", percentile: 98, leagueAvg: "0" },
        { name: "Launch Angle", value: "4.5°", percentile: 15, leagueAvg: "12.0°" },
        { name: "wOBA", value: ".285", percentile: 28, leagueAvg: ".315" }
      ],
      analysis: "A generational defender at third base who saves runs at an elite rate. His offensive game is held back by a high ground ball rate and chronic back issues affecting his swing mechanics.",
      trend: [
        { month: "Apr", value: .275 }, { month: "May", value: .290 }, { month: "Jun", value: .295 }, { month: "Jul", value: .285 }
      ],
      dataQuality: { confidence: 88, sampleSize: "312 PA", lastUpdated: "2025-07-15" }
    },
    {
      player: "Mitch Keller",
      impact: 1.1,
      type: "Command Development Priority",
      recommendation: "Location+ improvement through mechanical consistency work and enhanced breaking ball command",
      timeline: "Remainder of season",
      metrics: [
        { name: "ERA", value: "4.28", percentile: 35, leagueAvg: "4.05" },
        { name: "Stuff+", value: "103", percentile: 65, leagueAvg: "100" },
        { name: "Location+", value: "89", percentile: 28, leagueAvg: "100" },
        { name: "WHIP", value: "1.31", percentile: 42, leagueAvg: "1.24" }
      ],
      analysis: "Above-average stuff (103 Stuff+) undermined by below-average command (89 Location+). 14-point stuff/location gap creates vulnerability in crucial counts.",
      pitchArsenal: [
        { pitch: "Sinker", usage: 35, velocity: 95.2, whiffPct: 21, woba: 0.365 },
        { pitch: "Cutter", usage: 28, velocity: 90.8, whiffPct: 26, woba: 0.325 },
        { pitch: "Sweeper", usage: 18, velocity: 84.1, whiffPct: 33, woba: 0.295 },
        { pitch: "4-Seam FB", usage: 15, velocity: 95.0, whiffPct: 23, woba: 0.390 },
        { pitch: "Curveball", usage: 4, velocity: 79.8, whiffPct: 28, woba: 0.315 }
      ],
      trend: [
        { month: "Apr", value: 5.12 }, { month: "May", value: 4.65 }, { month: "Jun", value: 4.01 }, { month: "Jul", value: 4.28 }
      ],
      dataQuality: { confidence: 94, sampleSize: "126.1 IP", lastUpdated: "2025-07-15" }
    },
    {
      player: "Bryan Reynolds",
      impact: 0.6,
      type: "Regression Concern",
      recommendation: "Mechanical assessment to address significant decline in contact quality and power production",
      timeline: "Immediate evaluation needed",
      metrics: [
        { name: "wOBA", value: ".298", percentile: 32, leagueAvg: ".315" },
        { name: "Barrel Rate", value: "3.8%", percentile: 15, leagueAvg: "7.1%" },
        { name: "Launch Angle", value: "11.2°", percentile: 58, leagueAvg: "12.4°" },
        { name: "Exit Velocity", value: "87.9 MPH", percentile: 41, leagueAvg: "88.9 MPH" }
      ],
      analysis: "Significant regression from previous seasons. Contact quality decline and reduced power output suggest mechanical issues or injury concerns requiring immediate attention.",
      trend: [
        { month: "Apr", value: .285 }, { month: "May", value: .305 }, { month: "Jun", value: .310 }, { month: "Jul", value: .298 }
      ],
      dataQuality: { confidence: 91, sampleSize: "398 PA", lastUpdated: "2025-07-15" }
    },
    {
      player: "Andrew McCutchen",
      impact: 1.0,
      type: "Veteran Stabilizer",
      recommendation: "Optimize DH at-bats against LHP and use as high-leverage pinch hitter.",
      timeline: "Season-long",
      metrics: [
        { name: "Launch Angle", value: "14.2°", percentile: 78, leagueAvg: "12.0°" },
        { name: "wOBA vs LHP", value: ".358", percentile: 82, leagueAvg: ".315" },
        { name: "OBP", value: ".324", percentile: 58, leagueAvg: ".318" },
        { name: "K%", value: "22.1%", percentile: 62, leagueAvg: "23.7%" }
      ],
      analysis: "Veteran presence providing steady production. Maintains optimal launch angle and professional plate approach. Valuable mentor for young players while contributing solid offensive numbers.",
      trend: [
        { month: "Apr", value: .310 }, { month: "May", value: .335 }, { month: "Jun", value: .320 }, { month: "Jul", value: .325 }
      ],
      dataQuality: { confidence: 87, sampleSize: "245 PA", lastUpdated: "2025-07-15" }
    }
  ],

  outlierMetrics: [
    {
      category: "Launch Angle Variance",
      description: "Measures consistency of contact angle - lower variance indicates more repeatable swing mechanics",
      players: [
        { name: "Bryan Reynolds", value: 8.2, percentile: 22, status: "concern" },
        { name: "Ke'Bryan Hayes", value: 7.8, percentile: 28, status: "concern" },
        { name: "Oneil Cruz", value: 4.1, percentile: 75, status: "good" },
        { name: "Andrew McCutchen", value: 3.9, percentile: 78, status: "good" }
      ],
      leagueAverage: 5.8,
      insight: "Reynolds and Hayes show 40%+ higher variance than elite contact hitters, reducing barrel rate consistency and overall offensive production.",
      actionable: "Implement 4-week biomechanical assessment program focusing on swing plane consistency and launch angle control."
    },
    {
      category: "Chase Rate Gap",
      description: "Percentage of swings on pitches outside the strike zone - indicates plate discipline quality",
      players: [
        { name: "Team Average", value: 31.4, percentile: 32, status: "concern" },
        { name: "League Average", value: 28.1, percentile: 50, status: "neutral" }
      ],
      leagueAverage: 28.1,
      insight: "Pirates chase rate exceeds league average by 3.3 percentage points, contributing to poor situational hitting and reduced walk rates.",
      actionable: "Deploy comprehensive plate discipline program with strike zone recognition drills and two-strike approach modifications."
    },
    {
      category: "2-0 Count Deficit",
      description: "Performance in hitter-favorable counts - measures ability to capitalize on advantageous situations",
      players: [
        { name: "Pirates Performance", value: 7.2, percentile: 22, status: "concern" },
        { name: "League Average", value: 11.8, percentile: 50, status: "neutral" }
      ],
      leagueAverage: 11.8,
      insight: "39% relative deficit in 2-0 count situations represents missed opportunities in favorable hitting counts.",
      actionable: "Develop aggressive approach training with video study of optimal 2-0 swing decisions and establish hunting zones for specific pitch types."
    }
  ],

  actionPlan: {
    initiatives: [
      {
        category: "Offense",
        name: "Plate Discipline & Contact Quality",
        duration: "6 weeks",
        totalWins: 2.5,
        status: "Prioritized",
        tasks: [
          {
            summary: "The team's high chase rate (31.4%) leads to weak contact and rally-killing strikeouts.",
            details: "Implement a data-driven program using pitch-recognition drills to reduce the team's chase rate below 29%, which should boost OBP and overall run production.",
            wins: 1.3,
          },
          {
            summary: "Key hitters like Reynolds and Hayes have inconsistent launch angles, limiting their power output.",
            details: "Utilize biomechanical assessments and targeted machine work to reduce launch angle variance by 25%, resulting in more consistent, powerful contact and extra-base hits.",
            wins: 1.2,
          }
        ]
      },
      {
        category: "Pitching",
        name: "Leverage & Command Optimization",
        duration: "4 weeks",
        totalWins: 1.6,
        status: "Prioritized",
        tasks: [
          {
            summary: "David Bednar is used in only 65% of high-leverage situations, below the optimal 88% target.",
            details: "Adopt a data-driven algorithm to deploy Bednar in all situations with a Leverage Index (LI) of 1.6 or higher, maximizing his impact and preventing late-game losses.",
            wins: 0.5,
          },
          {
            summary: "Mitch Keller's above-average 'stuff' is undermined by below-average command, leading to hittable pitches.",
            details: "A dedicated program of mechanical work and breaking ball development aims to raise Keller's Location+ score to 95+, turning his raw ability into consistent results.",
            wins: 1.1,
          }
        ]
      },
      {
        category: "Defense",
        name: "Positional & Framing Refinement",
        duration: "Ongoing",
        totalWins: 1.1,
        status: "Planning",
        tasks: [
           {
            summary: "While solid, the outfield defense can be further optimized through better positioning.",
            details: "Leverage spray chart data to refine outfield alignments on a per-hitter basis, with the goal of improving the team's Outfield Outs Above Average (OAA) from +2 to +5.",
            wins: 0.7,
          },
          {
            summary: "The catchers are below-average in pitch framing, costing the staff valuable borderline strikes.",
            details: "Introduce a specialized coaching program for catchers focused on receiving mechanics to improve the team's 'Stolen Strike' rate to at least league average.",
            wins: 0.4,
          }
        ]
      }
    ]
  },

  defensiveMetrics: [
    { position: "SS", drs: 5, player: "Hayes", grade: "Elite", outs: "+12", context: "Elite range and arm strength" },
    { position: "RF", drs: 3, player: "Reynolds", grade: "Above Avg", outs: "+8", context: "Solid routes, average arm" },
    { position: "2B", drs: -1, player: "Castro", grade: "Below Avg", outs: "-3", context: "Limited range on double plays" }
  ],
  defensiveNotes: [
      { title: "Outfield Jump & Route Efficiency", insight: "Oneil Cruz has dramatically improved his Outfield Jump, going from -3.1 feet vs average to just -0.5 feet, turning a major weakness into a strength and accumulating +2 Outs Above Average.", color: "green"},
      { title: "Catcher Framing", insight: "The team's catchers are slightly below average in framing runs, costing the pitching staff some borderline strikes. This is a clear area for potential improvement to further support the elite pitching staff.", color: "orange"}
  ]
};

// Wrapper for elements that need an info tooltip
const TooltipWrapper = ({ children, tooltipText }) => {
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


// Trend Indicator Component
const TrendIndicator = ({ current, previous, isPositive = true }) => {
    // Handle cases where previous might not be a number (e.g., for "38-56" record)
    if (typeof current !== 'number' || typeof previous !== 'number') return null;

    const trend = current - previous;
    // For ERA+, lower is worse, so we invert the logic
    const isGood = isPositive ? trend > 0 : trend < 0;
    
    return (
        <span className={`text-xs ml-2 ${isGood ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend).toFixed(2)}
        </span>
    );
};


// Collapsible Section Component
const CollapsibleSection = ({ title, children, icon: Icon }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-black/40 border border-gray-600 rounded-xl">
            <button 
                className="w-full flex justify-between items-center p-4"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
            >
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {Icon && <Icon className="w-6 h-6" />}
                    {title}
                </h3>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </button>
            {isExpanded && <div className="p-6 pt-0">{children}</div>}
        </div>
    );
};


// Key Insights component for each tab
const KeyInsights = ({ insights }) => (
    <div className="bg-black/40 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">Key Insights</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {insights.map((insight, i) => <li key={i}>{insight}</li>)}
        </ul>
    </div>
);

// League Rank Indicator
const LeagueRankIndicator = ({ rank, total }) => {
    const percentage = ((total - rank + 1) / total) * 100;
    const getColor = () => {
        if (percentage > 66) return 'bg-green-500';
        if (percentage > 33) return 'bg-orange-500';
        return 'bg-red-500';
    }
    return (
        <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>League Rank</span>
                <span>{rank}/{total}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${getColor()}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}


// Data Quality Indicator Component
const DataQualityIndicator = ({ confidence, sampleSize, lastUpdated, source = "Multiple" }) => {
  const getQualityColor = (conf) => {
    if (conf >= 95) return "#22C55E"; // Green - High confidence
    if (conf >= 85) return "#3B82F6"; // Blue - Good confidence
    if (conf >= 70) return "#F59E0B"; // Yellow - Moderate confidence
    return "#EF4444"; // Red - Low confidence
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="data-quality-indicator flex items-center gap-2 mt-2 text-xs">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: getQualityColor(confidence) }}
        title={`${confidence}% confidence`}
      />
      <span className="text-gray-400">
        {confidence}% confidence • n={sampleSize} • {formatDate(lastUpdated)}
      </span>
      <span className="text-gray-500">({source})</span>
    </div>
  );
};

// Enhanced Tooltip
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

// Strike Zone Heatmap Component
const StrikeZoneHeatmap = ({ zoneData }) => {
  const [selectedMetric, setSelectedMetric] = useState('woba');

  const zoneGrid = [
    [
      { zone: 'Corners', woba: 0.295, frequency: 15, sampleSize: 67, analysis: 'Upper left corner performance', color: '#3B82F6' },
      { zone: 'Upper Zone', woba: 0.195, frequency: 15, sampleSize: 61, analysis: 'High fastball strength', color: '#22C55E' },
      { zone: 'Corners', woba: 0.295, frequency: 15, sampleSize: 58, analysis: 'Upper right corner performance', color: '#3B82F6' }
    ],
    [
      { zone: 'Outer Third', woba: 0.285, frequency: 18, sampleSize: 73, analysis: 'Away pitches weakness', color: '#F97316' },
      { zone: 'Heart', woba: 0.425, frequency: 22, sampleSize: 89, analysis: 'Middle-middle exploitation', color: '#EF4444' },
      { zone: 'Outer Third', woba: 0.285, frequency: 18, sampleSize: 71, analysis: 'Outside corner weakness', color: '#F97316' }
    ],
    [
      { zone: 'Corners', woba: 0.315, frequency: 31, sampleSize: 42, analysis: 'Lower left corner neutral', color: '#3B82F6' },
      { zone: 'Lower Zone', woba: 0.310, frequency: 14, sampleSize: 57, analysis: 'Low strikes adequate', color: '#6B7280' },
      { zone: 'Corners', woba: 0.315, frequency: 31, sampleSize: 45, analysis: 'Lower right corner neutral', color: '#3B82F6' }
    ]
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedMetric('woba')}
          className={`px-3 py-1 rounded text-sm ${selectedMetric === 'woba' ? 'bg-yellow-600 text-black' : 'bg-gray-600 text-white'}`}
        >
          wOBA
        </button>
        <button
          onClick={() => setSelectedMetric('frequency')}
          className={`px-3 py-1 rounded text-sm ${selectedMetric === 'frequency' ? 'bg-yellow-600 text-black' : 'bg-gray-600 text-white'}`}
        >
          Frequency %
        </button>
      </div>

      <div className="w-80 h-80 mx-auto">
        <div className="grid grid-cols-3 gap-1 w-full h-full border-4 border-white rounded-lg p-2 bg-green-800/20">
          {zoneGrid.flat().map((zone, idx) => {
            const value = selectedMetric === 'woba' ? zone.woba : zone.frequency;
            const intensity = selectedMetric === 'woba' ? Math.min(Math.max((value - 0.15) / 0.35, 0.1), 0.8) : 0.5;

            return (
              <div
                key={idx}
                className="relative border-2 border-white/50 flex flex-col items-center justify-center text-xs font-bold rounded cursor-pointer hover:border-yellow-400 transition-all"
                style={{
                  backgroundColor: zone.color + Math.round(intensity * 255).toString(16).padStart(2, '0'),
                  minHeight: '85px'
                }}
                title={zone.analysis}
              >
                <span className="text-white bg-black/70 px-1 rounded text-xs font-bold">
                  Zone {Math.floor(idx / 3) + 1}-{(idx % 3) + 1}
                </span>
                <span className="text-white bg-black/70 px-1 rounded text-xs mt-1">
                  {selectedMetric === 'woba' ? value.toFixed(3) : value + '%'}
                </span>
                <span className="text-gray-200 text-xs mt-1">N={zone.sampleSize}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {selectedMetric === 'woba' && (
          <>
            <div className="flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#22C55E' }}></div><span className="text-gray-300">Elite (&lt;0.28)</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#3B82F6' }}></div><span className="text-gray-300">Good (0.28-0.32)</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#F97316' }}></div><span className="text-gray-300">Concern (0.32-0.40)</span></div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: '#EF4444' }}></div><span className="text-gray-300">Vulnerable (&gt;0.40)</span></div>
            </div>
            <div className="bg-blue-900/30 p-3 rounded-lg">
              <p className="text-blue-200 text-sm"><strong>Strike Zone Context:</strong> This 3x3 grid represents the baseball strike zone from the catcher's perspective. Center zone (2-2) is the "heart" where Pirates hitters excel. Sample sizes (N) indicate data reliability.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Spray Chart Component
const SprayChart = ({ sprayData }) => {
  const { pullRate, centerRate, oppositeRate, gbFbRatio, groundBallRate, flyBallRate, analysis, recommendation } = sprayData;

  return (
    <div className="space-y-6">
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
              <text x="220" y="180" className="text-sm font-bold" fill="#22C55E">Opposite</text>
              <text x="225" y="195" className="text-lg font-bold" fill="#22C55E">{oppositeRate}%</text>
              <circle cx="150" cy="270" r="4" fill="#FDB827" stroke="#27251F" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute top-2 right-2 bg-black/80 text-white p-3 rounded-lg border border-gray-500">
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{gbFbRatio}</div>
              <div className="text-xs">GB/FB Ratio</div>
              <div className="text-xs mt-1 text-gray-300">
                GB: {groundBallRate}%<br />
                FB: {flyBallRate}%
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-3">Hit Distribution Analysis</h4>
            <div className="space-y-3">
              <div className="bg-red-900/30 p-3 rounded-lg border-l-4 border-red-400"><div className="flex justify-between items-center mb-1"><span className="text-red-200 font-medium">Pull Rate</span><span className="text-red-200 font-bold">{pullRate}%</span></div><p className="text-red-100 text-xs">{analysis}</p></div>
              <div className="bg-green-900/30 p-3 rounded-lg border-l-4 border-green-400"><div className="flex justify-between items-center mb-1"><span className="text-green-200 font-medium">Recommendation</span></div><p className="text-green-100 text-xs">{recommendation}</p></div>
            </div>
          </div>
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500">
            <h5 className="font-semibold text-blue-200 mb-2">How to Read This Chart</h5>
            <p className="text-blue-100 text-sm">This chart illustrates where hitters are putting the ball in play. The high pull rate and ground ball-to-fly ball (GB/FB) ratio indicate a predictable offensive approach that is vulnerable to defensive shifts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Action Plan Component
const ActionPlanDisplay = ({ initiatives }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Prioritized': return 'bg-blue-600';
      case 'Planning': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Prioritized': return <CheckCircle size={16} />;
      case 'Planning': return <Calendar size={16} />;
      default: return <Clock size={16} />;
    }
  };
  return (
    <div className="space-y-6">
      {initiatives.map((initiative, idx) => (
        <div key={idx} className="bg-black/40 border border-gray-600 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-white">{initiative.name} ({initiative.category})</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 ${getStatusColor(initiative.status)}`}>
                {getStatusIcon(initiative.status)}
                {initiative.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">+{initiative.totalWins}</div>
              <div className="text-xs text-gray-400">{initiative.duration}</div>
            </div>
          </div>
          <div className="space-y-3">
            {initiative.tasks.map((task, taskIdx) => (
              <div key={taskIdx} className="bg-gray-800/50 p-4 rounded-lg border-l-4 border-yellow-400">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{task.summary}</h4>
                  <div className="flex items-center gap-2 text-green-400 font-bold">
                    +{task.wins} wins
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

// Metric Card Component
const MetricCard = ({ title, value, previous, delta, subtitle, trend = [], status, insight, dataQuality, onClick, rank, total }) => {
  const getStatusColor = () => {
    if (status === 'critical') return "#EF4444";
    if (status === 'warning') return "#F97316";
    if (status === 'good') return "#22C55E";
    if (delta === undefined) return "#FDB827";
    return delta > 0 ? "#22C55E" : "#EF4444";
  };
  
  const cardClasses = `bg-black/60 border border-gray-600 p-4 rounded-xl transition-all relative ${
    onClick ? 'cursor-pointer hover:border-yellow-400 hover:bg-black/80' : ''
  }`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {dataQuality && (
        <div className="absolute top-2 right-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              dataQuality.confidence >= 95 ? 'bg-green-500' : 
              dataQuality.confidence >= 85 ? 'bg-blue-500' : 
              dataQuality.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            title={`Data Quality: ${dataQuality.confidence}%`}
          />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <TooltipWrapper tooltipText={metricDefinitions[title]}>
            <span className="text-xs text-gray-300 uppercase tracking-wide font-medium pr-4">
              {title}
            </span>
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
      
      <div className="text-2xl font-bold text-white mb-1 flex items-center">
        {value}
        <TrendIndicator current={parseFloat(value)} previous={previous} isPositive={title !== "Team wOBA"} />
      </div>
      
      {subtitle && (
        <div className="text-xs text-gray-400 mb-2">{subtitle}</div>
      )}
      
      {delta !== undefined && (
        <div 
          className="flex items-center gap-1 text-sm font-medium mb-2" 
          style={{ color: getStatusColor() }}
        >
          {delta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {delta > 0 ? '+' : ''}{delta}% vs League
        </div>
      )}
      
      {insight && (
        <div className="text-xs text-gray-300 leading-relaxed border-t border-gray-700 pt-2 mb-2">
          {insight}
        </div>
      )}

      {rank && total && <LeagueRankIndicator rank={rank} total={total} />}
      
      {dataQuality && <DataQualityIndicator {...dataQuality} />}
    </div>
  );
};

// Base Modal Component for Keyboard listener
const BaseModal = ({ children, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return children;
};


// Deep Dive Modal Component
const DeepDiveModal = ({ recommendation, onClose }) => {
    if (!recommendation) return null;
    
    const colorMapping = {
        blue: { border: 'border-blue-400', text: 'text-blue-400' },
        green: { border: 'border-green-400', text: 'text-green-400' },
        purple: { border: 'border-purple-400', text: 'text-purple-400' },
    };

    const content = {
        offense: {
            title: "Deep Dive: Offensive Strategy",
            icon: BarChart3,
            color: "blue",
            children: (
                <div className="space-y-4">
                    <p>The offense struggles with a high chase rate (31.4%) and inconsistent contact. Improving plate discipline is the most direct path to scoring more runs.</p>
                    <div className="bg-black/40 border border-gray-600 p-4 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">Monthly Team wOBA Trend</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={completeData.monthlyWoba} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} aria-label="Monthly Team wOBA Trend Chart">
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" tick={{ fill: "#D1D5DB" }} />
                                <YAxis tick={{ fill: "#D1D5DB" }} domain={[0.280, 0.350]} tickFormatter={(tick) => tick.toFixed(3)} />
                                <Tooltip content={<PirateTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="woba" name="Pirates wOBA" stroke="#FDB827" strokeWidth={2} />
                                <Line type="monotone" dataKey="leagueAvg" name="League Avg wOBA" stroke="#6B7280" strokeDasharray="5 5" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )
        },
        pitching: {
            title: "Deep Dive: Pitching Optimization",
            icon: Shield,
            color: "green",
            children: (
                 <div className="space-y-4">
                    <p>The pitching staff is a strength, but optimizing roles can turn good into great. Focusing on Keller's command and Bednar's usage in high-leverage spots is key.</p>
                    <div className="bg-black/40 border border-gray-600 p-4 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">Stuff+ vs Location+ Matrix</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }} aria-label="Stuff+ vs Location+ Scatter Plot">
                            <CartesianGrid stroke="#374151" />
                            <XAxis type="number" dataKey="stuff" name="Stuff+" domain={[85, 115]} tick={{ fill: '#d1d5db' }} />
                            <YAxis type="number" dataKey="location" name="Location+" domain={[80, 100]} tick={{ fill: '#d1d5db' }}/>
                            <Tooltip content={<PirateTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="4 4" />
                            <ReferenceLine y={92.5} stroke="#EF4444" strokeDasharray="4 4" />
                            <Scatter data={completeData.pitchingData.rotation} fill="#FDB827" />
                          </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )
        },
        defense: {
            title: "Deep Dive: Defensive Refinements",
            icon: Anchor,
            color: "purple",
            children: (
                 <div className="space-y-4">
                    <p>Defense is already a team strength, but small improvements in positioning and framing can save crucial runs over a long season.</p>
                    <div className="bg-black/40 border border-gray-600 p-4 rounded-xl">
                        <h3 className="text-xl font-bold text-white mb-4">Key Positional Notes</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {completeData.defensiveNotes.map((note, i) => (
                                <div key={i} className={`p-4 rounded-lg bg-gray-800/50 border-l-4 ${note.color === 'green' ? 'border-green-400' : 'border-orange-400'}`}>
                                    <h4 className="font-semibold text-gray-200 mb-2">{note.title}</h4>
                                    <p className="text-sm text-gray-300">{note.insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
    };

    const currentContent = content[recommendation];
    const Icon = currentContent.icon;
    const colors = colorMapping[currentContent.color] || { border: 'border-gray-400', text: 'text-gray-400' };

    return (
        <BaseModal onClose={onClose}>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className={`bg-gray-900 border-2 ${colors.border} rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-2xl font-bold ${colors.text} flex items-center gap-2`}><Icon className="w-8 h-8" /> {currentContent.title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="text-gray-300">
                        {currentContent.children}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

const PathwayModal = ({ pathway, onClose }) => {
    if (!pathway) return null;
    
    const colorMapping = {
        green: { border: 'border-green-400', text: 'text-green-400' },
        red: { border: 'border-red-400', text: 'text-red-400' },
        orange: { border: 'border-orange-400', text: 'text-orange-400' },
        blue: { border: 'border-blue-400', text: 'text-blue-400' },
    };

    const getPathwayContent = () => {
        switch (pathway.title) {
            case "Win Upside":
                return {
                    title: "Win Upside Breakdown (+6.2 Wins)",
                    icon: TrendingUp,
                    color: "green",
                    content: (
                        <div className="space-y-4">
                            <p>The +6.2 win upside is an aggregate of several targeted improvement areas across the roster. Each initiative has a projected impact based on performance models.</p>
                            <div className="bg-black/40 p-4 rounded-lg">
                                {completeData.winUpsideBreakdown.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                                        <span className="font-medium text-gray-200">{item.name}</span>
                                        <span className="font-bold text-green-400">+{item.wins.toFixed(1)} wins</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                };
            case "Current Record":
                return {
                    title: "Record & Playoff Path",
                    icon: Calendar,
                    color: "red",
                    content: (
                         <div className="space-y-4">
                            <p>To reach a target of 86 wins, the team needs to play at a .714 winning percentage over the final 68 games (49-19 record).</p>
                            <div className="bg-black/40 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Monthly Record</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={completeData.monthlyRecord} aria-label="Monthly Wins and Losses Bar Chart">
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
                    )
                };
            case "Team wOBA":
                 return {
                    title: "Offensive Performance Deep Dive",
                    icon: BarChart3,
                    color: "orange",
                    content: (
                        <div className="space-y-4">
                            <p>The team's wOBA of .301 is below league average, primarily due to a high chase rate and inconsistent contact. However, performance showed improvement through mid-season.</p>
                            <div className="bg-black/40 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Monthly Team wOBA Trend</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={completeData.monthlyWoba} aria-label="Monthly Team wOBA Trend Chart">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="month" tick={{ fill: "#D1D5DB" }} />
                                        <YAxis tick={{ fill: "#D1D5DB" }} domain={[0.280, 0.350]} tickFormatter={(tick) => tick.toFixed(3)} />
                                        <Tooltip content={<PirateTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="woba" name="Pirates wOBA" stroke="#FDB827" strokeWidth={2} />
                                        <Line type="monotone" dataKey="leagueAvg" name="League Avg wOBA" stroke="#6B7280" strokeDasharray="5 5" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                };
            case "Pitching ERA+":
                return {
                    title: "Pitching Strengths Deep Dive",
                    icon: Shield,
                    color: "blue",
                    content: (
                        <div className="space-y-4">
                            <p>The pitching staff's ERA+ of 108 is a significant team strength, driven by elite stuff and effective contact management.</p>
                            <div className="bg-black/40 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-white mb-4">Stuff+ vs Location+ Matrix</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <ScatterChart aria-label="Stuff+ vs Location+ Scatter Plot for Starting Pitchers">
                                        <CartesianGrid stroke="#374151" />
                                        <XAxis type="number" dataKey="stuff" name="Stuff+" domain={[85, 115]} tick={{ fill: '#d1d5db' }} />
                                        <YAxis type="number" dataKey="location" name="Location+" domain={[80, 100]} tick={{ fill: '#d1d5db' }}/>
                                        <Tooltip content={<PirateTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                        <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="4 4" />
                                        <ReferenceLine y={92.5} stroke="#EF4444" strokeDasharray="4 4" />
                                        <Scatter data={completeData.pitchingData.rotation} fill="#FDB827" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )
                };
            default:
                return null;
        }
    };

    const currentContent = getPathwayContent();
    if (!currentContent) return null;
    
    const Icon = currentContent.icon;
    const colors = colorMapping[currentContent.color] || { border: 'border-gray-400', text: 'text-gray-400' };

    return (
        <BaseModal onClose={onClose}>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className={`bg-gray-900 border-2 ${colors.border} rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-2xl font-bold ${colors.text} flex items-center gap-2`}><Icon className="w-8 h-8" /> {currentContent.title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="text-gray-300">
                        {currentContent.content}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

// Player Modal Component
const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;
  return (
    <BaseModal onClose={onClose}>
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-400">{player.player} Deep Dive Analysis</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Key Performance Metrics</h3>
                <div className="space-y-4">
                  {player.metrics?.map((metric, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <TooltipWrapper tooltipText={metricDefinitions[metric.name]}>
                            <span className="text-gray-300 font-medium">{metric.name}</span>
                        </TooltipWrapper>
                        <div className="text-right"><span className="text-white font-bold">{metric.value}</span><div className="text-xs text-gray-400">vs {metric.leagueAvg} avg</div></div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2"><div className={`h-2 rounded-full ${metric.percentile > 75 ? 'bg-green-500' : metric.percentile > 50 ? 'bg-blue-500' : metric.percentile > 25 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${metric.percentile}%` }} /></div>
                      <div className="text-xs text-gray-400">{metric.percentile}th percentile</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Development Strategy</h3>
                <div className="bg-black/40 p-4 rounded-lg space-y-4">
                  <div><h4 className="text-sm font-semibold text-blue-200 mb-2">Current Analysis</h4><p className="text-gray-300 text-sm leading-relaxed">{player.analysis}</p></div>
                  <div><h4 className="text-sm font-semibold text-green-200 mb-2">Action Plan</h4><p className="text-blue-300 text-sm leading-relaxed">{player.recommendation}</p></div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-700"><span className="text-xs text-gray-400">Projected Impact:</span><span className="text-green-400 font-bold">+{player.impact} wins</span></div>
                </div>
              </div>
            </div>
            {player.pitchArsenal && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Pitch Arsenal Analysis</h3>
                <div className="bg-black/30 rounded-lg overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-black/50"><tr><th className="p-3">Pitch Type</th><th className="p-3">Usage %</th><th className="p-3">Avg Velocity</th><th className="p-3">Whiff %</th><th className="p-3">wOBA Against</th><th className="p-3">Assessment</th></tr></thead>
                  <tbody>{player.pitchArsenal.map((pitch, i) => (<tr key={i} className="border-b border-gray-700 hover:bg-gray-800/30 transition-colors"><td className="p-3 font-medium text-white">{pitch.pitch}</td><td className="p-3 text-gray-300">{pitch.usage}%</td><td className="p-3 text-gray-300">{pitch.velocity} mph</td><td className="p-3 text-gray-300">{pitch.whiffPct}%</td><td className={`p-3 font-bold ${pitch.woba > 0.320 ? 'text-red-400' : pitch.woba > 0.280 ? 'text-yellow-400' : 'text-green-400'}`}>{pitch.woba.toFixed(3)}</td><td className="p-3 text-xs">{pitch.woba > 0.320 ? (<span className="bg-red-900/30 text-red-200 px-2 py-1 rounded">Needs Work</span>) : pitch.woba < 0.250 ? (<span className="bg-green-900/30 text-green-200 px-2 py-1 rounded">Elite</span>) : (<span className="bg-blue-900/30 text-blue-200 px-2 py-1 rounded">Solid</span>)}</td></tr>))}</tbody>
                </table></div></div>
              </div>
            )}
            {player.trend && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance Trends (wRC+ or ERA-)</h3>
                <ResponsiveContainer width="100%" height={250}><LineChart data={player.trend} aria-label={`Performance Trend for ${player.player}`}><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="month" tick={{ fill: "#D1D5DB", fontSize: 12 }} /><YAxis tick={{ fill: "#D1D5DB", fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']}/><Tooltip content={<PirateTooltip />} /><Line type="monotone" dataKey="value" stroke="#FDB827" strokeWidth={3} name="Performance Metric" /></LineChart></ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
    </BaseModal>
  );
};

// Percentile Bar Component
const PercentileBar = ({ percentile, metric }) => {
  const getBarColor = (p) => {
    if (p >= 90) return "#22C55E";
    if (p >= 75) return "#3B82F6";
    if (p >= 40) return "#FDB827";
    if (p >= 25) return "#F97316";
    return "#EF4444";
  };
  return (
    <div className="w-full space-y-1">
      <div className="bg-gray-700 rounded-full h-2 relative"><div className="h-2 rounded-full transition-all duration-300" style={{ width: `${percentile}%`, backgroundColor: getBarColor(percentile) }} /></div>
      <div className="flex justify-between text-xs"><span className="text-gray-400">{percentile >= 75 ? 'Elite' : percentile >= 50 ? 'Above Avg' : percentile >= 25 ? 'Below Avg' : 'Poor'}</span><span className="text-gray-400">{percentile}th percentile</span></div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState("executive");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [deepDive, setDeepDive] = useState(null);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [showCopyConfirm, setShowCopyConfirm] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const handlePathwayClick = (pathway) => {
    setSelectedPathway(pathway);
  };
  
  const handleExportPDF = () => {
    window.print();
  };

  const handleShareLink = () => {
    const url = "https://buccos-analytics.com/dashboard-2025-report";
    const textField = document.createElement('textarea');
    textField.innerText = url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    setShowCopyConfirm(true);
    setTimeout(() => {
      setShowCopyConfirm(false);
    }, 2000);
  };

  const handleExportInsights = () => {
    const insights = {
        executiveSummary: completeData.executive,
        keyActionItems: completeData.actionPlan.initiatives.map(i => ({
            name: i.name,
            category: i.category,
            projectedWins: i.totalWins,
            tasks: i.tasks.map(t => ({ summary: t.summary, wins: t.wins }))
        })),
        outlierMetrics: completeData.outlierMetrics.map(o => ({
            category: o.category,
            insight: o.insight,
            actionable: o.actionable
        })),
        timestamp: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(insights, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "pirates_insights_export.json";
    link.click();
  };

  const navigation = [
    { id: "executive", label: "Executive Summary", icon: TrendingUp },
    { id: "offense", label: "Offense", icon: BarChart3 },
    { id: "pitching", label: "Pitching", icon: Shield },
    { id: "bullpen", label: "Bullpen", icon: Zap },
    { id: "defense", label: "Defense", icon: Anchor },
    { id: "players", label: "Player Spotlight", icon: Users },
    { id: "outliers", label: "Outlier Metrics", icon: Eye },
    { id: "actions", label: "Proposed Actions", icon: Award },
  ];

  return (
    <>
    <style>{`
        .high-contrast {
            background: #000000 !important;
            color: #FFFFFF !important;
        }
        .high-contrast .bg-black\\/90, .high-contrast .bg-black\\/60, .high-contrast .bg-black\\/40, .high-contrast .bg-black\\/30, .high-contrast .bg-gray-900 {
            background: #111111 !important;
            border-color: #FFFFFF !important;
        }
        .high-contrast .text-black, .high-contrast .text-black\\/80 {
            color: #000000 !important;
        }
        .high-contrast .text-gray-300, .high-contrast .text-gray-400, .high-contrast .text-gray-500 {
            color: #DDDDDD !important;
        }
        .high-contrast .bg-yellow-600 {
            background: #FFFF00 !important;
            color: #000000 !important;
        }
         .high-contrast .border-yellow-600, .high-contrast .border-yellow-400 {
            border-color: #FFFF00 !important;
        }
        .high-contrast .text-yellow-400 {
            color: #FFFF00 !important;
        }
    `}</style>
    <div className={`min-h-screen ${isHighContrast ? 'high-contrast' : ''}`} style={{ background: `linear-gradient(135deg, #27251F 0%, #1E1E1E 50%, #27251F 100%)`, color: "#F9FAFB" }}>
        {showCopyConfirm && (
         <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50">
           Link copied!
         </div>
       )}
      
      {/* Data Timestamp Header */}
      <div className="bg-blue-900/20 border-b border-blue-500/30 px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <span className="text-blue-200">
            📊 Data as of July 15, 2025 • Last Updated: 11:59 PM ET
          </span>
          <span className="text-blue-300">
            Sample: 94 games • 58% season complete • 15 days to trade deadline
          </span>
        </div>
      </div>
      
      <header className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Anchor className="w-12 h-12 text-black" />
              <div>
                <h1 className="text-4xl font-bold text-black">Pittsburgh Pirates</h1>
                <p className="text-xl text-black/80">Performance Intelligence Dashboard</p>
              </div>
            </div>
             <div className="flex items-center gap-2">
                <button onClick={() => setIsHighContrast(!isHighContrast)} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30 transition-all" title="Toggle High Contrast Mode">
                    {isHighContrast ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={handleExportPDF} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30 transition-all">
                    <FileDown size={18} />
                    Export PDF
                </button>
                <button onClick={handleShareLink} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30 transition-all">
                    <Share2 size={18} />
                    Share Link
                </button>
                 <button onClick={handleExportInsights} className="bg-black/20 text-black px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/30 transition-all">
                    <Download size={18} />
                    Export Insights (JSON)
                </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-black/90 border-b-2 border-yellow-600">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto">
            {navigation.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={`${activeTab === id ? "bg-yellow-600 text-black font-bold border-b-4 border-yellow-400" : "text-yellow-100 hover:bg-black/50 hover:text-white"} px-6 py-4 flex items-center gap-2 whitespace-nowrap transition-all border-b-4 border-transparent`}>
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === "executive" && (
          <div className="space-y-8">
            <KeyInsights insights={[
                "Identified +6.2 win upside through targeted strategic improvements.",
                "Offensive production (28th in wOBA) is the primary area of concern, driven by poor plate discipline.",
                "Pitching (11th in ERA+) is a team strength, with further optimization possible."
            ]}/>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-yellow-400 mb-4">Strategic Analysis: July 15, 2025 Assessment</h2>
              <p className="text-xl text-gray-300">Current: 38-56 (.404) | Season: 58% Complete | Analytics-Driven Improvement: +6.2 wins</p>
              <div className="mt-4 bg-orange-900/30 border border-orange-500 rounded-lg p-3">
                <p className="text-orange-200 text-sm">
                  <strong>Trade Deadline Context:</strong> 15 days until July 30 deadline. 
                  All players except Paul Skenes considered available for discussion.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {completeData.executive.map((metric, idx) => (<MetricCard key={idx} {...metric} onClick={() => handlePathwayClick(metric)} />))}
            </div>
          </div>
        )}

        {activeTab === "offense" && (
          <div className="space-y-8">
            <KeyInsights insights={[
                "Team-wide chase rate (31.4%) is 3.3% worse than league average, leading to weak contact.",
                "High launch angle variance for key hitters like Reynolds and Hayes limits power.",
                "The team underperforms significantly in advantageous 2-0 counts."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Offensive Analysis & Strategic Development</h2>
            <CollapsibleSection title="Critical Offensive Development Areas" icon={AlertTriangle}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-xs text-gray-400 uppercase bg-black/50"><tr><th className="p-3">Metric</th><th className="p-3">Pirates</th><th className="p-3">League Avg</th><th className="p-3">Sample Size</th><th className="p-3">Strategic Recommendation</th></tr></thead>
                      <tbody>
                        {completeData.offensiveMetrics.map((metric, i) => (
                          <tr key={i} className="border-b border-gray-700">
                            <td className="p-3 font-medium text-white">{metric.metric}</td>
                            <td className="p-3 text-red-300 font-bold">{metric.pirates}{typeof metric.pirates === 'number' && metric.pirates < 1 ? '' : metric.metric.includes('Rate') ? '%' : metric.metric.includes('Angle') ? '°' : metric.metric.includes('Count') ? '%' : ''}</td>
                            <td className="p-3 text-gray-300">{metric.league}{typeof metric.league === 'number' && metric.league < 1 ? '' : metric.metric.includes('Rate') ? '%' : metric.metric.includes('Angle') ? '°' : metric.metric.includes('Count') ? '%' : ''}</td>
                            <td className="p-3 text-blue-300 text-xs">{metric.sampleSize}</td>
                            <td className="p-3 text-green-300 text-xs max-w-xs">{metric.recommendation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
            </CollapsibleSection>
            <div className="grid md:grid-cols-2 gap-6">
              <CollapsibleSection title="Interactive Strike Zone Analysis"><StrikeZoneHeatmap zoneData={completeData.strikezone} /></CollapsibleSection>
              <CollapsibleSection title="Monthly Team wOBA Trend">
                 <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={completeData.monthlyWoba} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} aria-label="Monthly Team wOBA Trend Chart">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" tick={{ fill: "#D1D5DB" }} />
                        <YAxis tick={{ fill: "#D1D5DB" }} domain={[0.280, 0.350]} tickFormatter={(tick) => tick.toFixed(3)} />
                        <Tooltip content={<PirateTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="woba" name="Pirates wOBA" stroke="#FDB827" strokeWidth={2} />
                        <Line type="monotone" dataKey="leagueAvg" name="League Avg wOBA" stroke="#6B7280" strokeDasharray="5 5" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-300">
                    <p>The team's weighted On-Base Average (wOBA) showed gradual improvement from .285 in April to .307 in June, but declined slightly to .301 by the July 15 cutoff. Still tracking below league average (.315).</p>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        )}

        {activeTab === "pitching" && (
          <div className="space-y-8">
            <KeyInsights insights={[
                "Staff excels at limiting dangerous contact (6.2% Barrel % Allowed vs 7.8% league avg).",
                "Mitch Keller's command (89 Location+) is a key development area to unlock his elite stuff (103 Stuff+).",
                "The staff is excellent at generating whiffs on pitches outside the strike zone (52.8% Chase Contact %)."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Pitching Performance Deep-Dive</h2>
            <CollapsibleSection title="Starting Rotation Analysis" icon={Shield}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-black/50"><tr><th className="p-3">Pitcher</th><th className="p-3">IP</th><th className="p-3">ERA</th><th className="p-3">FIP</th><th className="p-3">Stuff+</th><th className="p-3">Loc+</th><th className="p-3">K Rate</th><th className="p-3">Win Impact</th></tr></thead>
                  <tbody>
                    {completeData.pitchingData.rotation.map((pitcher, i) => (
                      <tr key={i} className="border-b border-gray-700 hover:bg-gray-800/30">
                        <td className="p-3 font-medium text-white">{pitcher.name}</td><td className="p-3 text-gray-300">{pitcher.ip}</td><td className="p-3 text-gray-300">{pitcher.era}</td>
                        <td className="p-3 text-gray-300"><TooltipWrapper tooltipText={metricDefinitions.FIP}><span>{pitcher.fip}</span></TooltipWrapper></td>
                        <td className="p-3 font-bold" style={{ color: pitcher.stuff > 105 ? "#22C55E" : pitcher.stuff > 95 ? "#3B82F6" : "#F97316" }}><TooltipWrapper tooltipText={metricDefinitions['Stuff+']}><span>{pitcher.stuff}</span></TooltipWrapper></td>
                        <td className="p-3 font-bold" style={{ color: pitcher.location > 90 ? "#22C55E" : pitcher.location > 85 ? "#3B82F6" : "#EF4444" }}><TooltipWrapper tooltipText={metricDefinitions['Location+']}><span>{pitcher.location}</span></TooltipWrapper></td>
                        <td className="p-3 text-gray-300">{pitcher.kRate}%</td><td className="p-3 text-green-400 font-bold">+{pitcher.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>
            <CollapsibleSection title="Advanced Pitching Analytics">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {completeData.pitchingData.advancedMetrics.map((metric, i) => (
                        <div key={i} className={`p-4 rounded-lg bg-gray-800/50 border-l-4 ${metric.status === 'good' ? 'border-green-400' : metric.status === 'warning' ? 'border-orange-400' : 'border-red-400'}`}>
                            <h4 className="text-sm font-bold text-gray-300">{metric.name}</h4>
                            <div className="text-2xl font-bold text-white my-1">{metric.pirates}%</div>
                            <div className="text-xs text-gray-400 mb-2">League Avg: {metric.league}%</div>
                            <p className="text-xs text-gray-300">{metric.insight}</p>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>
            <div className="grid md:grid-cols-2 gap-6">
              <CollapsibleSection title="Stuff+ vs Location+ Matrix">
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }} aria-label="Stuff+ vs Location+ Scatter Plot for Starting Pitchers">
                    <CartesianGrid stroke="#374151" />
                    <XAxis type="number" dataKey="stuff" name="Stuff+" domain={[85, 120]} tick={{ fill: '#d1d5db' }} label={{ value: 'Stuff+ (Raw Ability)', position: 'insideBottom', offset: -15, style: { fill: '#d1d5db' } }} />
                    <YAxis type="number" dataKey="location" name="Location+" domain={[85, 100]} tick={{ fill: '#d1d5db' }} label={{ value: 'Location+ (Command)', angle: -90, position: 'insideLeft', offset: -5, style: { fill: '#d1d5db' } }}/>
                    <Tooltip content={<PirateTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <ReferenceLine x={100} stroke="#EF4444" strokeDasharray="4 4" />
                    <ReferenceLine y={92.5} stroke="#EF4444" strokeDasharray="4 4" />
                    <Scatter data={completeData.pitchingData.rotation} fill="#FDB827" />
                  </ScatterChart>
                </ResponsiveContainer>
                 <div className="mt-4 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">How to Read This Chart:</h4>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong className="text-green-400">Top-Right (Ace Potential):</strong> High Stuff & High Location. Elite pitchers live here.</li>
                        <li><strong className="text-orange-400">Bottom-Right (Wild Thing):</strong> High Stuff, Low Location. Great raw pitches but lacks command.</li>
                        <li><strong className="text-blue-400">Top-Left (Crafty Lefty):</strong> Low Stuff, High Location. Succeeds with precision over power.</li>
                        <li><strong className="text-red-400">Bottom-Left (Needs Development):</strong> Low Stuff & Low Location. Struggles with both power and command.</li>
                    </ul>
                </div>
              </CollapsibleSection>
              <CollapsibleSection title="Keller Command Development Case Study">
                <div className="space-y-4">
                  <div className="bg-red-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-200 mb-2">The Problem: Above-Average Stuff, Below-Average Location</h4>
                      <p className="text-red-100 text-sm">Mitch Keller has above-average "stuff" (Stuff+ of 103), but his command (Location+ of 89) is below average. This 14-point gap means he often misses his spots, leading to a high wOBA of .365 on pitches down the middle.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-800 p-3 rounded-lg"><div className="text-xs text-gray-400">Stuff+</div><div className="text-2xl font-bold text-blue-400">103</div></div>
                      <div className="bg-gray-800 p-3 rounded-lg"><div className="text-xs text-gray-400">Location+</div><div className="text-2xl font-bold text-red-400">89</div></div>
                      <div className="bg-gray-800 p-3 rounded-lg"><div className="text-xs text-gray-400">MM wOBA</div><div className="text-2xl font-bold text-red-400">.365</div></div>
                  </div>
                  <div className="bg-green-900/30 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-200 mb-2">The Solution: Targeted Development (+1.1 Wins)</h4>
                      <p className="text-green-100 text-sm">A focused program on mechanical consistency and developing his breaking ball command can close this gap. Improving his Location+ to just 95+ would likely make him a more consistent starter.</p>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        )}

        {activeTab === "bullpen" && (
          <div className="space-y-8">
             <KeyInsights insights={[
                "Closer David Bednar is used in only 65% of high-leverage situations, well below the optimal 88%.",
                "Aroldis Chapman and Colin Holderman are also underutilized in critical moments.",
                "Optimizing bullpen deployment based on Leverage Index can secure an estimated +0.5 wins."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Bullpen Strategy & Leverage Optimization</h2>
            <CollapsibleSection title="Bullpen Performance Matrix" icon={Zap}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-black/50"><tr><th className="p-3">Reliever</th><th className="p-3">Role</th><th className="p-3">ERA</th><th className="p-3">Current Usage %</th><th className="p-3">Optimal Usage %</th><th className="p-3">Win Impact</th></tr></thead>
                  <tbody>
                    {completeData.pitchingData.bullpen.map((reliever, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        <td className="p-3 font-medium text-white">{reliever.name}</td><td className="p-3 text-gray-300">{reliever.role}</td><td className="p-3 text-gray-300">{reliever.era}</td>
                        <td className="p-3 font-bold" style={{ color: reliever.leverageUsage < reliever.optimalUsage ? "#EF4444" : "#22C55E" }}>{reliever.leverageUsage}%</td>
                        <td className="p-3 text-blue-300">{reliever.optimalUsage}%</td><td className="p-3 text-green-400 font-bold">+{reliever.wins}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleSection>
             <div className="grid md:grid-cols-2 gap-6">
                <CollapsibleSection title="Leverage Usage Gap">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={completeData.pitchingData.bullpen} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }} aria-label="Bullpen Leverage Usage Gap Bar Chart">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9CA3AF" }} />
                            <YAxis type="category" dataKey="name" width={80} tick={{ fill: "#9CA3AF" }} />
                            <Tooltip content={<PirateTooltip />} />
                            <Legend />
                            <Bar dataKey="leverageUsage" name="Current Usage" fill="#EF4444" />
                            <Bar dataKey="optimalUsage" name="Optimal Usage" fill="#22C55E" />
                        </BarChart>
                    </ResponsiveContainer>
                </CollapsibleSection>
                <CollapsibleSection title="Actionable Insight: Leverage Matters">
                    <div className="space-y-4 text-sm text-gray-300">
                        <p><strong>Leverage Index (LI)</strong> measures the importance of a given situation in a game. A high LI (e.g., {'>'} 1.6) means the outcome of the plate appearance has a large impact on the win probability.</p>
                        <p className="p-4 bg-red-900/30 rounded-lg border-l-4 border-red-400">The data shows a significant gap between the current and optimal usage for high-leverage relievers like David Bednar. He is being used in only 65% of critical situations, whereas an optimal strategy would deploy him in over 88% of them.</p>
                        <p className="p-4 bg-green-900/30 rounded-lg border-l-4 border-green-400"><strong>Recommendation:</strong> By adopting a data-driven approach to deploy the best relievers in the highest-leverage moments, the team can prevent blown leads and secure an estimated <strong>+0.5 wins</strong> over the remainder of the season.</p>
                    </div>
                </CollapsibleSection>
            </div>
          </div>
        )}

        {activeTab === "defense" && (
          <div className="space-y-8">
             <KeyInsights insights={[
                "Overall defense is a team strength, led by Ke'Bryan Hayes at 3B (+15 DRS).",
                "Catcher framing is a minor weakness, costing the team borderline strikes.",
                "The offense's high ground ball rate (53.5%) makes them susceptible to defensive shifts."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Defensive Metrics & Strategic Positioning</h2>
            <CollapsibleSection title="Defensive Runs Saved Analysis" icon={Anchor}>
              <div className="grid md:grid-cols-2 gap-6">
                <div><ResponsiveContainer width="100%" height={300}><BarChart data={completeData.defensiveMetrics} aria-label="Defensive Runs Saved by Position Bar Chart"><CartesianGrid strokeDasharray="3 3" stroke="#374151" /><XAxis dataKey="position" tick={{ fill: "#9CA3AF" }} /><YAxis tick={{ fill: "#9CA3AF" }} /><Tooltip content={<PirateTooltip />} /><ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" /><Bar dataKey="drs" fill="#FDB827" name="DRS" /></BarChart></ResponsiveContainer></div>
                <div className="space-y-3">
                  {completeData.defensiveMetrics.map((pos, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <div><span className="font-medium text-white">{pos.position} - {pos.player}</span><div className="text-xs text-gray-400">{pos.grade} • {pos.context}</div></div>
                      <div className="text-right"><div className={`text-xl font-bold ${pos.drs > 0 ? 'text-green-400' : pos.drs < 0 ? 'text-red-400' : 'text-gray-400'}`}>{pos.drs > 0 ? '+' : ''}{pos.drs}</div><div className="text-xs text-gray-400">{pos.outs} OAA</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>
             <CollapsibleSection title="Key Positional Notes">
                <div className="grid md:grid-cols-2 gap-4">
                    {completeData.defensiveNotes.map((note, i) => (
                        <div key={i} className={`p-4 rounded-lg bg-gray-800/50 border-l-4 ${note.color === 'green' ? 'border-green-400' : 'border-orange-400'}`}>
                            <h4 className="font-semibold text-gray-200 mb-2">{note.title}</h4>
                            <p className="text-sm text-gray-300">{note.insight}</p>
                        </div>
                    ))}
                </div>
            </CollapsibleSection>
            <CollapsibleSection title="Spray Chart Analysis"><SprayChart sprayData={completeData.sprayChart} /></CollapsibleSection>
          </div>
        )}

        {activeTab === "players" && (
          <div className="space-y-8">
            <KeyInsights insights={[
                "Paul Skenes is performing at a Cy Young level in his rookie season.",
                "Oneil Cruz possesses league-leading exit velocity but needs to optimize his launch angle to unlock his power.",
                "Ke'Bryan Hayes is a defensive superstar, but his offensive production is hampered by a low launch angle."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Player Development Spotlight</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completeData.playerInsights.map((player, idx) => (
                <div key={idx} onClick={() => handlePlayerClick(player)} className="bg-black/40 border border-gray-600 hover:border-yellow-400 p-6 rounded-xl cursor-pointer group transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div><h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{player.player}</h3><p className="text-sm text-yellow-400 font-medium">{player.type}</p></div>
                    <div className="text-right"><div className="text-2xl font-bold text-green-400">+{player.impact}</div><div className="text-xs text-gray-400">Win Impact</div></div>
                  </div>
                  <div className="space-y-4 mb-4">
                    {player.metrics.slice(0, 2).map((metric, metricIdx) => (
                      <div key={metricIdx}>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-300">{metric.name}:</span><span className="text-white font-bold">{metric.value}</span></div>
                        <PercentileBar percentile={metric.percentile} metric={metric.name} />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 border-t border-gray-700 pt-3"><p className="mb-2">{player.analysis.split('.')[0]}.</p><span className="text-yellow-400 font-semibold group-hover:text-yellow-300 transition-colors">Click for comprehensive analysis & development plan →</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "outliers" && (
          <div className="space-y-8">
            <KeyInsights insights={[
                "High Launch Angle Variance for key hitters like Reynolds and Hayes is a primary concern, limiting consistent power.",
                "The team-wide Chase Rate Gap indicates a systematic issue with plate discipline.",
                "Poor performance in 2-0 counts represents a significant missed opportunity for the offense."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Outlier Metrics & Advanced Analytics</h2>
            <div className="space-y-6">
              {completeData.outlierMetrics.map((outlier, idx) => (
                <CollapsibleSection title={outlier.category} key={idx}>
                  <div className="flex justify-between items-start mb-4">
                    <div><p className="text-sm text-gray-300 mt-1">{outlier.description}</p></div>
                    <div className="text-right"><div className="text-lg font-bold text-blue-400">League Avg: {outlier.leagueAverage}{outlier.category.includes('Angle') ? '°' : outlier.category.includes('Rate') ? '%' : ''}</div></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="font-semibold text-white mb-3">Player Performance</h4>
                      <div className="space-y-2">
                        {outlier.players.map((player, playerIdx) => (
                          <div key={playerIdx} className="flex justify-between items-center p-2 bg-gray-800/50 rounded">
                            <span className="text-gray-300">{player.name}</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${player.status === 'good' ? 'text-green-400' : player.status === 'concern' ? 'text-red-400' : 'text-gray-400'}`}>{player.value}{outlier.category.includes('Angle') ? '°' : outlier.category.includes('Rate') ? '%' : ''}</span>
                              <span className="text-xs text-gray-400">({player.percentile}th %ile)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-3">Strategic Analysis</h4>
                      <div className="space-y-3">
                        <div className="bg-blue-900/30 p-3 rounded-lg"><h5 className="font-semibold text-blue-200 mb-1">Performance Impact</h5><p className="text-blue-100 text-sm">{outlier.insight}</p></div>
                        <div className="bg-green-900/30 p-3 rounded-lg"><h5 className="font-semibold text-green-200 mb-1">Actionable Strategy</h5><p className="text-green-100 text-sm">{outlier.actionable}</p></div>
                      </div>
                    </div>
                  </div>
                </CollapsibleSection>
              ))}
            </div>
          </div>
        )}

        {activeTab === "actions" && (
          <div className="space-y-8">
             <KeyInsights insights={[
                "The action plan is projected to add a total of +6.2 wins.",
                "Offensive improvements (Plate Discipline, Contact Quality) account for the largest gain (+2.5 wins).",
                "Pitching optimizations (+1.6 wins) and defensive refinements (+1.1 wins) provide significant additional value."
            ]}/>
            <h2 className="text-3xl font-bold text-yellow-400">Proposed Action Plan</h2>
            <ActionPlanDisplay initiatives={completeData.actionPlan.initiatives} />
            <div className="bg-purple-900/30 border-2 border-purple-400 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-200 mb-4 flex items-center gap-2"><Calendar className="w-6 h-6" />Timeline & Win Accumulation</h3>
              <div className="text-center bg-black/60 p-4 rounded-lg border border-gray-500">
                <p className="text-lg text-gray-300 mb-2"><strong>Total Impact:</strong> <span className="text-green-400 font-bold text-2xl">+6.2 wins</span></p>
                <p className="text-sm text-gray-400">Current: 38-56 → Projected: 44-50 → Wild Card Target: 86-89 wins</p>
                <p className="text-xs text-orange-300 mt-2">Note: Requires .714 winning percentage over final 68 games to reach 86 wins</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      <DeepDiveModal recommendation={deepDive} onClose={() => setDeepDive(null)} />
      <PathwayModal pathway={selectedPathway} onClose={() => setSelectedPathway(null)} />

      <footer className="bg-black/90 border-t-2 border-yellow-600 py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Anchor className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-bold text-white">Pittsburgh Pirates Performance Intelligence Dashboard</span>
            <Anchor className="w-5 h-5 text-yellow-400" />
          </div>
           <p className="text-gray-400 text-sm">
            Data compiled and analyzed by Jacob Rafalson, Carnegie Mellon University
          </p>
          <p className="text-gray-400 text-sm mt-1">
            <strong>Data Sources:</strong> Statcast • Baseball Savant • FanGraphs • Baseball-Reference |
            <strong> Analysis Period:</strong> March 15, 2024 – July 15, 2025 |
            <strong> Sample:</strong> 36,347 pitch events
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}