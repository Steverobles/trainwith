import { Sport } from "./types";

export interface SportStyle {
  badge: string;
  avatar: string;
  accent: string;
  icon: string;
  image: string;
}

export const sportStyles: Record<Sport, SportStyle> = {
  Baseball: {
    badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
    avatar: "bg-red-100 text-red-700",
    accent: "from-red-500 to-rose-500",
    icon: "⚾",
    image: "/sports/baseball.jpg",
  },
  Softball: {
    badge: "bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/10",
    avatar: "bg-pink-100 text-pink-700",
    accent: "from-pink-500 to-rose-400",
    icon: "🥎",
    image: "/sports/softball.jpg",
  },
  Basketball: {
    badge: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/10",
    avatar: "bg-orange-100 text-orange-700",
    accent: "from-orange-500 to-amber-500",
    icon: "🏀",
    image: "/sports/basketball.jpg",
  },
  Football: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
    avatar: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-600 to-green-500",
    icon: "🏈",
    image: "/sports/football.jpg",
  },
  Soccer: {
    badge: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/10",
    avatar: "bg-cyan-100 text-cyan-700",
    accent: "from-cyan-500 to-blue-500",
    icon: "⚽",
    image: "/sports/soccer.jpg",
  },
  Tennis: {
    badge: "bg-lime-50 text-lime-700 ring-1 ring-inset ring-lime-600/10",
    avatar: "bg-lime-100 text-lime-700",
    accent: "from-lime-500 to-green-500",
    icon: "🎾",
    image: "/sports/tennis.jpg",
  },
  "Track & Field": {
    badge: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/10",
    avatar: "bg-purple-100 text-purple-700",
    accent: "from-purple-500 to-fuchsia-500",
    icon: "🏃",
    image: "/sports/track-field.jpg",
  },
  Running: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
    avatar: "bg-amber-100 text-amber-700",
    accent: "from-amber-500 to-orange-400",
    icon: "👟",
    image: "/sports/running.jpg",
  },
  Weightlifting: {
    badge: "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/10",
    avatar: "bg-slate-100 text-slate-700",
    accent: "from-slate-500 to-gray-600",
    icon: "🏋️",
    image: "/sports/weightlifting.jpg",
  },
  Pickleball: {
    badge: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/10",
    avatar: "bg-yellow-100 text-yellow-700",
    accent: "from-yellow-400 to-amber-500",
    icon: "🏓",
    image: "/sports/pickleball.jpg",
  },
  Golf: {
    badge: "bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-600/10",
    avatar: "bg-teal-100 text-teal-700",
    accent: "from-teal-500 to-emerald-500",
    icon: "⛳",
    image: "/sports/golf.jpg",
  },
  Volleyball: {
    badge: "bg-fuchsia-50 text-fuchsia-700 ring-1 ring-inset ring-fuchsia-600/10",
    avatar: "bg-fuchsia-100 text-fuchsia-700",
    accent: "from-fuchsia-500 to-pink-500",
    icon: "🏐",
    image: "/sports/volleyball.jpg",
  },
  Swimming: {
    badge: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/10",
    avatar: "bg-sky-100 text-sky-700",
    accent: "from-sky-500 to-blue-500",
    icon: "🏊",
    image: "/sports/swimming.jpg",
  },
  Cycling: {
    badge: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/10",
    avatar: "bg-green-100 text-green-700",
    accent: "from-green-600 to-teal-500",
    icon: "🚴",
    image: "/sports/cycling.jpg",
  },
};
