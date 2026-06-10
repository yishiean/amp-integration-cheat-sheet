/* ============================================================
   Amplitude API & Integration Ecosystem — sections
   ============================================================ */
window.SECTIONS = [

/* ---------- SECTION 1 ---------- */
{
  id: "sec-1", num: "01", nav: "Direct Ingest APIs", lane: "in",
  title: "Getting Data In — Direct APIs",
  intro: "Use these when you control the instrumentation and want to send data to Amplitude programmatically, without a pre-built connector.",
  blocks: [
    { type: "table",
      columns: [
        {key:"api", label:"API", w:"api"},
        {key:"methods", label:"Method(s)", w:"methods"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use cases", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows: [
        {dir:"in", api:"HTTP V2 API", methods:["POST"], what:"Send events directly from your server to Amplitude in real time, one at a time.", use:"Server-side event tracking; capturing backend transactions (payments, bookings, order completions) that shouldn't rely on client SDKs; any environment where an SDK can't be installed.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/http-v2")]},
        {dir:"in", api:"Batch Event Upload API", methods:["POST"], what:"Upload large volumes of event data asynchronously in a single request — built for bulk, high-throughput ingestion.", use:"Backfilling historical event data; bulk-flushing queued server-side events; high-frequency transactional apps (fintech, e-commerce) that batch before sending; data migrations from legacy systems.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/batch-event-upload")]},
        {dir:"in", api:"Identify API", methods:["GET","POST"], what:"Update user properties without sending an event — does not count toward monthly event volume.", use:"Syncing user attributes from your CRM or auth system (plan tier, subscription status, region); updating properties on upgrade or onboarding completion; keeping profiles in sync without inflating event counts.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/identify")]},
        {dir:"in", api:"Group Identify API", methods:["POST"], what:"Set or update properties on a group (account, company, team) rather than an individual user.", use:"B2B analytics — tagging events with account-level attributes like plan type or ARR tier; enabling group-level cohorts and funnels; syncing company data from Salesforce or HubSpot into group properties.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/group-identify")]},
        {dir:"in", api:"Attribution API", methods:["POST"], what:"Send mobile attribution data (IDFA, IDFV, ADID) from MMP partners into Amplitude to connect marketing spend to in-app behavior.", use:"Linking AppsFlyer, Adjust, or Branch attribution data to user journeys; measuring which paid channels drive highest-value users; correlating campaign touchpoints with downstream conversion and retention.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/attribution")]},
        {dir:"in", api:"AI Feedback API <span class='tag-beta'>Beta</span>", methods:["POST"], what:"Send customer feedback signals (NPS, reviews, support tickets, survey responses) into Amplitude for AI-powered theme analysis.", use:"Centralizing voice-of-customer data into Amplitude; surfacing product pain points from qualitative feedback alongside quantitative behavioral data.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/ai-feedback")]}
      ]
    }
  ]
},

/* ---------- SECTION 1b — DRILL-DOWNS ---------- */
{
  id: "sec-1b", num: "01·B", nav: "API Drill-Downs", lane: "in",
  title: "Top API Drill-Down — Sample Requests & Responses",
  intro: "Deep-dives on the most commonly used APIs. Shows how different inputs produce different outputs. Tap a card to expand the full request/response.",
  blocks: [
    { type: "drilldowns", items: [
      {
        n:"1", title:"HTTP V2 API", dir:"in",
        endpoint:"POST https://api2.amplitude.com/2/httpapi",
        auth:"API Key in request body",
        useCase:"Send a single server-side event in real time.",
        parts:[
          {type:"code", label:"Sample request", lang:"bash", code:`curl --location --request POST 'https://api2.amplitude.com/2/httpapi' \\
  --header 'Content-Type: application/json' \\
  --data '{
    "api_key": "YOUR_API_KEY",
    "events": [{
      "user_id": "user_123",
      "event_type": "Purchase Completed",
      "event_properties": {
        "product_id": "SKU-456",
        "amount": 99.00,
        "currency": "SGD"
      },
      "user_properties": { "plan_type": "premium" },
      "insert_id": "unique-event-id-789",
      "time": 1396381378123
    }]
  }'`},
          {type:"code", label:"Sample response · 200 OK", lang:"json", code:`{
  "code": 200,
  "events_ingested": 1,
  "payload_size_bytes": 312,
  "server_upload_time": 1396381378123
}`},
          {type:"paramTable", title:"Key parameters to know", headers:["Parameter","Required","Notes"], rows:[
            ["<code>api_key</code>","Yes","Project API key"],
            ["<code>user_id</code>","Yes*","*Or <code>device_id</code> — at least one identifier required"],
            ["<code>event_type</code>","Yes","String name of the event"],
            ["<code>insert_id</code>","Recommended","Deduplication key — prevents duplicate events within 7 days"],
            ["<code>time</code>","Optional","Unix timestamp in ms; defaults to server receipt time"],
            ["<code>event_properties</code>","Optional","Key-value pairs for the event"],
            ["<code>user_properties</code>","Optional","Updates user profile alongside the event"]
          ]},
          {type:"note", text:"<b>Common error codes:</b> <code>400</code> invalid JSON / missing fields · <code>413</code> payload too large (max 1MB) · <code>429</code> rate limit exceeded (pause 15s, then retry)."}
        ]
      },
      {
        n:"2", title:"Identify API", dir:"in",
        endpoint:"POST https://api2.amplitude.com/identify  (or GET with query params)",
        auth:"API Key in body / query params",
        useCase:"Update user properties without sending an event.",
        parts:[
          {type:"code", label:"Sample request · POST", lang:"bash", code:`curl --location --request POST 'https://api2.amplitude.com/identify' \\
  --header 'Content-Type: application/x-www-form-urlencoded' \\
  --data-urlencode 'api_key=YOUR_API_KEY' \\
  --data-urlencode 'identification=[{
    "user_id": "user_123",
    "user_properties": {
      "$set": { "plan_type": "enterprise", "account_manager": "Yi Shiean" },
      "$add": { "total_purchases": 1 },
      "$setOnce": { "first_purchase_date": "2026-01-15" }
    }
  }]'`},
          {type:"code", label:"Sample response · 200 OK", lang:"json", code:`{
  "code": 200,
  "events_ingested": 1,
  "payload_size_bytes": 128,
  "server_upload_time": 1396381378123
}`},
          {type:"paramTable", title:"User property operators — where parameter variations matter", headers:["Operator","What it does","Example"], rows:[
            ["<code>$set</code>","Set or overwrite a property value","<code>\"$set\": {\"plan_type\": \"enterprise\"}</code>"],
            ["<code>$setOnce</code>","Set only if the property doesn't already exist","<code>\"$setOnce\": {\"signup_date\": \"2026-01-01\"}</code>"],
            ["<code>$add</code>","Increment a numeric property","<code>\"$add\": {\"session_count\": 1}</code>"],
            ["<code>$append</code>","Add a value to an array property","<code>\"$append\": {\"tags\": \"vip\"}</code>"],
            ["<code>$unset</code>","Remove a property entirely","<code>\"$unset\": {\"old_field\": \"-\"}</code>"],
            ["<code>$prepend</code>","Prepend a value to an array","<code>\"$prepend\": {\"history\": \"checkout\"}</code>"]
          ]},
          {type:"warn", text:"You cannot mix operators with top-level properties. Always wrap all property updates inside the appropriate operator."}
        ]
      },
      {
        n:"3", title:"Behavioral Cohorts API", dir:"both",
        endpoint:"https://amplitude.com/api/5/cohorts (download) · /api/3/cohorts (upload/update)",
        auth:"Basic Auth (api_key:secret_key)",
        useCase:"Multi-method — behavior changes significantly by endpoint.",
        parts:[
          {type:"subhead", text:"GET — List all cohorts"},
          {type:"code", lang:"bash", code:`curl --location --request GET 'https://amplitude.com/api/3/cohorts' \\
  -u '{api_key}:{secret_key}'`},
          {type:"code", lang:"json", code:`{
  "cohorts": [{
    "id": "cohort_abc123",
    "name": "High LTV Users",
    "size": 4521,
    "type": "dynamic",
    "lastComputed": 1700000000000
  }]
}`},
          {type:"subhead", text:"GET — Download a cohort (2-step async)"},
          {type:"code", lang:"bash", code:`# Step 1 — Request cohort export (returns request_id)
curl --request GET 'https://amplitude.com/api/5/cohorts/request/{cohort_id}' \\
  -u '{api_key}:{secret_key}'
# -> { "request_id": "abc-xyz-789", "async_status": "JOB ENQUEUED" }

# Step 2 — Poll status (202 while running, 200 when complete)
curl --request GET 'https://amplitude.com/api/5/cohorts/request-status/{request_id}' \\
  -u '{api_key}:{secret_key}'

# Step 3 — Download file (302 redirects to S3 URL, valid 1 minute)
curl --request GET 'https://amplitude.com/api/5/cohorts/request/{request_id}/file' \\
  -u '{api_key}:{secret_key}'`},
          {type:"subhead", text:"POST — Upload a static cohort"},
          {type:"code", lang:"bash", code:`curl --request POST 'https://amplitude.com/api/3/cohorts/upload' \\
  --header 'Content-Type: application/json' \\
  -u '{api_key}:{secret_key}' \\
  --data '{
    "name": "VIP Loyalty Members",
    "app_id": 123456,
    "id_type": "BY_AMP_ID",
    "ids": ["amp_id_1", "amp_id_2", "amp_id_3"],
    "owner": "yi.shiean@amplitude.com",
    "published": true
  }'`},
          {type:"subhead", text:"POST — Update cohort membership incrementally"},
          {type:"code", lang:"bash", code:`curl --request POST 'https://amplitude.com/api/3/cohorts/membership' \\
  --header 'Content-Type: application/json' \\
  -u '{api_key}:{secret_key}' \\
  --data '{
    "cohort_id": "EXISTING_COHORT_ID",
    "memberships": [
      { "ids": ["user_a", "user_b"], "id_type": "BY_ID", "operation": "ADD" },
      { "ids": ["user_c"], "id_type": "BY_ID", "operation": "REMOVE" }
    ]
  }'`},
          {type:"warn", text:"<b>Large cohort note:</b> the response redirects with a 302 to a pre-signed Amazon S3 URL valid for one minute — access it immediately. The API request link is valid for seven days; during that window you can re-request to get a fresh S3 link."}
        ]
      },
      {
        n:"4", title:"User Profile API", dir:"out",
        endpoint:"GET https://profile-api.amplitude.com/v1/userprofile",
        auth:"Authorization: Api-Key SECRET_KEY header",
        useCase:"Returns different data depending on which query parameters you pass.",
        parts:[
          {type:"paramTable", title:"Parameter variations — how the response changes", headers:["Parameter","What it returns","When to use"], rows:[
            ["<code>user_id=X</code>","Base user profile","Always required (or <code>device_id</code>)"],
            ["<code>get_amp_props=true</code>","Adds all user + computed properties","Personalization based on user attributes"],
            ["<code>get_cohorts=true</code>","Adds array of cohort IDs the user belongs to","Feature gating or audience checks"],
            ["<code>rec_id=X</code>","Adds ranked recommendation list for that model","Next-best-action personalization"],
            ["<code>prediction_id=X</code>","Adds propensity score for that prediction model","Likelihood-to-convert scoring"],
            ["<code>comp_id=X</code>","Adds computed property value by computation ID","Custom computed metrics at runtime"]
          ]},
          {type:"code", label:"Sample request — fetch everything", lang:"bash", code:`curl -H "Authorization: Api-Key YOUR_SECRET_KEY" \\
  'https://profile-api.amplitude.com/v1/userprofile?user_id=user_123&get_amp_props=true&get_cohorts=true&rec_id=s234ssg&prediction_id=t456tth'`},
          {type:"code", label:"Sample response", lang:"json", code:`{
  "userData": {
    "user_id": "user_123",
    "device_id": "ffff-ffff-ffff-ffff",
    "amp_props": {
      "plan_type": "premium",
      "country": "Singapore",
      "gp:membership_points": "1752",
      "first_used": "2025-06-01"
    },
    "cohort_ids": ["cohort_vip", "cohort_highltv"],
    "recommendations": [{
      "rec_id": "s234ssg",
      "items": ["product_a", "product_b", "product_c"],
      "is_control": false,
      "last_updated": 1700000000
    }],
    "predictions": [{
      "name": "Likelihood to Convert",
      "percentile": 97.5,
      "pred_id": "t456tth",
      "probability": 0.734
    }]
  }
}`},
          {type:"warn", text:"Not supported for customers in Amplitude's EU data processing region. Use the User Profile API <b>server-side only</b> — calling it from the client may expose your project's secret key."}
        ]
      },
      {
        n:"5", title:"Export API", dir:"out",
        endpoint:"GET https://amplitude.com/api/2/export",
        auth:"Basic Auth (api_key:secret_key)",
        useCase:"Pull all raw events for a project within a time range.",
        parts:[
          {type:"code", label:"Sample request", lang:"bash", code:`curl --location --request GET \\
  'https://amplitude.com/api/2/export?start=20260601T00&end=20260601T23' \\
  -u '{api_key}:{secret_key}'`},
          {type:"paramTable", title:"Key parameters", headers:["Parameter","Format","Notes"], rows:[
            ["<code>start</code>","<code>YYYYMMDDTHH</code>","Hour granularity. Use <code>T00</code> to start from midnight."],
            ["<code>end</code>","<code>YYYYMMDDTHH</code>","Inclusive. Use <code>T23</code> for end of day."]
          ]},
          {type:"plain", text:"<b>Response:</b> a zipped <code>.gz</code> archive of JSON files — one or more per hour by volume. Each line is one JSON event object."},
          {type:"code", label:"Sample event object (one line)", lang:"json", code:`{
  "event_type": "Purchase Completed",
  "user_id": "user_123",
  "device_id": "abc-device-xyz",
  "event_time": "2026-06-01 14:23:45.000000",
  "server_upload_time": "2026-06-01 14:23:46.123000",
  "event_properties": { "product_id": "SKU-456", "amount": 99.00 },
  "user_properties": { "plan_type": "premium", "country": "Singapore" },
  "amplitude_id": 12345678,
  "session_id": 1614192260000,
  "platform": "iOS",
  "os_version": "17.0",
  "country": "Singapore",
  "city": "Singapore"
}`},
          {type:"paramTable", title:"Constraints to flag for engineers", headers:["Constraint","Detail"], rows:[
            ["Max response size","4GB per request — use S3 Export if data exceeds this"],
            ["Max date range","365 days per single request"],
            ["Data availability","Events available ~2 hours after ingestion (export lag)"],
            ["Time reference","<code>start</code>/<code>end</code> refer to <code>server_upload_time</code>, not <code>event_time</code>"],
            ["EU residency","Use <code>https://analytics.eu.amplitude.com/api/2/export</code>"]
          ]}
        ]
      }
    ]}
  ]
},

/* ---------- SECTION 2 — CONNECTORS ---------- */
{
  id: "sec-2", num: "02", nav: "Connector Sources", lane: "in",
  title: "Getting Data In — Connectors",
  intro: "Use these when data already lives in another system and you want to route it into Amplitude without custom instrumentation.",
  blocks: [
    { type:"subsection", id:"sub-cdp-sources", label:"CDPs, Attribution & Marketing Sources", note:"Ranked by actual ingestion volume — Growth + Enterprise customers, last 30 days. Partners marked \u21c4 Both are bidirectional — full in/out integration details are in Section 3b." },
    { type:"table",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Category", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", partner:"Segment", cat:"CDP", what:"Routes events from your existing Segment pipeline into Amplitude without re-instrumentation.", use:"Mirror all Segment events into Amplitude for behavioral analytics without changing a line of tracking code.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/segment")]},
        {rank:2, dir:"in", partner:"mParticle", cat:"CDP", what:"Forwards events and user data from mParticle's customer data platform into Amplitude.", use:"Large enterprise with mParticle as the central event router — Amplitude becomes the analytics layer without changing instrumentation.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/mparticle")]},
        {rank:3, dir:"both", partner:"Braze", cat:"Marketing Automation", what:"Sends Braze engagement events (email opens, push clicks, campaign interactions) into Amplitude.", use:"Understand how Braze campaign touchpoints influence in-product behavior and downstream retention.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/braze"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:4, dir:"both", partner:"Iterable", cat:"Marketing Automation", what:"Ingests Iterable campaign metrics (email, push, SMS, in-app) into Amplitude — maps Amplitude <code>user_id</code> to Iterable <code>userId</code>; drops anonymous / null userId events.", use:"Correlate email and push engagement with product activation and conversion funnels.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/iterable"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:5, dir:"in", partner:"RudderStack", cat:"CDP", what:"Forwards events from RudderStack's open-source CDP pipeline into Amplitude.", use:"Engineering teams using RudderStack for data routing who want Amplitude analytics without a separate SDK.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/rudderstack")]},
        {rank:6, dir:"both", partner:"AppsFlyer", cat:"Attribution", what:"Two source options: Attribution API V1 (install data only) or HTTP V2 API (install + in-app events) — don't use both at once or you get duplicate events; Amplitude holds attribution events 72hrs for user matching.", use:"Link paid UA campaign performance to in-app behavioral funnels — see which ad networks drive highest-LTV users.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/appsflyer"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:7, dir:"in", partner:"Adjust", cat:"Attribution", what:"Sends mobile attribution events from the Adjust MMP into Amplitude.", use:"Measure which acquisition channels drive the best retention curves, not just installs.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/adjust")]},
        {rank:8, dir:"both", partner:"Intercom", cat:"Customer Engagement", what:"Syncs Intercom event data into Amplitude — covers all conversation, contact, user, visitor, and event topics; maps by <code>user_id</code> or email.", use:"Analyse how support interactions and in-app messaging affect downstream product engagement.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/intercom"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:9, dir:"in", partner:"Google Tag Manager", cat:"Marketing Analytics", what:"Triggers Amplitude SDK calls via GTM tags on web properties — client-side and server-side.", use:"Marketing teams instrument Amplitude on landing pages or web funnels without engineering changes.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/google-tag-manager")]}
      ]
    },
    { type:"subsection", id:"sub-warehouse-sources", label:"Warehouse & Cloud Storage Sources", note:"A distinct ingestion path — used by data and engineering teams to bring offline, CRM, or computed data into Amplitude that SDKs and event streams can't capture. Active org counts are in the 10–20 range: an enterprise expansion motion — low breadth, high strategic depth." },
    { type:"table",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Cloud", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", partner:"Amazon S3", cat:"AWS", what:"Import event or user property data from S3 buckets on a scheduled or event-notification-triggered sync.", use:"Load server-side computed events or CRM exports dropped into S3 by your data pipeline.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/amazon-s3")]},
        {rank:2, dir:"in", partner:"Snowflake", cat:"AWS / Azure / GCP", what:"Query Snowflake tables via SQL and import results as events or user properties on a configurable schedule.", use:"Bring subscription status, LTV tier, or offline purchase data into user profiles to enrich segmentation.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/snowflake")]},
        {rank:3, dir:"in", partner:"Google BigQuery", cat:"GCP", what:"Run SQL against BigQuery and import results as events or user/group properties on a recurring sync.", use:"Pull data science model outputs or aggregated server-side metrics into Amplitude to enrich cohort definitions.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/bigquery")]},
        {rank:4, dir:"in", partner:"Google Cloud Storage", cat:"GCP", what:"Import event or user property data from files stored in a GCS bucket.", use:"GCP-native data teams drop formatted event files into GCS — Amplitude picks them up on a schedule.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/google-cloud-storage")]},
        {rank:5, dir:"in", partner:"Databricks", cat:"AWS / Azure / GCP", what:"Import data from a Databricks Lakehouse using SQL-based scheduled syncs.", use:"Push computed user segments or enriched event data directly into Amplitude from Databricks.", docs:[L("Docs","https://amplitude.com/docs/data/source-catalog/databricks")]}
      ]
    },
    { type:"subsection", label:"Warehouse Ingestion: Events vs User Properties", note:"The nuances data teams keep tripping over." },
    { type:"table", variant:"compare",
      columns:[
        {key:"connector", label:"Connector", w:"conn"},
        {key:"imports", label:"What you can import", w:"cmp"},
        {key:"events", label:"How events are handled", w:"cmp"},
        {key:"props", label:"User & group properties", w:"cmp"},
        {key:"nuance", label:"Key nuance", w:"cmp"}
      ],
      rows:[
        {connector:"Amazon S3", imports:"Events, User Properties, Group Properties", events:"Event import + mutation via a converter file. Supports Append Only and Mirror Sync (insert/update/delete).", props:"<code>$skip_user_properties_sync</code> defaults to <code>true</code> — historical imports will <b>not</b> update user properties unless set to <code>false</code>. Group properties require <code>groups</code> + <code>group_properties</code> objects.", nuance:"Events ingested via Mirror Sync cannot be exported through event streaming destinations. Use Append Only if you need downstream streaming."},
        {connector:"Snowflake", imports:"Events, User Properties, Group Properties, Profiles", events:"Four strategies: Append Only (includes enrichment — ID resolution, attribution, location), Mirror Sync (disables enrichment), Timestamp, and Full Sync.", props:"Sync User/Group Properties are optional toggles on Event imports. Time-ordered syncing is <b>not</b> guaranteed — unlike the Identify API.", nuance:"Max batch: 1B events per query. Max runtime: 12 hours. Mirror Sync supports CDC change tracking natively."},
        {connector:"Databricks", imports:"Events, User Properties, Group Properties, Profiles", events:"SQL-based mapping with Append-Only ingestion. Uses Databricks' native Change Data Feed (CDF) for Mirror Sync.", props:"Supports the VARIANT type — map user, event, and group properties from semi-structured / nested JSON directly.", nuance:"Sync frequency varies independently by data type — Events, User Properties, Group Properties, and Profiles each have their own cadence."},
        {connector:"Google Cloud Storage", imports:"Events, User Properties, Group Properties", events:"Architecturally identical to S3 — same converter language, JSON path syntax, and Data Preview tool.", props:"Same <code>$skip_user_properties_sync = true</code> default as S3. Transformation rules can be applied per field before mapping.", nuance:"GCS import and export are independent connectors. Import supports events + user/group properties separately; export only sends event rows."}
      ]
    }
  ]
},

/* ---------- SECTION 3 — AD NETWORKS ---------- */
{
  id: "sec-3", num: "03", nav: "Ad Networks", lane: "both",
  title: "Ad Networks — Bidirectional",
  intro: "Most major ad networks are fully bidirectional. All ad-network sources ingest a Daily Ad Metrics event once per day — campaign-level spend, clicks, impressions, and optional UTM user properties — used to calculate CAC and ROAS. Destinations receive cohort syncs and/or conversion event streams out of Amplitude for targeting and optimization.",
  blocks: [
    { type:"keyrule", text:"<b>Heads up:</b> ad-network import data does <b>not</b> link to individual user profiles — Daily Ad Metrics are campaign-level aggregates only." },
    { type:"table", variant:"compare",
      columns:[
        {key:"partner", label:"Partner", w:"conn"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"src", label:"Into Amplitude", w:"cmp"},
        {key:"dest", label:"Out of Amplitude", w:"cmp"},
        {key:"nuance", label:"Key nuance", w:"cmp"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {dir:"both", partner:"Google Ads", src:"Spend, click, impression, conversion data as a <code>Daily Ad Metrics</code> event — appears in the Ad Performance dashboard under Marketing Analytics.", dest:"Cohort Sync for audience targeting. Event Stream forwards conversion events for Smart Bidding optimization.", nuance:"UTM params must be added manually via tracking templates or Final URLs — not auto-populated. Without UTMs, CAC and ROAS won't compute.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/google-ads"),L("Cohort","https://amplitude.com/docs/data/destination-catalog/google-ads-cohort-syncing"),L("Stream","https://amplitude.com/docs/data/destination-catalog/google-ads")]},
        {dir:"both", partner:"Facebook Ads / Meta Pixel", src:"Spend, click, and impression data as a <code>Daily Ad Metrics</code> event.", dest:"Facebook Ads: cohort sync to custom audiences for retargeting & lookalikes. Meta Pixel: event streaming via Conversions API for server-side conversion tracking.", nuance:"UTMs must be added manually in Facebook Ads Manager at ad / ad-set level. Missing UTMs break CAC and ROAS, which need matching values across spend and conversion events.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/facebook-ads"),L("Cohort","https://amplitude.com/docs/data/destination-catalog/facebook-ads"),L("Stream","https://amplitude.com/docs/data/destination-catalog/meta-pixel")]},
        {dir:"both", partner:"TikTok Ads", src:"Spend, click, and impression data as a <code>Daily Ad Metrics</code> event; backfills up to 1 year of history.", dest:"Cohort Sync for retargeting. Event Streaming forwards in-app events via TikTok Events API in real time.", nuance:"TikTok doesn't export user-level identifiers (device ID, email, user ID) — events don't link to profiles. Integration requires a TikTok Ads Manager account with admin privileges.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/tiktok-ads"),L("Cohort","https://amplitude.com/docs/data/destination-catalog/tiktok-ads"),L("Stream","https://amplitude.com/docs/data/destination-catalog/tiktok-ads-event-stream")]},
        {dir:"both", partner:"Bing Ads", src:"Spend, click, impression, and conversion data as a <code>Daily Ad Metrics</code> event; backfill up to 1 year.", dest:"Cohort Sync. Event Streaming forwards server-side conversion events via Microsoft Conversions API (CAPI).", nuance:"UTM user properties captured if present in ad URLs. Admin privileges required on the Bing Ads Manager account.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/bing-ads"),L("Cohort","https://amplitude.com/docs/data/destination-catalog/bing-ads-cohort"),L("Stream","https://amplitude.com/docs/data/destination-catalog/bing-ads-event-stream")]},
        {dir:"both", partner:"LinkedIn Ads", src:"Spend, click, and impression data as a <code>Daily Ad Metrics</code> event; backfill up to 1 year.", dest:"Event Streaming only (no cohort sync): streams conversion events to LinkedIn Ads for conversion tracking and optimization.", nuance:"UTM user properties captured if present in ad URLs. Admin privileges required.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/linkedin-ads"),L("Stream","https://amplitude.com/docs/data/destination-catalog/linkedin-ads")]},
        {dir:"in", partner:"X Ads (Twitter)", src:"Spend, click, and impression data as a <code>Daily Ad Metrics</code> event. Choose a 1-day wait (faster, higher underreporting risk) or 3-day wait (slower, more accurate).", dest:"<span class='na'>No destination connector</span>", nuance:"X doesn't export user-level identifiers — events don't link to individual profiles. The 3-day wait absorbs X's retroactive bot-traffic adjustments.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/x-ads")]},
        {dir:"out", partner:"Snapchat", src:"<span class='na'>No source connector</span>", dest:"Cohort Sync only: syncs behavioral cohorts as custom audiences for personalized campaign targeting.", nuance:"Destination-only — Snapchat has no Daily Ad Metrics source connector.", docs:[L("Dest","https://amplitude.com/docs/data/destination-catalog/snapchat")]}
      ]
    }
  ]
},

/* ---------- SECTION 3b — BIDIRECTIONAL PARTNERS ---------- */
{
  id: "sec-3b", num: "03\u00b7B", nav: "Bidirectional Partners", lane: "both",
  title: "Bidirectional Partner Connectors — Full Detail",
  intro: "These partners have multiple integration types covering both directions. Each is broken out with the specific data flowing in and out, so you know exactly what each connection does. Within a partner, every row is a single integration — the mix of \u2193 In and \u2191 Out is what makes the partner bidirectional.",
  blocks: [
    { type:"subsection", label:"Braze \u00b7 4 Integration Types" },
    { type:"table", variant:"integration",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"itype", label:"Integration type", w:"itype"},
        {key:"what", label:"What it does", w:"what"},
        {key:"nuance", label:"Key nuance", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", itype:"Marketing Source", what:"Sends Braze campaign engagement events (email opens, push clicks, in-app message interactions) into Amplitude for funnel and cohort analysis.", nuance:"Pulls from Braze — Amplitude maps user identity by <code>user_id</code>.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/braze")]},
        {rank:2, dir:"out", itype:"Cohort Sync", what:"Sends Amplitude behavioral cohorts to Braze as user segments for targeted messaging.", nuance:"Amplitude recommends two syncs per cohort — one mapping <code>device_id</code> and one <code>user_id</code> — to handle Braze's external_id requirement.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/braze-cohort-sync")]},
        {rank:3, dir:"out", itype:"Event Streaming", what:"Streams Amplitude events to Braze in real time as Braze custom events.", nuance:"Targets p95 latency of 60s; respects Braze's 50,000 req/min rate limit; retries up to 9 times over 4 hours on failure.", docs:[L("Event Stream","https://amplitude.com/docs/data/destination-catalog/braze")]},
        {rank:4, dir:"out", itype:"User Properties Sync", what:"Creates or updates Braze user profiles when Amplitude receives HTTP V2 or Identify API calls — via the Send Users toggle on the Event Stream connector.", nuance:"Runs alongside event streaming, not a separate connector. Update Users Only prevents creating new Braze users for alias-only profiles.", docs:[L("Event Stream","https://amplitude.com/docs/data/destination-catalog/braze")]}
      ]
    },
    { type:"subsection", label:"HubSpot \u00b7 4 Integration Types" },
    { type:"table", variant:"integration",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"itype", label:"Integration type", w:"itype"},
        {key:"what", label:"What it does", w:"what"},
        {key:"nuance", label:"Key nuance", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", itype:"Marketing Source", what:"Amplitude pulls HubSpot email campaign events (Email_Delivered, Email_Open, etc.) in batches every hour.", nuance:"Used to build funnels measuring how email engagement drives downstream product activation.", docs:[L("Marketing Source","https://amplitude.com/docs/data/source-catalog/hubspot")]},
        {rank:2, dir:"in", itype:"HubSpot CMS Source", what:"If HubSpot is your CMS, install Amplitude's tracking script on selected domains from the HubSpot interface — web behavioral events with one line of code.", nuance:"Distinct from the marketing source — targets teams instrumenting Amplitude on HubSpot-hosted sites without touching code.", docs:[L("CMS Source","https://amplitude.com/docs/data/source-catalog/hubspot-quickstart")]},
        {rank:3, dir:"out", itype:"Cohort Sync", what:"Syncs Amplitude behavioral cohorts to HubSpot contact lists for PQL scoring and lead targeting.", nuance:"Supports Email or Contact ID mapping; creates new contacts if email is used and the user doesn't exist; HubSpot silently drops users with no identifiers.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/hubspot-cohort-sync")]},
        {rank:4, dir:"out", itype:"Event Streaming", what:"Maps Amplitude events to HubSpot Internal Event Names and streams them in real time with selected event and user properties.", nuance:"Create HubSpot event definitions before streaming — Amplitude prompts you to create missing events/properties during setup. p95 latency target of 60s.", docs:[L("Event Stream","https://amplitude.com/docs/data/destination-catalog/hubspot")]}
      ]
    },
    { type:"subsection", label:"Iterable \u00b7 3 Integration Types" },
    { type:"table", variant:"integration",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"itype", label:"Integration type", w:"itype"},
        {key:"what", label:"What it does", w:"what"},
        {key:"nuance", label:"Key nuance", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", itype:"Marketing Source", what:"Amplitude ingests Iterable campaign metrics automatically — email, push, SMS, and in-app channel engagement events.", nuance:"Amplitude <code>user_id</code> must match Iterable <code>userId</code>; anonymous / null userId events are dropped.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/iterable")]},
        {rank:2, dir:"out", itype:"Cohort Sync", what:"Syncs Amplitude behavioral cohorts to Iterable user lists on a configurable cadence.", nuance:"Map Amplitude user ID to Iterable user ID before setup; synced cohort appears under Iterable's user list.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/iterable-cohort-sync")]},
        {rank:3, dir:"out", itype:"Event Streaming + User Properties Sync", what:"Streams events to Iterable in real time with full property mapping; Send Users toggle creates/updates Iterable users on Identify API calls.", nuance:"Supports mapping user properties to specific Iterable contact fields; events forwarded as ingested — not on a schedule.", docs:[L("Event Stream","https://amplitude.com/docs/data/destination-catalog/iterable")]}
      ]
    },
    { type:"subsection", label:"Intercom \u00b7 3 Integration Types" },
    { type:"table", variant:"integration",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"itype", label:"Integration type", w:"itype"},
        {key:"what", label:"What it does", w:"what"},
        {key:"nuance", label:"Key nuance", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", itype:"Intercom Source", what:"Syncs Intercom event data to Amplitude — all conversation, contact, contact-tag, user, user-tag, visitor, and event topics.", nuance:"Maps by <code>user_id</code> or email; if email is selected but not found, falls back to user_id; drops events with neither.", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/intercom")]},
        {rank:2, dir:"out", itype:"Cohort Sync", what:"Sends behavioral cohorts from Amplitude to Intercom — supports real-time sync updating every minute.", nuance:"Exports users based on <code>user_id</code>; uses OAuth; requires an Amplitude paid plan.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/intercom-cohort-sync")]},
        {rank:3, dir:"out", itype:"Event Streaming + User Properties Sync", what:"Streams events to Intercom as Intercom data events; Send Users toggle creates/updates Intercom users on Identify API calls.", nuance:"Hard limits: 120 event types total and 20 metadata values per event — filter carefully. Only streams events for users that already exist in Intercom.", docs:[L("Event Stream","https://amplitude.com/docs/data/destination-catalog/intercom")]}
      ]
    },
    { type:"subsection", label:"AppsFlyer \u00b7 3 Integration Types" },
    { type:"table", variant:"integration",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"itype", label:"Integration type", w:"itype"},
        {key:"what", label:"What it does", w:"what"},
        {key:"nuance", label:"Key nuance", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"in", itype:"Attribution Source", what:"Two options — V1 (Attribution API): install data only; V2 (HTTP V2 API): install + in-app event data.", nuance:"Don't use V1 and V2 simultaneously — causes duplicate events. Amplitude holds attribution events up to 72hrs for user matching via Advertising ID (IDFA/IDFV or ADID).", docs:[L("Source","https://amplitude.com/docs/data/source-catalog/appsflyer")]},
        {rank:2, dir:"out", itype:"Cohort Sync", what:"Syncs Amplitude cohorts to AppsFlyer Audiences for performance and organic marketing.", nuance:"Define a separate destination per platform — iOS and Android each need their own. Supports IDFA, GAID, Amplitude User ID, or AppsFlyer Customer User ID.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/appsflyer-cohort")]},
        {rank:3, dir:"out", itype:"Event Streaming", what:"Streams Amplitude in-app conversion events to AppsFlyer in real time.", nuance:"AppsFlyer requires unique event names and doesn't support event properties — use streaming transformations to rename events. All events need an AppsFlyer ID present.", docs:[L("Event Stream","https://amplitude.com/docs/data/destination-catalog/appsflyer")]}
      ]
    }
  ]
},

/* ---------- SECTION 4 — DATA OUT ---------- */
{
  id: "sec-4", num: "04", nav: "Export API's & Warehouse Destinations", lane: "out",
  title: "Getting Data Out — APIs & Warehouse Exports",
  intro: "Use these when you need to pull Amplitude data programmatically — for BI tools, compliance, personalization engines, or custom pipelines.",
  blocks: [
    { type:"subsection", id:"sub-access-apis", label:"Data Access & Export APIs" },
    { type:"table",
      columns:[
        {key:"api", label:"API", w:"api"},
        {key:"methods", label:"Method(s)", w:"methods"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use cases", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {dir:"out", api:"Export API", methods:["GET"], what:"Export all raw event data for a project within a date range as zipped JSON files.", use:"Loading raw events into a warehouse; compliance and audit exports; ad-hoc analysis by data science teams; feeding downstream ML pipelines.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/export")]},
        {dir:"out", api:"Dashboard REST API", methods:["GET"], what:"Retrieve the data behind any Amplitude chart or dashboard in JSON, without requiring UI access.", use:"Embedding metrics in internal ops portals or exec dashboards; automating weekly metric pulls into Slack; custom BI views.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/dashboard-rest")]},
        {dir:"out", api:"User Profile API", methods:["GET"], what:"Fetch a user's properties, computed properties, cohort memberships, and AI recommendations at runtime.", use:"Real-time personalization at page/app load; powering recommendation engines based on predicted propensity scores.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/user-profile")]},
        {dir:"out", api:"DSAR API", methods:["GET"], what:"Retrieve all data Amplitude holds about a specific end user, on demand.", use:"CCPA and PDPA compliance — responding to data access requests; legal and privacy team workflows.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/ccpa-dsar")]},
        {dir:"out", api:"Event Streaming Metrics Summary API", methods:["GET"], what:"Retrieve delivery health metrics for a configured event stream — delivery rates, error counts, latency.", use:"Monitoring active integrations (Amplitude → Braze, → Snowflake); alerting engineering when a stream degrades.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/event-streaming-metrics")]},
        {dir:"out", api:"Session Replay API", methods:["GET"], what:"List session replays and retrieve the underlying replay event files programmatically.", use:"Exporting replay metadata for compliance/QA; surfacing relevant replays alongside support tickets or bug reports.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/session-replay")]}
      ]
    },
    { type:"subsection", id:"sub-warehouse-exports", label:"Warehouse & Cloud Storage Exports", note:"Highest volume destinations globally. Ranked by unique orgs actively exporting (last 90 days rolling)." },
    { type:"table",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Cloud", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"out", partner:"Amazon S3", cat:"AWS", what:"Continuously exports Amplitude event data and merged user IDs to an S3 bucket hourly.", use:"S3 as the landing zone before loading into the warehouse pipeline.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/amazon-s3")]},
        {rank:2, dir:"out", partner:"Google BigQuery", cat:"GCP", what:"Streams Amplitude event data directly into a BigQuery dataset for SQL-based analysis.", use:"Query raw events alongside CRM and transaction data for unified reporting.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/google-bigquery")]},
        {rank:3, dir:"out", partner:"Snowflake", cat:"AWS / Azure / GCP", what:"Exports Amplitude event data to Snowflake on a recurring sync for warehouse-native analytics.", use:"Keep Amplitude as the collection layer and Snowflake as the query layer — no stack change.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/snowflake")]},
        {rank:4, dir:"out", partner:"Amazon Redshift", cat:"AWS", what:"Exports Amplitude events to Redshift for SQL querying and BI tool integration.", use:"Teams running Tableau or Looker on Redshift can pull behavioral data into existing reporting.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/amazon-redshift")]},
        {rank:5, dir:"out", partner:"Amazon Kinesis", cat:"AWS", what:"Streams Amplitude events in real time to Kinesis for event-driven architectures.", use:"Real-time fraud detection or personalization engines that need signals as they happen.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/amazon-kinesis-data-stream")]},
        {rank:6, dir:"out", partner:"Google Cloud Storage", cat:"GCP", what:"Exports event data to GCS buckets on a recurring schedule.", use:"GCS as the landing zone before loading into BigQuery or Dataflow pipelines.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/google-cloud-storage")]},
        {rank:7, dir:"out", partner:"Azure Blob Storage", cat:"Azure", what:"Exports Amplitude event data to Azure Blob on a scheduled basis.", use:"Route data into Azure Data Factory or Synapse pipelines.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/azure-blob-storage")]}
      ]
    },
    { type:"subsection", label:"Warehouse Export: Events vs User Properties" },
    { type:"table", variant:"compare",
      columns:[
        {key:"connector", label:"Connector", w:"conn"},
        {key:"exports", label:"What gets exported", w:"cmp"},
        {key:"format", label:"Event data format", w:"cmp"},
        {key:"props", label:"User property handling", w:"cmp"},
        {key:"nuance", label:"Key nuance", w:"cmp"}
      ],
      rows:[
        {connector:"Amazon S3", exports:"Events + Merged IDs", format:"Zipped JSON, one event object per line, partitioned hourly. Optional event-level filters.", props:"No standalone user-properties export. User properties are embedded inside each event object as a point-in-time snapshot.", nuance:"Also exports a Merged IDs file — tracks when Amplitude merged two identities. Critical for downstream identity resolution."},
        {connector:"Snowflake", exports:"Events + Merged IDs", format:"Structured Event table with recurring syncs. Optional filters. Each sync typically completes in 5–10 minutes.", props:"User properties travel inside the event row as a nested column — no dedicated table. Use the User Profile API for current state.", nuance:"One destination per data type per project. A separate Snowflake Data Share add-on exists — read-only, no custom clustering control."},
        {connector:"Google BigQuery", exports:"Events + Merged IDs", format:"Same structure as S3/Snowflake — events as structured rows, optional filters, recurring hourly syncs.", props:"User properties embedded within event rows only — no standalone table.", nuance:"Source and destination are independent connectors. Import supports user/group properties separately; export only sends event rows."},
        {connector:"Azure Blob Storage", exports:"Events + Merged IDs", format:"Exports event data and merged user data. Optional filters. Recurring syncs as often as hourly.", props:"Same pattern — user properties embedded in event rows only.", nuance:"Events and merged IDs can be exported to separate containers by completing the setup flow twice."}
      ]
    },
    { type:"keyrule", text:"<b>Key rule across all warehouse exports:</b> user properties are never exported as a standalone table — only as a snapshot embedded in each event row at the time that event occurred. To retrieve the current state of a user's properties, use the <a href='https://amplitude.com/docs/apis/analytics/user-profile'>User Profile API</a> instead." },
    { type:"subsection", label:"The \u201cWhat Should I Use?\u201d Decision Table" },
    { type:"table", variant:"decision",
      columns:[
        {key:"scenario", label:"Scenario", w:"scenario"},
        {key:"tool", label:"Right tool", w:"tool"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {scenario:"Get the <b>current state of a user's properties</b> out of Amplitude", tool:"User Profile API — warehouse exports won't give you this", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/user-profile")]},
        {scenario:"<b>Update user properties in bulk</b> from a warehouse", tool:"Snowflake or Databricks import with Sync User Properties enabled — not time-ordered", docs:[L("Snowflake","https://amplitude.com/docs/data/source-catalog/snowflake"),L("Databricks","https://amplitude.com/docs/data/source-catalog/databricks")]},
        {scenario:"<b>Historical data backfill</b> via S3 or GCS", tool:"Explicitly set <code>$skip_user_properties_sync = false</code> or historical profiles won't update", docs:[L("S3","https://amplitude.com/docs/data/source-catalog/amazon-s3"),L("GCS","https://amplitude.com/docs/data/source-catalog/google-cloud-storage")]},
        {scenario:"Need <b>insert/update/delete</b> support on ingested events", tool:"Mirror Sync on Snowflake, Databricks, or S3 — but it disables enrichment and blocks event streaming exports", docs:[L("Data Mutability","https://amplitude.com/docs/data/data-mutability")]},
        {scenario:"Need ingested events to <b>flow downstream to Braze or Iterable</b>", tool:"Use Append Only Sync — Mirror Sync blocks event streaming destinations", docs:[L("Snowflake","https://amplitude.com/docs/data/source-catalog/snowflake"),L("S3","https://amplitude.com/docs/data/source-catalog/amazon-s3")]},
        {scenario:"<b>Embed Amplitude charts</b> in an internal portal", tool:"Dashboard REST API", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/dashboard-rest")]},
        {scenario:"<b>Raw event dump</b> for your data science team", tool:"Export API (up to 4GB) or S3 Export (no size limit)", docs:[L("Export API","https://amplitude.com/docs/apis/analytics/export"),L("S3 Export","https://amplitude.com/docs/data/destination-catalog/amazon-s3")]}
      ]
    }
  ]
},

/* ---------- SECTION 5 — ACTIVATION ---------- */
{
  id: "sec-5", num: "05", nav: "Activation Destinations", lane: "out",
  title: "Getting Data Out — Marketing, CRM & Engagement",
  intro: "Use these to activate Amplitude behavioral segments and events in the tools your marketing, growth, and product teams use every day. Ranked by unique orgs actively syncing (last 90 days rolling).",
  blocks: [
    { type:"subsection", id:"sub-marketing", label:"Marketing Automation & CRM" },
    { type:"table",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Category", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"both", partner:"Braze", cat:"Marketing Automation", what:"Cohort Sync + Event Streaming + User Properties Sync out; campaign engagement events in.", use:"Send a cohort of users who viewed a feature but didn't convert to a Braze nurture campaign — measure whether it drove conversion.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/braze-cohort-sync"),L("Event Stream","https://amplitude.com/docs/data/destination-catalog/braze"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:2, dir:"both", partner:"HubSpot", cat:"CRM", what:"Cohort Sync + Event Streaming out; marketing source + CMS source in.", use:"Update HubSpot lead scores based on in-product behavior — users who hit activation milestones get routed to sales.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/hubspot-cohort-sync"),L("Event Stream","https://amplitude.com/docs/data/destination-catalog/hubspot"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:3, dir:"out", partner:"Customer.io", cat:"Marketing Automation", what:"Streams Amplitude events and syncs cohorts to Customer.io for lifecycle messaging.", use:"Trigger onboarding email sequences the moment a user completes a specific in-app action.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/customer-io-cohort-syncing"),L("Event Stream","https://amplitude.com/docs/data/destination-catalog/customer-io")]},
        {rank:4, dir:"both", partner:"Iterable", cat:"Marketing Automation", what:"Cohort Sync + Event Streaming + User Properties Sync out; campaign engagement events in.", use:"Power Iterable journeys with real-time behavioral triggers — a checkout drop-off gets an automated re-engagement push.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/iterable-cohort-sync"),L("Event Stream","https://amplitude.com/docs/data/destination-catalog/iterable"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:5, dir:"out", partner:"MoEngage", cat:"Marketing Automation", what:"Syncs Amplitude cohorts to MoEngage for segmented push, email, and in-app campaigns.", use:"Mobile-first fintech and e-commerce teams run personalized retention campaigns with cohort sync.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/moengage")]},
        {rank:6, dir:"out", partner:"Salesforce Marketing Cloud", cat:"Marketing Automation", what:"Exports cohorts and event streams into SFMC for enterprise email and journey orchestration.", use:"Inject behavioral signals into SFMC journeys to personalize next-best-action logic.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/salesforce-marketing-cloud-v2")]},
        {rank:7, dir:"out", partner:"Klaviyo", cat:"Email Marketing", what:"Syncs Amplitude cohorts to Klaviyo for email and SMS campaigns.", use:"Segment users by purchase behavior and sync to Klaviyo for personalized product recommendation emails.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/klaviyo")]},
        {rank:8, dir:"out", partner:"Marketo", cat:"Marketing Automation", what:"Syncs Amplitude cohorts into Marketo lead lists for B2B nurture programs.", use:"Route product-qualified leads (users who hit activation milestones) into Marketo for sales follow-up.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/marketo")]}
      ]
    },
    { type:"subsection", label:"Customer Engagement & Push" },
    { type:"table",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Category", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"both", partner:"Intercom", cat:"Customer Engagement", what:"Cohort Sync + Event Streaming + User Properties Sync out; conversation and engagement events in.", use:"Trigger Intercom messages when users reach specific behavioral milestones — note Intercom limits 120 event types and 20 metadata values per event.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/intercom-cohort-sync"),L("Event Stream","https://amplitude.com/docs/data/destination-catalog/intercom"),L("Full detail \u2192 \u00a73b","#sec-3b")]},
        {rank:2, dir:"out", partner:"OneSignal", cat:"Push Notifications", what:"Syncs Amplitude cohorts to OneSignal for targeted push notification campaigns.", use:"Re-engage dormant users — sync a \u201cnot seen in 7 days\u201d cohort to OneSignal for a win-back push.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/onesignal")]},
        {rank:3, dir:"out", partner:"Appcues", cat:"In-App Engagement", what:"Syncs Amplitude cohorts to Appcues to trigger in-app guides, tooltips, and onboarding flows.", use:"Show an onboarding checklist only to users who haven't completed activation steps.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/appcues")]}
      ]
    },
    { type:"subsection", id:"sub-experimentation", label:"Experimentation & Feature Management" },
    { type:"table",
      columns:[
        {key:"rank", label:"#", w:"rank"},
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Category", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {rank:1, dir:"out", partner:"Statsig", cat:"Experimentation", what:"Streams events and syncs cohorts to Statsig for experiment targeting and analysis.", use:"Run experiments in Statsig targeting specific Amplitude cohorts — measure impact back in Amplitude.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/statsig-cohort-sync")]},
        {rank:2, dir:"out", partner:"LaunchDarkly", cat:"Feature Management", what:"Syncs Amplitude behavioral cohorts to LaunchDarkly for feature flag targeting.", use:"Roll out a feature only to your power-user cohort — gate by behavior, not just user ID.", docs:[L("Docs","https://amplitude.com/docs/data/destination-catalog/launchdarkly")]}
      ]
    },
    { type:"subsection", label:"Attribution" },
    { type:"table",
      columns:[
        {key:"partner", label:"Partner", w:"partner"},
        {key:"cat", label:"Category", w:"cat"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use case", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {dir:"both", partner:"AppsFlyer", cat:"Attribution", what:"Cohort Sync + Event Streaming out; attribution and install data in.", use:"Send purchase and subscription events to AppsFlyer to measure true post-install conversion by channel — note AppsFlyer requires unique event names and doesn't support event properties in event streaming.", docs:[L("Cohort Sync","https://amplitude.com/docs/data/destination-catalog/appsflyer-cohort"),L("Event Stream","https://amplitude.com/docs/data/destination-catalog/appsflyer"),L("Full detail \u2192 \u00a73b","#sec-3b")]}
      ]
    }
  ]
},

/* ---------- SECTION 6 — PLATFORM ---------- */
{
  id: "sec-6", num: "06", nav: "Platform Management", lane: "both",
  title: "Platform Management APIs",
  intro: "Use these to govern, automate, and operate Amplitude at scale — tracking plans, identity management, compliance, and access control.",
  blocks: [
    { type:"table",
      columns:[
        {key:"api", label:"API", w:"api"},
        {key:"methods", label:"Method(s)", w:"methods"},
        {key:"dir", label:"Dir", w:"dir"},
        {key:"what", label:"What it does", w:"what"},
        {key:"use", label:"Example use cases", w:"use"},
        {key:"docs", label:"Docs", w:"docs"}
      ],
      rows:[
        {dir:"both", api:"Behavioral Cohorts API", methods:["GET","POST","DELETE"], what:"List, create, export, and import user cohorts between Amplitude and external tools.", use:"Pushing segments to Braze; importing third-party audience lists; automating cohort refresh cycles for CRM or ad platform syncs.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/behavioral-cohorts")]},
        {dir:"both", api:"Taxonomy API", methods:["GET","POST","PUT","DELETE"], what:"Programmatically CRUD event types, event properties, user properties, and categories.", use:"Automating tracking plan governance at scale; syncing event schemas from a central spec; enforcing naming conventions via CI/CD.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/taxonomy")]},
        {dir:"in", api:"Lookup Table API", methods:["GET","POST","PUT","DELETE"], what:"Upload a CSV to map existing property values to new derived properties — no re-instrumentation.", use:"Mapping country codes to region names; enriching SKU IDs with product categories; translating internal tier codes to plan names.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/lookup-table-2")]},
        {dir:"both", api:"User Mapping (Aliasing) API", methods:["GET","POST","DELETE"], what:"Map and unmap users across multiple Amplitude projects to a single global user ID (Portfolio add-on).", use:"Unified cross-product identity for enterprises with multiple products; stitching pre/post-login journeys.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/user-mapping")]},
        {dir:"in", api:"Chart Annotations API", methods:["GET","POST","PUT","DELETE"], what:"Programmatically add and manage annotations to mark significant dates and time ranges on charts.", use:"Auto-tagging deployments from CI/CD; marking campaign launches; flagging incidents for analyst context.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/chart-annotations")]},
        {dir:"in", api:"Releases API", methods:["GET","POST","PUT","DELETE"], what:"Programmatically create and manage product release records in Amplitude.", use:"Connecting release tooling (Jira, GitHub, PagerDuty) so every shipped version is tracked; correlating release cadence with retention.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/releases")]},
        {dir:"in", api:"SCIM API", methods:["GET","POST","PUT","DELETE"], what:"Provision, update, and deprovision Amplitude users and groups via SCIM 2.0.", use:"Auto-provisioning access via Okta, Azure AD, or OneLogin; revoking access on offboarding; managing permission groups at scale.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/scim")]},
        {dir:"out", api:"User Privacy API", methods:["GET","POST","DELETE"], what:"Submit deletion requests to permanently remove all data for specified Amplitude IDs or User IDs.", use:"GDPR right-to-erasure; PDPA deletion workflows; automating deletion when account closure is triggered in your backend.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/user-privacy")]},
        {dir:"out", api:"DSAR API", methods:["GET"], what:"Retrieve all data Amplitude holds about a specific end user, on demand.", use:"CCPA and PDPA compliance — responding to data access requests; automated data-subject request handling pipelines.", docs:[L("Docs","https://amplitude.com/docs/apis/analytics/ccpa-dsar")]},
        {dir:"out", api:"Audit Logs API", methods:["GET"], what:"Export a log of all administrative and user actions taken within Amplitude.", use:"Security monitoring and SIEM integration; SOC 2 / ISO 27001 compliance reporting; investigating unauthorized changes.", docs:[L("Docs","https://amplitude.com/docs/apis/audit-logs")]}
      ]
    }
  ]
}

];
