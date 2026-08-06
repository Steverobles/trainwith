import { Sport } from "./types";

export interface SportStyle {
  badge: string;
  avatar: string;
  accent: string;
}

export const sportStyles: Record<Sport, SportStyle> = {
  Baseball: {
    badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
    avatar: "bg-red-100 text-red-700",
    accent: "from-red-500 to-rose-500",
  },
  Softball: {
    badge: "bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/10",
    avatar: "bg-pink-100 text-pink-700",
    accent: "from-pink-500 to-rose-400",
  },
  Basketball: {
    badge: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/10",
    avatar: "bg-orange-100 text-orange-700",
    accent: "from-orange-500 to-amber-500",
  },
  Football: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
    avatar: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-600 to-green-500",
  },
  Soccer: {
    badge: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-600/10",
    avatar: "bg-cyan-100 text-cyan-700",
    accent: "from-cyan-500 to-blue-500",
  },
  Tennis: {
    badge: "bg-lime-50 text-lime-700 ring-1 ring-inset ring-lime-600/10",
    avatar: "bg-lime-100 text-lime-700",
    accent: "from-lime-500 to-green-500",
  },
  "Track & Field": {
    badge: "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/10",
    avatar: "bg-purple-100 text-purple-700",
    accent: "from-purple-500 to-fuchsia-500",
  },
};
