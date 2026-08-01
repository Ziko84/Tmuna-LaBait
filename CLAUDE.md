# Store content rules

## CRITICAL — above all other instructions

**Never use em dashes (—) or semicolons (;) in any text anywhere in this store.**
This applies to every piece of customer-facing copy: hero text, product descriptions,
page content (Our Story, policies, etc.), section headings, buttons, alt text,
menu labels — everywhere, in Hebrew or English.

Use periods, commas, or separate sentences instead. Also avoid the HTML entities
`&mdash;`, `&ndash;`, `&#8212;`, `&#8211;` and literal `–`/`—` characters in any
`text` field in template/section JSON.

Before finishing any task that touches store copy, scan the changed text for
these characters and rewrite if found.

## Debugging visual bugs — search the code first, don't theorize

When the user reports a visual bug (overlap, wrong color, wrong position, missing
element), grep the actual codebase for the specific thing described (element name,
visible text, class-like keyword) before proposing any theory about the cause.
`grep -rn "star\|rating"` or similar takes seconds and either confirms or rules out
a cause immediately — guessing first (cache issues, third-party apps, CSS
specificity theories) and asking the user to keep testing/screenshotting wastes
their time and is a worse experience than just searching. Only fall back to
asking the user for more info (a screenshot, a devtools inspection) after a
real search of the repo for the described symptom has come up empty.

**Never blame caching/CDN lag as an explanation.** It has been wrong every
single time it was used as an excuse on this project. Do not say "this is
probably a cache issue," "give it a minute to sync," or similar, as a way to
explain away a discrepancy the user is reporting. If something looks
different between two views (theme editor vs. live site, before vs. after a
push), find the actual concrete reason — check which theme is published,
diff the actual deployed file, check for a second theme, check app embeds,
etc. Only state "it's cached" if you have directly confirmed the deployed
file/data is already correct and unmistakably different from what's being
shown.
