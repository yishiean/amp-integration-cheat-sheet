/* ============================================================
   Amplitude API & Integration Ecosystem — content model
   All copy is sourced from the cheat sheet markdown.
   ============================================================ */
window.DOCS = "https://amplitude.com/docs";

/* Quick reference — the master "find your method" table */
window.QUICK_REF = [
  { method: "HTTP V2 / Batch API", dir: "in", bestFor: "Server-side event tracking, backend transactions, high-volume ingestion", goto: "sec-1", url: "https://amplitude.com/docs/apis/analytics/http-v2" },
  { method: "Identify / Group Identify API", dir: "in", bestFor: "Updating user or account properties without sending events", goto: "sec-1", url: "https://amplitude.com/docs/apis/analytics/identify" },
  { method: "SDKs (Browser, Mobile, Server)", dir: "in", bestFor: "Client-side and app instrumentation", goto: "sec-1", url: "https://amplitude.com/docs/sdks" },
  { method: "CDP Connector (Segment, mParticle, RudderStack)", dir: "in", bestFor: "Already have a CDP? Route events to Amplitude without re-instrumentation", goto: "sec-2", url: "https://amplitude.com/docs/data/source-catalog" },
  { method: "Attribution Connector (AppsFlyer, Adjust)", dir: "in", bestFor: "Link mobile ad spend to in-app user journeys", goto: "sec-2", url: "https://amplitude.com/docs/data/source-catalog" },
  { method: "Warehouse / Data Lake Import (Snowflake, BigQuery, Databricks)", dir: "in", bestFor: "SQL-based scheduled sync to enrich Amplitude with CRM, offline, or computed data — configurable from 5 min to monthly", goto: "sec-2", url: "https://amplitude.com/docs/data/source-catalog" },
  { method: "Cloud Storage Import (S3, GCS)", dir: "in", bestFor: "Import event or user property files dropped into S3 or GCS buckets by your data pipeline — scheduled or event-triggered", goto: "sec-2", url: "https://amplitude.com/docs/data/source-catalog" },
  { method: "Ad Network Source (Google, Facebook, TikTok, Bing, LinkedIn)", dir: "both", bestFor: "Pull ad spend/impression data in; push cohorts and conversion events out", goto: "sec-3", url: "https://amplitude.com/docs/data/source-catalog" },
  { method: "Bidirectional Partner Connectors (Braze, HubSpot, Iterable, Intercom, AppsFlyer)", dir: "both", bestFor: "Full in + out integrations with multiple sync types per partner", goto: "sec-3b", url: "https://amplitude.com/docs/data/source-catalog" },
  { method: "Export API", dir: "out", bestFor: "Raw event data dump to warehouse, data science, or ML pipelines", goto: "sec-4", url: "https://amplitude.com/docs/apis/analytics/export" },
  { method: "Dashboard REST API", dir: "out", bestFor: "Embed Amplitude charts in your own portals or automate metric reporting", goto: "sec-4", url: "https://amplitude.com/docs/apis/analytics/dashboard-rest" },
  { method: "User Profile API", dir: "out", bestFor: "Real-time user property lookup for personalization at runtime", goto: "sec-4", url: "https://amplitude.com/docs/apis/analytics/user-profile" },
  { method: "Warehouse / Data Lake Export (Snowflake, BigQuery, Redshift)", dir: "out", bestFor: "Export Amplitude events hourly to your SQL warehouse for BI tools and analytics", goto: "sec-4", url: "https://amplitude.com/docs/data/destination-catalog" },
  { method: "Cloud Storage & Streaming Export (S3, GCS, Azure, Kinesis)", dir: "out", bestFor: "Export events hourly to S3/GCS/Azure Blob as a landing zone, or stream in real-time via Kinesis", goto: "sec-4", url: "https://amplitude.com/docs/data/destination-catalog" },
  { method: "Marketing Automation Destination", dir: "out", bestFor: "Sync cohorts or stream events to Customer.io, MoEngage, SFMC, Klaviyo, Marketo", goto: "sec-5", url: "https://amplitude.com/docs/data/destination-catalog" },
  { method: "Ad Network Destination", dir: "out", bestFor: "Sync cohorts or stream events to Google Ads, Meta Pixel, TikTok Ads, etc.", goto: "sec-3", url: "https://amplitude.com/docs/data/destination-catalog" },
  { method: "Experimentation / Feature Flags Destination", dir: "out", bestFor: "Sync cohorts to Statsig or LaunchDarkly for targeted feature rollouts", goto: "sec-5", url: "https://amplitude.com/docs/data/destination-catalog" },
  { method: "Taxonomy / Lookup Table / SCIM API", dir: "both", bestFor: "Manage tracking plans, user provisioning, and governance programmatically", goto: "sec-6", url: "https://amplitude.com/docs/apis/analytics/taxonomy" },
  { method: "User Privacy / DSAR API", dir: "out", bestFor: "GDPR/PDPA/CCPA compliance — delete or retrieve user data on demand", goto: "sec-6", url: "https://amplitude.com/docs/apis/analytics/user-privacy" }
];

/* Helper to keep row authoring terse: d = docs link object */
function L(label, url){ return { label, url }; }
