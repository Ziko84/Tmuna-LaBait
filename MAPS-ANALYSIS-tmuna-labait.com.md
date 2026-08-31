# Maps Intelligence Analysis — tmuna-labait.com

**Date:** 2026-08-24
**Capability tier detected:** Tier 0 (free APIs only). No DataForSEO MCP tools connected in this session, so geo-grid rank tracking, live GBP profile audit, and cross-platform review intelligence are unavailable. This report uses Nominatim (geocoding), Overpass API (OSM lookup), and direct site inspection.

## The headline finding: standard Maps SEO does not apply to this business

Before running the checklist, it's worth stating this plainly: **תמונה לבית is a ship-only e-commerce business with no customer-facing location**, not a walk-in local business. Its own shipping policy states delivery is within Israel only, by courier, with no mention of pickup or a showroom. The registered address (דרך הרימונים 29, רינתיה) is a residential address in a small community near Modiin — not a retail storefront.

This matters because almost everything in the standard Maps-intelligence playbook (geo-grid rank tracking, "near me" local pack ranking, foot-traffic competitor radius mapping, Google Business Profile optimization) is built for businesses customers physically visit. Google's own Business Profile guidelines prohibit creating a profile for a location customers can't visit in person, unless it's set up as a **Service Area Business** (which hides the exact address and shows only a service region). Creating a normal GBP listing at a home address would be a policy violation and would expose a private residential address to anyone searching Google Maps.

**Bottom line: don't chase Maps ranking for this business.** The right growth channels are organic search and AI-search visibility (already covered in this project via `/seo-geo` and the ongoing `/seo-page` work), not Google Maps.

## What was checked anyway (Tier 0)

### 1. Existing Maps/directory presence
- **Geocoded** the registered address via Nominatim: ~32.0434, 34.9286 (דרך הרימונים, רינתיה, מועצה אזורית חבל מודיעין).
- **OpenStreetMap (Overpass API):** no node found for תמונה לבית or tmuna-labait.com within 2km of the address. Only unrelated small businesses nearby (two convenience stores, a supermarket, a clothing outlet, a sports shop in the closest commercial cluster ~2km away). This is the expected, correct state for a home-based online business — not a gap.
- **Google Maps / Bing Maps:** checked via web fetch; both are JS-rendered and didn't return conclusive results either way. Given the OSM absence and the business's own shipping policy, there's no indication a Maps listing exists, which is appropriate here.

### 2. Schema markup (already correct)
Pulled the live JSON-LD from the homepage. The site already uses:
```json
{"@type": "Organization", "address": {...}, "telephone": "...", "email": "..."}
```
**This is the right schema type.** `LocalBusiness` schema would be a mistake here — it signals "customers visit this place," which isn't true. `Organization` (what's already implemented) is correct for an e-commerce brand. No schema change needed.

### 3. NAP exposure trade-off (context, not a bug)
The residential address is publicly visible in two places: the JSON-LD above and the Contact Information legal policy page (fixed earlier this session). This is required — Google Merchant Center's Misrepresentation policy needs an accurate, verifiable business address, and Israeli law requires an עוסק מורשה's registered address to be disclosed. There's no way to satisfy GMC/legal requirements without the address being publicly crawlable somewhere. Just flagging this as an inherent trade-off of running a registered home-based business, not something to fix.

## Sections skipped, and why

| Section | Status |
|---|---|
| Geo-grid rank tracking | Not applicable — no physical location to rank for in Maps |
| GBP profile audit (25-field checklist) | Not applicable — no GBP should exist for this address |
| Review intelligence (Google/Tripadvisor/Trustpilot) | No Maps-platform reviews exist to analyze (site does use Judge.me for on-site reviews, which is a separate, correct system) |
| Competitor radius mapping | Not meaningful — competitors are other online wood-art sellers, not businesses within walking/driving distance of a residential address |
| Cross-platform NAP verification | No listings exist to compare (see above) |

## Recommendation

No action needed on Maps. If the business ever opens a physical showroom or offline pickup point, revisit this with a proper **Service Area Business** GBP listing (hides the exact address, shows a service radius) rather than a standard address-based listing. Until then, keep investing in organic SEO and AI-search visibility, which is where this business's actual discovery channel is.
