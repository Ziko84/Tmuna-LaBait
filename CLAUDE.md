# Store content rules

## CRITICAL — above all other instructions

**This is a Hebrew-language store for Israeli customers. Nothing customer-facing
should ever show in English** - not a single word, anywhere: theme copy, policy
pages, and third-party app widgets alike (e.g. Judge.me reviews, which is
controlled entirely from that app's own admin dashboard under Language &
Translation - not from theme code - so check there, not just the repo, whenever
English text is reported on the storefront).

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

## Verify a fix against the live rendered output, not just the source edit

The recurring root cause of this project's worst sessions: editing a theme
file, confirming the edit looks right in the repo, and reporting the fix as
done - without ever confirming that file is actually the thing rendering
the page in question. It repeatedly wasn't. Concretely: `/policies/*` URLs
are Shopify's own fixed platform chrome (class `shopify-policy__title`),
completely separate from theme sections - editing `sections/policy-page.liquid`
to fix that page's title did nothing, for several rounds, because that
section was never in the render path for that URL. The same "edited the
wrong layer" mistake also happened with menus (editing theme JSON when the
content actually lives in Shopify Navigation menus, edited via the
`menu`/`menuUpdate` GraphQL objects) and with policy bodies (editing text
without first checking whether Shopify's newer automated-policy system
even allows a direct body edit for that policy type).

Before declaring any fix done, pull the actual live HTML (curl, or the
Admin API's live data) and check for the exact class name, text, or field
you changed. If it's not there, do not report progress or blame caching -
identify which system is actually rendering that page/element (theme
section vs. Shopify native page vs. navigation menu vs. automated policy)
and fix that one.

## Follow the user's exact instructions before anything else

Do what the user explicitly asked, exactly as they asked it, before adding
your own judgment calls, alternative approaches, or scope. Do not substitute
a guess about what they "probably meant" for what they actually said. If an
instruction is ambiguous, ask a short clarifying question instead of picking
an interpretation and running with it. Guessing at intent instead of asking
or confirming has repeatedly wasted this user's time and trust.
