export type NavItem = {
  title: string;
  href: string;
  /** Short summary, shown on cards / prev-next. */
  blurb?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const REPO_URL = "https://github.com/quitohooded/keel-skills";
export const SITE_URL = "https://estebanaguilar.me";
export const INSTALL_MARKETPLACE = "/plugin marketplace add https://github.com/quitohooded/keel-skills";
export const INSTALL_PLUGIN = "/plugin install keel-skills@keel-skills";
export const INSTALL_COMMUNITY_MARKET = "/plugin marketplace add anthropics/claude-plugins-community";
export const INSTALL_COMMUNITY = "/plugin install keel-skills@claude-community";

export const nav: NavGroup[] = [
  {
    label: "Start",
    items: [
      {
        title: "Overview",
        href: "/",
        blurb: "What Keel Skills is and the problem it solves.",
      },
      {
        title: "Getting started",
        href: "/getting-started",
        blurb: "Install the plugin, scaffold a policy, run your first session.",
      },
    ],
  },
  {
    label: "Concepts",
    items: [
      {
        title: "Permission model",
        href: "/concepts/authorization",
        blurb: "Goal, method, green light; the four-step check; hot zones; following through.",
      },
      {
        title: "Model & delegation",
        href: "/concepts/delegation",
        blurb: "Cheapest capable model, shallow delegation, the tool ladder.",
      },
      {
        title: "Context discipline",
        href: "/concepts/context",
        blurb: "Files as source of truth; when to end a session and hand off.",
      },
    ],
  },
  {
    label: "Configure",
    items: [
      {
        title: "AGENT_POLICY.md",
        href: "/agent-policy",
        blurb: "The single file where your project's specifics live.",
      },
      {
        title: "Policy packs",
        href: "/policy-packs",
        blurb: "Ready-made AGENT_POLICY.md starters for common stacks.",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        title: "Skills, command & hook",
        href: "/reference",
        blurb: "Every component the plugin ships and how it triggers.",
      },
      {
        title: "Specification",
        href: "/spec",
        blurb: "The runtime-neutral spec and conformance rules.",
      },
      {
        title: "Example: the green-light brake",
        href: "/examples/green-light-brake",
        blurb: "A concrete before/after of the agent stopping itself.",
      },
    ],
  },
];

/** Flat, ordered list for prev/next navigation. */
export const flatNav: NavItem[] = nav.flatMap((g) => g.items);
