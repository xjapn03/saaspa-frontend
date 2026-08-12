"use client"

import { useMemo } from "react"

const SPECULATION_RULES = {
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: "/logout" } },
          { not: { href_matches: "/login" } },
          { not: { href_matches: "/registro" } },
          { not: { href_matches: "/recuperar/*" } },
          { not: { href_matches: "/api/*" } },
          { not: { href_matches: "/checkout/*" } },
          { not: { href_matches: "/agendar" } },
          { not: { href_matches: "/dashboard/*" } },
          { not: { selector_matches: "[rel~=\"nofollow\"]" } },
          { not: { selector_matches: "[data-no-prerender]" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
}

export function SpeculationRules() {
  const json = useMemo(() => JSON.stringify(SPECULATION_RULES), [])

  return (
    <script
      type="speculationrules"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
