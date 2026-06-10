# Amplitude API & Integration Ecosystem
### A Cheat Sheet for Product Managers & Engineers

> **How to use this document:**
> Think of Amplitude as a hub. Data flows in, gets analyzed, and flows back out to power experiences and decisions.
> This cheat sheet is organized around that mental model — getting data in, getting data out, and managing the platform.
> Start with the ⚡ Quick Reference table to find your method, then jump to the relevant section for full details.
> Each entry includes a direction indicator: 📥 In (data into Amplitude), 📤 Out (data out of Amplitude), or 🔄 Both.

---

## ⚡ Quick Reference: How Data Moves In and Out of Amplitude

> Start here. Find your method, then jump to the relevant section.

| Method | Direction | Best For | Go To |
|--------|-----------|----------|-------|
| **[HTTP V2 / Batch API](https://amplitude.com/docs/apis/analytics/http-v2)** | 📥 In | Server-side event tracking, backend transactions, high-volume ingestion | Section 1 |
| **[Identify / Group Identify API](https://amplitude.com/docs/apis/analytics/identify)** | 📥 In | Updating user or account properties without sending events | Section 1 |
| **[SDKs (Browser, Mobile, Server)](https://amplitude.com/docs/sdks)** | 📥 In | Client-side and app instrumentation | Section 1 |
| **[CDP Connector (Segment, mParticle, RudderStack)](https://amplitude.com/docs/data/source-catalog)** | 📥 In | Already have a CDP? Route events to Amplitude without re-instrumentation | Section 2 |
| **[Attribution Connector (AppsFlyer, Adjust)](https://amplitude.com/docs/data/source-catalog)** | 📥 In | Link mobile ad spend to in-app user journeys | Section 2 |
| **[Warehouse / Cloud Storage Import](https://amplitude.com/docs/data/source-catalog)** | 📥 In | Enrich Amplitude with CRM, offline, or computed data from your data stack | Section 2 |
| **[Ad Network Source (Google, Facebook, TikTok, Bing, LinkedIn)](https://amplitude.com/docs/data/source-catalog)** | 🔄 Both | Pull ad spend/impression data in; push cohorts and conversion events out | Section 3 |
| **[Bidirectional Partner Connectors (Braze, HubSpot, Iterable, Intercom, AppsFlyer)](https://amplitude.com/docs/data/source-catalog)** | 🔄 Both | Full in + out integrations with multiple sync types per partner | Section 3b |
| **[Export API](https://amplitude.com/docs/apis/analytics/export)** | 📤 Out | Raw event data dump to warehouse, data science, or ML pipelines | Section 4 |
| **[Dashboard REST API](https://amplitude.com/docs/apis/analytics/dashboard-rest)** | 📤 Out | Embed Amplitude charts in your own portals or automate metric reporting | Section 4 |
| **[User Profile API](https://amplitude.com/docs/apis/analytics/user-profile)** | 📤 Out | Real-time user property lookup for personalization at runtime | Section 4 |
| **[Warehouse / Cloud Storage Export](https://amplitude.com/docs/data/destination-catalog)** | 📤 Out | Load Amplitude events into Snowflake, BigQuery, S3, Redshift for SQL analysis | Section 4 |
| **[Marketing Automation Destination](https://amplitude.com/docs/data/destination-catalog)** | 📤 Out | Sync cohorts or stream events to Customer.io, MoEngage, SFMC, Klaviyo, Marketo | Section 5 |
| **[Ad Network Destination](https://amplitude.com/docs/data/destination-catalog)** | 📤 Out | Sync cohorts or stream events to Google Ads, Meta Pixel, TikTok Ads, etc. | Section 3 |
| **[Experimentation / Feature Flags Destination](https://amplitude.com/docs/data/destination-catalog)** | 📤 Out | Sync cohorts to Statsig or LaunchDarkly for targeted feature rollouts | Section 5 |
| **[Taxonomy / Lookup Table / SCIM API](https://amplitude.com/docs/apis/analytics/taxonomy)** | 🔄 Both | Manage tracking plans, user provisioning, and governance programmatically | Section 6 |
| **[User Privacy / DSAR API](https://amplitude.com/docs/apis/analytics/user-privacy)** | 📤 Out | GDPR/PDPA/CCPA compliance — delete or retrieve user data on demand | Section 6 |

---

## Section 1: Getting Data In — Direct APIs
> Use these when you control the instrumentation and want to send data to Amplitude programmatically, without a pre-built connector.

| API | Method(s) | Direction | What It Does | Example Use Cases | Docs |
|-----|-----------|-----------|--------------|-------------------|------|
| **HTTP V2 API** | `POST` | 📥 In | Send events directly from your server to Amplitude in real time, one at a time | Server-side event tracking; capturing backend transactions (payments, bookings, order completions) that shouldn't rely on client SDKs; any environment where an SDK can't be installed | [Docs](https://amplitude.com/docs/apis/analytics/http-v2) |
| **Batch Event Upload API** | `POST` | 📥 In | Upload large volumes of event data asynchronously in a single request — built for bulk, high-throughput ingestion | Backfilling historical event data; bulk-flushing queued server-side events; high-frequency transactional apps (fintech, e-commerce) that batch before sending; data migrations from legacy systems | [Docs](https://amplitude.com/docs/apis/analytics/batch-event-upload) |
| **Identify API** | `GET` `POST` | 📥 In | Update user properties without sending an event — does not count toward monthly event volume | Syncing user attributes from your CRM or auth system (plan tier, subscription status, region); updating properties on upgrade or onboarding completion; keeping Amplitude profiles in sync without inflating event counts | [Docs](https://amplitude.com/docs/apis/analytics/identify) |
| **Group Identify API** | `POST` | 📥 In | Set or update properties on a group (account, company, team) rather than an individual user | B2B analytics — tagging events with account-level attributes like plan type or ARR tier; enabling group-level cohorts and funnels; syncing company data from Salesforce or HubSpot into Amplitude group properties | [Docs](https://amplitude.com/docs/apis/analytics/group-identify) |
| **Attribution API** | `POST` | 📥 In | Send mobile attribution data (IDFA, IDFV, ADID) from MMP partners into Amplitude to connect marketing spend to in-app behavior | Linking AppsFlyer, Adjust, or Branch attribution data to Amplitude user journeys; measuring which paid channels drive highest-value users; correlating campaign touchpoints with downstream conversion and retention | [Docs](https://amplitude.com/docs/apis/analytics/attribution) |
| **AI Feedback API** *(Beta)* | `POST` | 📥 In | Send customer feedback signals (NPS, reviews, support tickets, survey responses) into Amplitude for AI-powered theme analysis | Centralizing voice-of-customer data into Amplitude; surfacing product pain points from qualitative feedback alongside quantitative behavioral data | [Docs](https://amplitude.com/docs/apis/analytics/ai-feedback) |

---

## Section 1b: Top API Drill-Down — Sample Requests & Responses
> Deep-dives on the 5 most commonly used APIs. Shows parameter variations and how different inputs produce different outputs.

---

### 🔵 1. HTTP V2 API
**Endpoint:** `POST https://api2.amplitude.com/2/httpapi`
**Auth:** API Key in request body
**Use case:** Send a single server-side event in real time

**Sample Request:**
```bash
curl --location --request POST 'https://api2.amplitude.com/2/httpapi' \
  --header 'Content-Type: application/json' \
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
      "user_properties": {
        "plan_type": "premium"
      },
      "insert_id": "unique-event-id-789",
      "time": 1396381378123
    }]
  }'
```

**Sample Response (200 OK):**
```json
{
  "code": 200,
  "events_ingested": 1,
  "payload_size_bytes": 312,
  "server_upload_time": 1396381378123
}
```

**Key parameters to know:**
| Parameter | Required | Notes |
|-----------|----------|-------|
| `api_key` | ✅ | Project API key |
| `user_id` | ✅ (or `device_id`) | At least one identifier required |
| `event_type` | ✅ | String name of the event |
| `insert_id` | Recommended | Deduplication key — prevents duplicate events within 7 days |
| `time` | Optional | Unix timestamp in ms; defaults to server receipt time |
| `event_properties` | Optional | Key-value pairs for the event |
| `user_properties` | Optional | Updates user profile alongside the event |

**Common error codes:** `400` invalid JSON / missing fields · `413` payload too large (max 1MB) · `429` rate limit exceeded (pause 15s, then retry)

---

### 🔵 2. Identify API
**Endpoint:** `POST https://api2.amplitude.com/identify` (or `GET` with query params)
**Auth:** API Key in body / query params
**Use case:** Update user properties without sending an event

**Sample Request (POST):**
```bash
curl --location --request POST 'https://api2.amplitude.com/identify' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'api_key=YOUR_API_KEY' \
  --data-urlencode 'identification=[{
    "user_id": "user_123",
    "user_properties": {
      "$set": {
        "plan_type": "enterprise",
        "account_manager": "Yi Shiean"
      },
      "$add": {
        "total_purchases": 1
      },
      "$setOnce": {
        "first_purchase_date": "2026-01-15"
      }
    }
  }]'
```

**Sample Response (200 OK):**
```json
{
  "code": 200,
  "events_ingested": 1,
  "payload_size_bytes": 128,
  "server_upload_time": 1396381378123
}
```

**User property operators — this is where parameter variations matter:**
| Operator | What It Does | Example |
|----------|-------------|---------|
| `$set` | Set or overwrite a property value | `"$set": {"plan_type": "enterprise"}` |
| `$setOnce` | Set only if the property doesn't already exist | `"$setOnce": {"signup_date": "2026-01-01"}` |
| `$add` | Increment a numeric property | `"$add": {"session_count": 1}` |
| `$append` | Add a value to an array property | `"$append": {"tags": "vip"}` |
| `$unset` | Remove a property entirely | `"$unset": {"old_field": "-"}` |
| `$prepend` | Prepend a value to an array | `"$prepend": {"history": "checkout"}` |

> ⚠️ You cannot mix operators with top-level properties. Always wrap all property updates inside the appropriate operator.

---

### 🔵 3. Behavioral Cohorts API
**Base URL:** `https://amplitude.com/api/5/cohorts` (download) · `https://amplitude.com/api/3/cohorts` (upload/update)
**Auth:** Basic Auth (`api_key:secret_key`)
**This API is multi-method — behavior changes significantly by endpoint:**

#### GET — List all cohorts
```bash
curl --location --request GET 'https://amplitude.com/api/3/cohorts' \
  -u '{api_key}:{secret_key}'
```
**Response:**
```json
{
  "cohorts": [
    {
      "id": "cohort_abc123",
      "name": "High LTV Users",
      "size": 4521,
      "type": "dynamic",
      "lastComputed": 1700000000000
    }
  ]
}
```

#### GET — Download a cohort (2-step async)
> Large cohorts require polling. Step 1 triggers the job; Step 2 polls until complete.
```bash
# Step 1 — Request cohort export (returns request_id)
curl --request GET 'https://amplitude.com/api/5/cohorts/request/{cohort_id}' \
  -u '{api_key}:{secret_key}'
# → Returns: { "request_id": "abc-xyz-789", "async_status": "JOB ENQUEUED" }

# Step 2 — Poll status
curl --request GET 'https://amplitude.com/api/5/cohorts/request-status/{request_id}' \
  -u '{api_key}:{secret_key}'
# → Returns 202 while running, 200 when complete

# Step 3 — Download file (302 redirects to S3 URL, valid 1 minute)
curl --request GET 'https://amplitude.com/api/5/cohorts/request/{request_id}/file' \
  -u '{api_key}:{secret_key}'
```

#### POST — Upload a static cohort
```bash
curl --request POST 'https://amplitude.com/api/3/cohorts/upload' \
  --header 'Content-Type: application/json' \
  -u '{api_key}:{secret_key}' \
  --data '{
    "name": "VIP Loyalty Members",
    "app_id": 123456,
    "id_type": "BY_AMP_ID",
    "ids": ["amp_id_1", "amp_id_2", "amp_id_3"],
    "owner": "yi.shiean@amplitude.com",
    "published": true
  }'
```
**Response:**
```json
{
  "cohortId": "NEW_COHORT_ID",
  "metadata": {
    "matched": 3,
    "totals": 3,
    "invalid_ids_sample": []
  }
}
```

#### POST — Update cohort membership incrementally
```bash
curl --request POST 'https://amplitude.com/api/3/cohorts/membership' \
  --header 'Content-Type: application/json' \
  -u '{api_key}:{secret_key}' \
  --data '{
    "cohort_id": "EXISTING_COHORT_ID",
    "memberships": [
      { "ids": ["user_a", "user_b"], "id_type": "BY_ID", "operation": "ADD" },
      { "ids": ["user_c"], "id_type": "BY_ID", "operation": "REMOVE" }
    ]
  }'
```

> ⚠️ **Large cohort note:** For large cohorts, the response redirects with a 302 response code to a pre-signed Amazon S3 download URL. The download URL is valid for one minute, so access it immediately. The API request link is valid for seven days — during those seven days, you can make the same request to get a new S3 link.

---

### 🔵 4. User Profile API
**Endpoint:** `GET https://profile-api.amplitude.com/v1/userprofile`
**Auth:** `Authorization: Api-Key SECRET_KEY` header
**This API returns different data depending on which query parameters you pass:**

**Parameter variations — how the response changes:**
| Parameter | What It Returns | When to Use |
|-----------|----------------|-------------|
| `user_id=X` | Base user profile | Always required (or `device_id`) |
| `get_amp_props=true` | Adds all user properties and computed properties to response | Personalization based on user attributes |
| `get_cohorts=true` | Adds array of cohort IDs the user belongs to | Feature gating or audience checks |
| `rec_id=X` | Adds ranked recommendation list for that rec model | Next-best-action personalization |
| `prediction_id=X` | Adds propensity score for that prediction model | Likelihood-to-convert scoring |
| `comp_id=X` | Adds computed property value by computation ID | Custom computed metrics at runtime |

**Sample Request — fetch everything:**
```bash
curl -H "Authorization: Api-Key YOUR_SECRET_KEY" \
  'https://profile-api.amplitude.com/v1/userprofile?user_id=user_123&get_amp_props=true&get_cohorts=true&rec_id=s234ssg&prediction_id=t456tth'
```

**Sample Response:**
```json
{
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
}
```

> ⚠️ **Important:** This API isn't supported for customers in Amplitude's EU data processing region. Amplitude recommends using the User Profile API server-side only — calling the API from the client may expose your project's secret key.

---

### 🔵 5. Export API
**Endpoint:** `GET https://amplitude.com/api/2/export`
**Auth:** Basic Auth (`api_key:secret_key`)
**Use case:** Pull all raw events for a project within a time range

**Sample Request:**
```bash
curl --location --request GET \
  'https://amplitude.com/api/2/export?start=20260601T00&end=20260601T23' \
  -u '{api_key}:{secret_key}'
```

**Key parameters:**
| Parameter | Format | Notes |
|-----------|--------|-------|
| `start` | `YYYYMMDDTHH` | Hour granularity. Use `T00` to start from midnight. |
| `end` | `YYYYMMDDTHH` | Inclusive. Use `T23` for end of day. |

**Response:** A zipped archive (`.gz`) of JSON files — one or more files per hour depending on data volume. Each line in the file is one JSON event object.

**Sample event object (one line in the export file):**
```json
{
  "event_type": "Purchase Completed",
  "user_id": "user_123",
  "device_id": "abc-device-xyz",
  "event_time": "2026-06-01 14:23:45.000000",
  "server_upload_time": "2026-06-01 14:23:46.123000",
  "event_properties": {
    "product_id": "SKU-456",
    "amount": 99.00
  },
  "user_properties": {
    "plan_type": "premium",
    "country": "Singapore"
  },
  "amplitude_id": 12345678,
  "session_id": 1614192260000,
  "platform": "iOS",
  "os_version": "17.0",
  "country": "Singapore",
  "city": "Singapore"
}
```

**Key constraints to flag for engineers:**
| Constraint | Detail |
|-----------|--------|
| Max response size | 4GB per request — use S3 Export if data exceeds this |
| Max date range | 365 days per single request |
| Data availability | Events available ~2 hours after ingestion (export lag) |
| Time reference | `start`/`end` refer to `server_upload_time`, not `event_time` |
| EU residency | Use `https://analytics.eu.amplitude.com/api/2/export` |


> Use these when data already lives in another system and you want to route it into Amplitude without custom instrumentation.

### CDPs, Attribution & Marketing Automation Sources
> Ranked by actual ingestion volume — Growth + Enterprise customers, last 30 days.
> Source: [Amplitude internal ingestion metrics](https://app.amplitude.com/analytics/amplitude/chart/u2ko5g5)
> ⚠️ Partners marked 🔄 are bidirectional — full in/out integration details are in **Section 3b**.

| Rank | Partner | Category | Direction | What It Does | Example Use Case | Docs |
|------|---------|----------|-----------|--------------|-----------------|------|
| 🥇 1 | **Segment** | CDP | 📥 In | Routes events from your existing Segment pipeline into Amplitude without re-instrumentation | Already using Segment for your data layer? Mirror all events into Amplitude for behavioral analytics without changing a line of tracking code | [Docs](https://amplitude.com/docs/data/source-catalog/segment) |
| 🥈 2 | **mParticle** | CDP | 📥 In | Forwards events and user data from mParticle's customer data platform into Amplitude | Large enterprise with mParticle as the central event router — Amplitude becomes the analytics layer without changing instrumentation | [Docs](https://amplitude.com/docs/data/source-catalog/mparticle) |
| 🥉 3 | **Braze** | Marketing Automation | 🔄 Both | Sends Braze engagement events (email opens, push clicks, campaign interactions) into Amplitude | Understand how Braze campaign touchpoints influence in-product behavior and downstream retention | [Source](https://amplitude.com/docs/data/source-catalog/braze) · [Full detail → Section 3b] |
| 4 | **Iterable** | Marketing Automation | 🔄 Both | Ingests Iterable campaign metrics (email, push, SMS, in-app) into Amplitude — maps Amplitude user_id to Iterable userId; drops anonymous/null userId events | Correlate email and push engagement with product activation and conversion funnels | [Source](https://amplitude.com/docs/data/source-catalog/iterable) · [Full detail → Section 3b] |
| 5 | **RudderStack** | CDP | 📥 In | Forwards events from RudderStack's open-source CDP pipeline into Amplitude | Engineering teams using RudderStack for data routing who want Amplitude analytics without a separate SDK | [Docs](https://amplitude.com/docs/data/source-catalog/rudderstack) |
| 6 | **AppsFlyer** | Attribution | 🔄 Both | Two source options: Attribution API V1 (install data only) or HTTP V2 API (install + in-app events) — don't use both simultaneously as it causes duplicate events; Amplitude holds attribution events 72hrs for user matching | Link paid UA campaign performance to in-app behavioral funnels — see which ad networks drive your highest-LTV users | [Source](https://amplitude.com/docs/data/source-catalog/appsflyer) · [Full detail → Section 3b] |
| 7 | **Adjust** | Attribution | 📥 In | Sends mobile attribution events from Adjust MMP into Amplitude | Measure which acquisition channels drive the best retention curves, not just installs | [Docs](https://amplitude.com/docs/data/source-catalog/adjust) |
| 8 | **Intercom** | Customer Engagement | 🔄 Both | Syncs Intercom event data to Amplitude — covers all conversation, contact, user, visitor, and event topics; maps by user_id or email | Analyse how support interactions and in-app messaging affect downstream product engagement | [Source](https://amplitude.com/docs/data/source-catalog/intercom) · [Full detail → Section 3b] |
| 9 | **Google Tag Manager** | Marketing Analytics | 📥 In | Triggers Amplitude SDK calls via GTM tags on web properties — client-side and server-side | Marketing teams instrument Amplitude on landing pages or web funnels without requiring engineering changes | [Docs](https://amplitude.com/docs/data/source-catalog/google-tag-manager) |

---

### Warehouse & Cloud Storage Sources
> A distinct ingestion path — used by data and engineering teams to bring offline, CRM, or computed data into Amplitude that SDKs and event streams can't capture.
> Usage note: Active org counts are in the 10–20 range. This is an enterprise expansion motion — low breadth, high strategic depth.
> Source: [Databricks Import chart](https://app.amplitude.com/analytics/amplitude/chart/1i3z5nhy) | [S3 Import Orgs chart](https://app.amplitude.com/analytics/amplitude/chart/z1xs9t6x)

| Rank | Partner | Cloud Provider | Direction | What It Does | Example Use Case | Docs |
|------|---------|----------------|-----------|--------------|-----------------|------|
| 🥇 1 | **Amazon S3** | AWS | 📥 In | Import event or user property data stored in S3 buckets into Amplitude on a scheduled or event-notification-triggered sync | Load server-side computed events or CRM exports dropped into S3 by your data pipeline into Amplitude for behavioral analysis | [Docs](https://amplitude.com/docs/data/source-catalog/amazon-s3) |
| 🥈 2 | **Snowflake** | AWS / Azure / GCP | 📥 In | Query Snowflake tables via SQL and import results into Amplitude as events or user properties on a configurable schedule | Bring subscription status, LTV tier, or offline purchase data from Snowflake into Amplitude user profiles to enrich behavioral segmentation | [Docs](https://amplitude.com/docs/data/source-catalog/snowflake) |
| 🥉 3 | **Google BigQuery** | GCP | 📥 In | Run SQL queries against BigQuery and import results into Amplitude as events or user/group properties on a recurring sync | Pull data science model outputs or aggregated server-side metrics from BigQuery into Amplitude to enrich cohort definitions | [Docs](https://amplitude.com/docs/data/source-catalog/bigquery) |
| 4 | **Google Cloud Storage (GCS)** | GCP | 📥 In | Import event or user property data from files stored in a GCS bucket into Amplitude | GCP-native data teams drop formatted event files into GCS as part of their pipeline — Amplitude picks them up on a schedule | [Docs](https://amplitude.com/docs/data/source-catalog/google-cloud-storage) |
| 5 | **Databricks** | AWS / Azure / GCP | 📥 In | Import data from a Databricks Lakehouse into Amplitude using SQL-based scheduled syncs | Data engineering teams using Databricks as their unified analytics platform push computed user segments or enriched event data directly into Amplitude | [Docs](https://amplitude.com/docs/data/source-catalog/databricks) |
| 6 | **Azure Blob Storage** | Azure | 📥 In | Import event or user property data from files stored in an Azure Blob container into Amplitude | Azure-native enterprises that stage processed event files in Blob Storage before ingestion into downstream tools, including Amplitude | [Docs](https://amplitude.com/docs/data/source-catalog/azure-blob-storage) |

---

### Warehouse Ingestion: Events vs User Properties — Key Differences

| Connector | What You Can Import | How Events Are Handled | How User & Group Properties Are Handled | Key Nuance | Docs |
|-----------|--------------------|-----------------------|-----------------------------------------|------------|------|
| **Amazon S3** | Events, User Properties, Group Properties | Supports event import and mutation via a converter file. Supports Append Only and Mirror Sync (insert/update/delete). | `$skip_user_properties_sync` defaults to `true` — historical imports will NOT update user properties unless you explicitly set it to `false`. Group properties require `groups` + `group_properties` objects in HTTP API format. | Events ingested via Mirror Sync cannot be exported through event streaming destinations. Use Append Only if you need downstream streaming to Braze, Iterable, etc. | [Source](https://amplitude.com/docs/data/source-catalog/amazon-s3) · [Converter Reference](https://amplitude.com/docs/data/converter-configuration-reference) |
| **Snowflake** | Events, User Properties, Group Properties, Profiles | Four strategies: Append Only (includes Amplitude enrichment — ID resolution, attribution, location), Mirror Sync (insert/update/delete, disables enrichment), Timestamp, and Full Sync. | Sync User Properties and Sync Group Properties are optional toggles on Event imports. Time-ordered syncing of user/group properties is not guaranteed — unlike the Identify API. | Max batch: 1B events per query. Max runtime: 12 hours. Mirror Sync supports CDC change tracking natively in Snowflake. | [Source](https://amplitude.com/docs/data/source-catalog/snowflake) · [Data Mutability](https://amplitude.com/docs/data/data-mutability) |
| **Databricks** | Events, User Properties, Group Properties, Profiles | SQL-based mapping with Append-Only ingestion. Sync User Properties and Sync Group Properties are optional toggles. Uses Databricks' native Change Data Feed (CDF) for Mirror Sync. | Supports VARIANT data type — allows mapping of user, event, and group properties from semi-structured or nested JSON directly from Databricks. | Sync frequency varies independently by data type — Events, User Properties, Group Properties, and Profiles each have their own cadence. | [Source](https://amplitude.com/docs/data/source-catalog/databricks) · [Data Mutability](https://amplitude.com/docs/data/data-mutability) |
| **GCS** | Events, User Properties, Group Properties | Architecturally identical to S3 Import — same converter language, same JSON path extraction syntax, same Data Preview tool. | Same `$skip_user_properties_sync = true` default as S3. Transformation rules can be applied per field before mapping. | GCS import and GCS export are independent connectors. Import supports events + user/group properties separately; export only sends event rows with embedded user properties. | [Source](https://amplitude.com/docs/data/source-catalog/google-cloud-storage) · [Converter Reference](https://amplitude.com/docs/data/converter-configuration-reference) |

---

## Section 3: Ad Networks — Bidirectional
> Most major ad networks are fully bidirectional. All ad network sources ingest a `Daily Ad Metrics` event once per day containing campaign-level spend, clicks, impressions, and optional UTM user properties — used to calculate CAC and ROAS. Ad network destinations receive cohort syncs and/or conversion event streams out of Amplitude for targeting and optimization.
> ⚠️ Ad network import data does NOT link to individual user profiles — metrics are campaign-level aggregates only.

| Partner | Direction | What Comes INTO Amplitude | What Goes OUT of Amplitude | Key Nuance | Source Docs | Destination Docs |
|---------|-----------|--------------------------|---------------------------|------------|-------------|-----------------|
| **Google Ads** | 🔄 Both | Spend, click, impression, conversion data as `Daily Ad Metrics` event — available in Ad Performance dashboard under Marketing Analytics after import | Cohort Sync: behavioral cohorts for audience targeting. Event Stream: conversion events for Smart Bidding optimization | UTM params must be manually added via tracking templates or Final URLs — not auto-populated; without UTMs, CAC and ROAS won't compute | [Source](https://amplitude.com/docs/data/source-catalog/google-ads) | [Cohort](https://amplitude.com/docs/data/destination-catalog/google-ads-cohort-syncing) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/google-ads) |
| **Facebook Ads / Meta Pixel** | 🔄 Both | Spend, click, and impression data as `Daily Ad Metrics` event | Facebook Ads: cohort sync to custom audiences for retargeting and lookalike modeling. Meta Pixel: event streaming via Conversions API for server-side conversion tracking | UTM params must be manually added in Facebook Ads Manager at ad/ad set level — not auto-populated; missing UTMs break CAC and ROAS calculations as they require matching values across ad spend and conversion events | [Source](https://amplitude.com/docs/data/source-catalog/facebook-ads) | [Cohort](https://amplitude.com/docs/data/destination-catalog/facebook-ads) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/meta-pixel) |
| **TikTok Ads** | 🔄 Both | Spend, click, and impression data as `Daily Ad Metrics` event; backfills up to 1 year of historical data | Cohort Sync: behavioral cohorts for retargeting. Event Streaming: forwards in-app events via TikTok Events API in real time | TikTok doesn't export user-level identifiers (device ID, email, user ID) — Daily Ad Metrics events don't link to individual user profiles; TikTok Ads Manager account requires administrator privileges for the integration | [Source](https://amplitude.com/docs/data/source-catalog/tiktok-ads) | [Cohort](https://amplitude.com/docs/data/destination-catalog/tiktok-ads) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/tiktok-ads-event-stream) |
| **Bing Ads** | 🔄 Both | Spend, click, impression, and conversion data as `Daily Ad Metrics` event; supports backfill up to 1 year | Cohort Sync: behavioral cohorts. Event Streaming: server-side conversion events via Microsoft Conversions API (CAPI) | UTM user properties captured if present in ad URLs; administrator privileges required for the Bing Ads Manager account | [Source](https://amplitude.com/docs/data/source-catalog/bing-ads) | [Cohort](https://amplitude.com/docs/data/destination-catalog/bing-ads-cohort-sync) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/bing-ads-event-stream) |
| **LinkedIn Ads** | 🔄 Both | Spend, click, and impression data as `Daily Ad Metrics` event; supports backfill up to 1 year | Event Streaming only (no cohort sync): streams conversion events to LinkedIn Ads for conversion tracking and optimization | UTM user properties captured if present in ad URLs; administrator privileges required | [Source](https://amplitude.com/docs/data/source-catalog/linkedin-ads) | [Event Stream](https://amplitude.com/docs/data/destination-catalog/linkedin-ads) |
| **X Ads (Twitter)** | 📥 In only | Spend, click, and impression data as `Daily Ad Metrics` event — choose 1-day wait (faster, higher underreporting risk) or 3-day wait (slower, more accurate due to X's retroactive bot traffic adjustments) | ❌ No destination connector | X doesn't export user-level identifiers — Daily Ad Metrics events don't link to individual user profiles | [Source](https://amplitude.com/docs/data/source-catalog/x-ads) | — |
| **Snapchat** | 📤 Out only | ❌ No source connector | Cohort Sync only: syncs behavioral cohorts as custom audiences for personalized campaign targeting | — | — | [Destination](https://amplitude.com/docs/data/destination-catalog/snapchat) |

---

## Section 3b: Bidirectional Partner Connectors — Full Detail
> These partners have multiple integration types covering both directions. Each is broken out with the specific data flowing in and out, so you know exactly what each connection does.

---

### 🟠 Braze — 4 Integration Types

| # | Direction | Integration Type | What It Does | Key Nuance | Docs |
|---|-----------|----------------|--------------|------------|------|
| 1 | 📥 In | **Marketing Source** | Sends Braze campaign engagement events (email opens, push clicks, in-app message interactions) into Amplitude for funnel and cohort analysis | Pulls from Braze — Amplitude maps user identity by user_id | [Source](https://amplitude.com/docs/data/source-catalog/braze) |
| 2 | 📤 Out | **Cohort Sync** | Sends Amplitude behavioral cohorts to Braze as user segments for targeted messaging | Amplitude recommends two syncs per cohort — one mapping device_id and one mapping user_id — to handle Braze's external_id requirement for identified users | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/braze-cohort-sync) |
| 3 | 📤 Out | **Event Streaming** | Streams Amplitude events to Braze in real time as Braze custom events | Amplitude targets p95 latency of 60 seconds; respects Braze's rate limit of 50,000 requests/minute; retries up to 9 times over 4 hours on failure | [Event Stream](https://amplitude.com/docs/data/destination-catalog/braze) |
| 4 | 📤 Out | **User Properties Sync** | Creates or updates Braze user profiles when Amplitude receives HTTP V2 or Identify API calls — enabled via the Send Users toggle in the Event Stream connector | Runs alongside event streaming — not a separate connector; Update Users Only option prevents creating new Braze users for alias-only profiles | [Event Stream](https://amplitude.com/docs/data/destination-catalog/braze) |

---

### 🟦 HubSpot — 4 Integration Types

| # | Direction | Integration Type | What It Does | Key Nuance | Docs |
|---|-----------|----------------|--------------|------------|------|
| 1 | 📥 In | **Marketing Source** | Amplitude pulls HubSpot email campaign events (Email_Delivered, Email_Open, etc.) in batches every 1 hour | Used to build funnels measuring how email campaign engagement drives downstream product activation | [Marketing Source](https://amplitude.com/docs/data/source-catalog/hubspot) |
| 2 | 📥 In | **HubSpot CMS Source** | If HubSpot is your CMS, install Amplitude's tracking script on selected domains directly from the HubSpot interface — sends web behavioral events into Amplitude with one line of code | Distinct from the marketing source — targets engineering/growth teams instrumenting Amplitude on HubSpot-hosted websites without touching code | [CMS Source](https://amplitude.com/docs/data/source-catalog/hubspot-quickstart) |
| 3 | 📤 Out | **Cohort Sync** | Syncs Amplitude behavioral cohorts to HubSpot contact lists for PQL scoring and lead targeting | Supports Email or Contact ID mapping; creates new HubSpot contacts if email is used as ID and user doesn't exist; HubSpot silently drops users it has no identifiers for | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/hubspot-cohort-sync) |
| 4 | 📤 Out | **Event Streaming** | Maps Amplitude events to HubSpot Internal Event Names and streams them in real time with selected event and user properties | Must create HubSpot event definitions before streaming — Amplitude prompts you to create missing events/properties during setup; p95 latency target of 60 seconds | [Event Stream](https://amplitude.com/docs/data/destination-catalog/hubspot) |

---

### 🟣 Iterable — 3 Integration Types

| # | Direction | Integration Type | What It Does | Key Nuance | Docs |
|---|-----------|----------------|--------------|------------|------|
| 1 | 📥 In | **Marketing Source** | Amplitude ingests Iterable campaign metrics automatically — covers email, push, SMS, and in-app channel engagement events | Amplitude user_id must match Iterable userId; anonymous/null userId events are dropped and not sent | [Source](https://amplitude.com/docs/data/source-catalog/iterable) |
| 2 | 📤 Out | **Cohort Sync** | Syncs Amplitude behavioral cohorts to Iterable user lists on a configurable cadence | Map Amplitude user ID to Iterable user ID before setting up; synced cohort appears under Iterable's user list | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/iterable-cohort-sync) |
| 3 | 📤 Out | **Event Streaming + User Properties Sync** | Streams Amplitude events to Iterable in real time with full property mapping; Send Users toggle creates/updates Iterable users on Identify API calls | Supports mapping Amplitude user properties to specific Iterable contact fields; events forwarded automatically as ingested — not on a schedule | [Event Stream](https://amplitude.com/docs/data/destination-catalog/iterable) |

---

### 🩵 Intercom — 3 Integration Types

| # | Direction | Integration Type | What It Does | Key Nuance | Docs |
|---|-----------|----------------|--------------|------------|------|
| 1 | 📥 In | **Intercom Source** | Syncs Intercom event data to Amplitude — supports all conversation topics, contact topics, contact tag topics, user topics, user tag topics, visitor topics, and event topics | Maps by user_id or email; if email is selected but not found, falls back to user_id; drops events with no email or user ID | [Source](https://amplitude.com/docs/data/source-catalog/intercom) |
| 2 | 📤 Out | **Cohort Sync** | Sends behavioral cohorts from Amplitude to Intercom — supports real-time sync updating every minute | Exports users based on user_id; uses OAuth for authentication; requires Amplitude paid plan | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/intercom-cohort-sync) |
| 3 | 📤 Out | **Event Streaming + User Properties Sync** | Streams events to Intercom as Intercom data events; Send Users toggle creates/updates Intercom users on Amplitude Identify API calls | Hard limits: 120 event types total and 20 metadata values per event — use event filters carefully; Amplitude only streams events for users that already exist in Intercom | [Event Stream](https://amplitude.com/docs/data/destination-catalog/intercom) |

---

### 📱 AppsFlyer — 3 Integration Types

| # | Direction | Integration Type | What It Does | Key Nuance | Docs |
|---|-----------|----------------|--------------|------------|------|
| 1 | 📥 In | **Attribution Source** | Two options — V1 (Attribution API): install data only; V2 (HTTP V2 API): install + in-app event data | Do not use V1 and V2 simultaneously — causes duplicate events; Amplitude holds attribution events for up to 72 hours for user matching via Advertising ID (IDFA/IDFV or ADID) | [Source](https://amplitude.com/docs/data/source-catalog/appsflyer) |
| 2 | 📤 Out | **Cohort Sync** | Syncs Amplitude cohorts to AppsFlyer Audiences for performance and organic marketing | Must define a separate destination per platform — iOS and Android each need their own destination; supports IDFA, GAID, Amplitude User ID, or AppsFlyer Customer User ID as identifiers | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/appsflyer-cohort) |
| 3 | 📤 Out | **Event Streaming** | Streams Amplitude in-app conversion events to AppsFlyer in real time | AppsFlyer requires unique event names and doesn't support event properties — use Amplitude's streaming transformations to rename events before sending; all events must have an AppsFlyer ID present | [Event Stream](https://amplitude.com/docs/data/destination-catalog/appsflyer) |

---

## Section 4: Getting Data Out — APIs & Warehouse Exports

### Data Access & Export APIs
> Use these when you need to pull Amplitude data programmatically — for BI tools, compliance, personalization engines, or custom pipelines.

| API | Method(s) | Direction | What It Does | Example Use Cases | Docs |
|-----|-----------|-----------|--------------|-------------------|------|
| **Export API** | `GET` | 📤 Out | Export all raw event data for a project within a specified date range as zipped JSON files | Loading raw Amplitude events into a warehouse; compliance and audit exports; ad-hoc analysis by data science teams; feeding downstream ML pipelines | [Docs](https://amplitude.com/docs/apis/analytics/export) |
| **Dashboard REST API** | `GET` | 📤 Out | Retrieve the data behind any Amplitude chart or dashboard in JSON format, without requiring UI access | Embedding Amplitude metrics in internal ops portals or executive dashboards; automating weekly metric pulls into Slack; building custom BI views on top of Amplitude analytics | [Docs](https://amplitude.com/docs/apis/analytics/dashboard-rest) |
| **User Profile API** | `GET` | 📤 Out | Fetch a user's properties, computed properties, cohort memberships, and AI recommendations at runtime | Real-time personalization — calling Amplitude at page/app load to decide what content or offer to show a user; powering recommendation engines based on predicted propensity scores | [Docs](https://amplitude.com/docs/apis/analytics/user-profile) |
| **DSAR API** | `GET` | 📤 Out | Retrieve all data Amplitude holds about a specific end user, on demand | CCPA and PDPA compliance — responding to user data access requests; legal and privacy team workflows; building automated data-subject request handling pipelines | [Docs](https://amplitude.com/docs/apis/analytics/ccpa-dsar) |
| **Event Streaming Metrics Summary API** | `GET` | 📤 Out | Retrieve delivery health metrics for a configured event stream — delivery rates, error counts, latency | Monitoring the health of active integrations (Amplitude → Braze, → Snowflake); alerting engineering when a stream degrades; building integration health dashboards | [Docs](https://amplitude.com/docs/apis/analytics/event-streaming-metrics) |
| **Session Replay API** | `GET` | 📤 Out | List session replays and retrieve the underlying replay event files programmatically | Exporting replay metadata for compliance or QA workflows; surfacing relevant replays alongside support tickets or bug reports | [Docs](https://amplitude.com/docs/apis/analytics/session-replay) |

---

### Warehouse & Cloud Storage Exports
> Highest volume destinations globally — primary use case for data and engineering teams.
> Ranked by unique orgs actively exporting (last 90 days rolling).
> Source: [Top Event Streaming Destinations](https://app.amplitude.com/analytics/amplitude/chart/jnlttxk) | [Common Export Destinations](https://app.amplitude.com/analytics/amplitude/chart/ws82109g)

| Rank | Partner | Cloud Provider | Direction | What It Does | Example Use Case | Docs |
|------|---------|----------------|-----------|--------------|-----------------|------|
| 🥇 1 | **Amazon S3** | AWS | 📤 Out | Continuously exports Amplitude event data and merged user IDs to an S3 bucket hourly | Data engineering teams use S3 as the landing zone before loading into their warehouse pipeline | [Docs](https://amplitude.com/docs/data/destination-catalog/amazon-s3) |
| 🥈 2 | **Google BigQuery** | GCP | 📤 Out | Streams Amplitude event data directly into a BigQuery dataset for SQL-based analysis | Data science teams query Amplitude raw events in BigQuery alongside CRM and transaction data for unified reporting | [Docs](https://amplitude.com/docs/data/destination-catalog/google-bigquery) |
| 🥉 3 | **Snowflake** | AWS / Azure / GCP | 📤 Out | Exports Amplitude event data to Snowflake on a recurring sync for warehouse-native analytics | Keep Amplitude as the collection layer and Snowflake as the query layer — no need to change the analytics stack | [Docs](https://amplitude.com/docs/data/destination-catalog/snowflake) |
| 4 | **Amazon Redshift** | AWS | 📤 Out | Exports Amplitude events to Redshift for SQL querying and BI tool integration | Teams running Tableau or Looker on top of Redshift can pull Amplitude behavioral data into their existing reporting stack | [Docs](https://amplitude.com/docs/data/destination-catalog/amazon-redshift) |
| 5 | **Amazon Kinesis** | AWS | 📤 Out | Streams Amplitude events in real time to Kinesis for event-driven architectures | Real-time fraud detection or personalization engines that need behavioral signals as they happen, not in batch | [Docs](https://amplitude.com/docs/data/destination-catalog/amazon-kinesis-data-stream) |
| 6 | **Google Cloud Storage** | GCP | 📤 Out | Exports event data to GCS buckets on a recurring schedule | GCP-native teams use GCS as the landing zone before loading into BigQuery or Dataflow pipelines | [Docs](https://amplitude.com/docs/data/destination-catalog/google-cloud-storage) |
| 7 | **Azure Blob Storage** | Azure | 📤 Out | Exports Amplitude event data to Azure Blob on a scheduled basis | Azure-native enterprises route Amplitude data into Azure Data Factory or Synapse pipelines | [Docs](https://amplitude.com/docs/data/destination-catalog/azure-blob-storage) |

---

### Warehouse Export: Events vs User Properties — Key Differences

| Connector | What Gets Exported | Event Data Format | User Property Handling | Key Nuance | Docs |
|-----------|-------------------|------------------|----------------------|------------|------|
| **Amazon S3** | Events + Merged IDs | Zipped JSON files, one event JSON object per line, partitioned hourly. Optional event-level filters. | ⚠️ No standalone user properties export. User properties are embedded inside each event object as a point-in-time snapshot at the time of the event. | Also exports a Merged IDs file — tracks when Amplitude merged two user identities. Critical for identity resolution downstream. | [Destination](https://amplitude.com/docs/data/destination-catalog/amazon-s3) · [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/amazon-s3-cohort) |
| **Snowflake** | Events + Merged IDs | Structured Event table with recurring syncs. Optional event filters. Each sync typically completes in 5–10 minutes. | ⚠️ User properties travel inside the event row as a nested column — no dedicated user properties table is exported. Use the User Profile API to get current user property state. | One Snowflake Export destination per data type per project. A separate Snowflake Data Share option exists as a paid add-on — read-only access, no custom clustering control. | [Destination](https://amplitude.com/docs/data/destination-catalog/snowflake) · [Data Share](https://amplitude.com/docs/data/destination-catalog/snowflake-data-share) |
| **Google BigQuery** | Events + Merged IDs | Same structure as S3/Snowflake — events as structured rows with optional filters, recurring hourly syncs. | ⚠️ User properties embedded within event rows only — no standalone user properties table. | BigQuery source and destination are independent connectors. Importing from BigQuery supports user/group properties as separate data types; exporting only sends event rows. | [Destination](https://amplitude.com/docs/data/destination-catalog/google-bigquery) · [Source](https://amplitude.com/docs/data/source-catalog/bigquery) |
| **Azure Blob Storage** | Events + Merged IDs | Exports event data and merged user data. Optional event filters. Recurring syncs as often as hourly. | ⚠️ Same pattern — user properties embedded in event rows only. | Events and merged IDs can be exported to separate containers by completing the setup flow twice. | [Destination](https://amplitude.com/docs/data/destination-catalog/azure-blob-storage) · [Source](https://amplitude.com/docs/data/source-catalog/azure-blob-storage) |

> **⚠️ Key rule across ALL warehouse exports:** User properties are never exported as a standalone table — they are only available as a snapshot embedded in each event row at the time that event occurred. To retrieve the current state of a user's properties, use the **[User Profile API](https://amplitude.com/docs/apis/analytics/user-profile)** instead.

---

### The "What Should I Use?" Decision Table

| Scenario | Right Tool | Docs |
|----------|-----------|------|
| Get the **current state of a user's properties** out of Amplitude | **User Profile API** — warehouse exports won't give you this | [Docs](https://amplitude.com/docs/apis/analytics/user-profile) |
| **Update user properties in bulk** from a warehouse | Snowflake or Databricks import with Sync User Properties enabled — not time-ordered | [Snowflake](https://amplitude.com/docs/data/source-catalog/snowflake) · [Databricks](https://amplitude.com/docs/data/source-catalog/databricks) |
| **Historical data backfill** via S3 or GCS | Explicitly set `$skip_user_properties_sync = false` or historical user profiles won't be updated | [S3](https://amplitude.com/docs/data/source-catalog/amazon-s3) · [GCS](https://amplitude.com/docs/data/source-catalog/google-cloud-storage) · [Converter Reference](https://amplitude.com/docs/data/converter-configuration-reference) |
| Need **insert/update/delete** support on ingested events | Mirror Sync on Snowflake, Databricks, or S3 — but this disables Amplitude enrichment and blocks event streaming exports | [Data Mutability](https://amplitude.com/docs/data/data-mutability) |
| Need ingested events to **flow downstream to Braze or Iterable** | Use Append Only Sync — Mirror Sync blocks event streaming destinations | [Snowflake Source](https://amplitude.com/docs/data/source-catalog/snowflake) · [S3 Source](https://amplitude.com/docs/data/source-catalog/amazon-s3) |
| **Embed Amplitude charts** in an internal portal | Dashboard REST API | [Docs](https://amplitude.com/docs/apis/analytics/dashboard-rest) |
| **Raw event dump** for your data science team | Export API (up to 4GB) or S3 Export (no size limit) | [Export API](https://amplitude.com/docs/apis/analytics/export) · [S3 Export](https://amplitude.com/docs/data/destination-catalog/amazon-s3) |

---

## Section 5: Getting Data Out — Marketing, CRM & Engagement Destinations
> Use these to activate Amplitude behavioral segments and events in the tools your marketing, growth, and product teams use every day.
> Ranked by unique orgs actively syncing (last 90 days rolling).
> Source: [Cohort Syncs per Destination](https://app.amplitude.com/analytics/amplitude/chart/opet16w) | [Common Export Destinations](https://app.amplitude.com/analytics/amplitude/chart/ws82109g)
> ⚠️ Partners with full bidirectional detail (Braze, HubSpot, Iterable, Intercom, AppsFlyer) are covered in **Section 3b** — this table shows their destination ranking for reference only.

### Marketing Automation & CRM

| Rank | Partner | Category | Direction | What It Does | Example Use Case | Docs |
|------|---------|----------|-----------|--------------|-----------------|------|
| 🥇 1 | **Braze** | Marketing Automation | 🔄 Both | Cohort Sync + Event Streaming + User Properties Sync out; campaign engagement events in | See **Section 3b** for full breakdown | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/braze-cohort-sync) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/braze) |
| 🥈 2 | **HubSpot** | CRM | 🔄 Both | Cohort Sync + Event Streaming out; marketing source + CMS source in | See **Section 3b** for full breakdown | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/hubspot-cohort-sync) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/hubspot) |
| 🥉 3 | **Customer.io** | Marketing Automation | 📤 Out | Streams Amplitude events and syncs cohorts to Customer.io for lifecycle messaging | Trigger onboarding email sequences the moment a user completes a specific in-app action tracked in Amplitude | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/customer-io) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/customer-io) |
| 4 | **Iterable** | Marketing Automation | 🔄 Both | Cohort Sync + Event Streaming + User Properties Sync out; campaign engagement events in | See **Section 3b** for full breakdown | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/iterable-cohort-sync) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/iterable) |
| 5 | **MoEngage** | Marketing Automation | 📤 Out | Syncs Amplitude cohorts to MoEngage for segmented push, email, and in-app campaigns | Mobile-first fintech and e-commerce teams run personalized retention campaigns using MoEngage + Amplitude cohort sync | [Docs](https://amplitude.com/docs/data/destination-catalog/moengage) |
| 6 | **Salesforce Marketing Cloud** | Marketing Automation | 📤 Out | Exports Amplitude behavioral cohorts and event streams into SFMC for enterprise email and journey orchestration | Inject Amplitude behavioral signals into SFMC journeys to personalize next-best-action logic | [Docs](https://amplitude.com/docs/data/destination-catalog/salesforce-marketing-cloud) |
| 7 | **Klaviyo** | Email Marketing | 📤 Out | Syncs Amplitude cohorts to Klaviyo for email and SMS campaigns | Segment users by purchase behavior in Amplitude and sync to Klaviyo for personalized product recommendation emails | [Docs](https://amplitude.com/docs/data/destination-catalog/klaviyo) |
| 8 | **Marketo** | Marketing Automation | 📤 Out | Syncs Amplitude cohorts into Marketo lead lists for B2B nurture programs | Route product-qualified leads (users who hit activation milestones) from Amplitude directly into Marketo for sales follow-up | [Docs](https://amplitude.com/docs/data/destination-catalog/marketo) |

### Customer Engagement & Push

| Rank | Partner | Category | Direction | What It Does | Example Use Case | Docs |
|------|---------|----------|-----------|--------------|-----------------|------|
| 🥇 1 | **Intercom** | Customer Engagement | 🔄 Both | Cohort Sync + Event Streaming + User Properties Sync out; conversation and engagement events in | See **Section 3b** for full breakdown — note Intercom limits 120 event types and 20 metadata values per event | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/intercom-cohort-sync) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/intercom) |
| 🥈 2 | **OneSignal** | Push Notifications | 📤 Out | Syncs Amplitude cohorts to OneSignal for targeted push notification campaigns | Re-engage dormant users — sync a "not seen in 7 days" cohort from Amplitude to OneSignal for a win-back push | [Docs](https://amplitude.com/docs/data/destination-catalog/onesignal) |
| 🥉 3 | **Appcues** | In-App Engagement | 📤 Out | Syncs Amplitude cohorts to Appcues to trigger in-app guides, tooltips, and onboarding flows | Show an onboarding checklist only to users who haven't completed activation steps — segment defined in Amplitude | [Docs](https://amplitude.com/docs/data/destination-catalog/appcues) |

### Experimentation & Feature Management

| Rank | Partner | Category | Direction | What It Does | Example Use Case | Docs |
|------|---------|----------|-----------|--------------|-----------------|------|
| 🥇 1 | **Statsig** | Experimentation | 📤 Out | Streams Amplitude events and syncs cohorts to Statsig for experiment targeting and analysis | Run experiments in Statsig targeting specific Amplitude behavioral cohorts — measure impact back in Amplitude | [Docs](https://amplitude.com/docs/data/destination-catalog/statsig-cohort-sync) |
| 🥈 2 | **LaunchDarkly** | Feature Management | 📤 Out | Syncs Amplitude behavioral cohorts to LaunchDarkly for feature flag targeting | Roll out a new feature only to your power-user cohort defined in Amplitude — gate by behavior, not just user ID | [Docs](https://amplitude.com/docs/data/destination-catalog/launchdarkly) |

### Attribution

| Partner | Category | Direction | What It Does | Example Use Case | Docs |
|---------|----------|-----------|--------------|-----------------|------|
| **AppsFlyer** | Attribution | 🔄 Both | Cohort Sync + Event Streaming out; attribution and install data in | See **Section 3b** for full breakdown — note AppsFlyer requires unique event names and doesn't support event properties in event streaming | [Cohort Sync](https://amplitude.com/docs/data/destination-catalog/appsflyer-cohort) · [Event Stream](https://amplitude.com/docs/data/destination-catalog/appsflyer) |

---

## Section 6: Platform Management APIs
> Use these to govern, automate, and operate Amplitude at scale — tracking plans, identity management, compliance, and access control.

| API | Method(s) | Direction | What It Does | Example Use Cases | Docs |
|-----|-----------|-----------|--------------|-------------------|------|
| **Behavioral Cohorts API** | `GET` `POST` `DELETE` | 🔄 Both | List, create, export, and import user cohorts between Amplitude and external tools | Pushing behavioral segments to Braze for targeted campaigns; importing third-party audience lists into Amplitude; automating cohort refresh cycles for CRM or ad platform syncs | [Docs](https://amplitude.com/docs/apis/analytics/behavioral-cohorts) |
| **Taxonomy API** | `GET` `POST` `PUT` `DELETE` | 🔄 Both | Programmatically create, read, update, and delete event types, event properties, user properties, and categories | Automating tracking plan governance at scale; syncing event schemas from a central spec into Amplitude Data; enforcing naming conventions across projects via CI/CD pipelines | [Docs](https://amplitude.com/docs/apis/analytics/taxonomy) |
| **Lookup Table API** | `GET` `POST` `PUT` `DELETE` | 📥 In | Upload a CSV to map existing property values to new derived properties — no re-instrumentation required | Mapping country codes to region names; enriching SKU IDs with product category labels; translating internal user tier codes into human-readable plan names | [Docs](https://amplitude.com/docs/apis/analytics/lookup-table-2) |
| **User Mapping (Aliasing) API** | `GET` `POST` `DELETE` | 🔄 Both | Map and unmap users across multiple Amplitude projects to a single global user ID (requires Portfolio add-on) | Enterprises with multiple products in separate Amplitude projects who need unified cross-product user identity; stitching pre/post-login anonymous and identified user journeys | [Docs](https://amplitude.com/docs/apis/analytics/user-mapping) |
| **Chart Annotations API** | `GET` `POST` `PUT` `DELETE` | 📥 In | Programmatically add and manage annotations on charts to mark significant dates and time ranges | Auto-tagging deployments from CI/CD pipelines; marking campaign launches; flagging incidents so analysts have context when reviewing metric changes | [Docs](https://amplitude.com/docs/apis/analytics/chart-annotations) |
| **Releases API** | `GET` `POST` `PUT` `DELETE` | 📥 In | Programmatically create and manage product release records in Amplitude | Connecting release management tooling (Jira, GitHub, PagerDuty) to Amplitude so every shipped version is tracked; correlating release cadence with retention metrics | [Docs](https://amplitude.com/docs/apis/analytics/releases) |
| **SCIM API** | `GET` `POST` `PUT` `DELETE` | 📥 In | Provision, update, and deprovision Amplitude users and groups via SCIM 2.0 — integrates with enterprise identity providers | Auto-provisioning Amplitude access via Okta, Azure AD, or OneLogin; automatically revoking access on offboarding; managing permission groups at scale | [Docs](https://amplitude.com/docs/apis/analytics/scim) |
| **User Privacy API** | `GET` `POST` `DELETE` | 📤 Out | Submit deletion requests to permanently remove all data for specified Amplitude IDs or User IDs | GDPR right-to-erasure; PDPA deletion workflows; automating user data deletion when account closure is triggered in your backend | [Docs](https://amplitude.com/docs/apis/analytics/user-privacy) |
| **DSAR API** | `GET` | 📤 Out | Retrieve all data Amplitude holds about a specific end user, on demand | CCPA and PDPA compliance — responding to user data access requests; building automated data-subject request handling pipelines | [Docs](https://amplitude.com/docs/apis/analytics/ccpa-dsar) |
| **Audit Logs API** | `GET` | 📤 Out | Export a log of all administrative and user actions taken within Amplitude | Security monitoring and SIEM integration; SOC 2 or ISO 27001 compliance reporting; investigating unauthorized changes to dashboards or permissions | [Docs](https://amplitude.com/docs/apis/audit-logs) |

---

## Data Direction Legend

| Symbol | Meaning |
|--------|---------|
| 📥 In | Data flows INTO Amplitude |
| 📤 Out | Data flows OUT OF Amplitude |
| 🔄 Both | Data flows both ways — connector appears as both a source and a destination |

---

## Internal Data Sources

Usage rankings are derived from Amplitude's own internal amp-on-amp analytics (org 36958).

- **Source rankings:** [Ingestion Source Distributions](https://app.amplitude.com/analytics/amplitude/chart/u2ko5g5) — % of total event volume, Growth + Enterprise orgs, last 30 days
- **Destination rankings (event streaming):** [Top Event Streaming Destinations](https://app.amplitude.com/analytics/amplitude/chart/jnlttxk) — unique orgs, 90-day rolling window
- **Destination rankings (cohort sync):** [Cohort Syncs per Destination](https://app.amplitude.com/analytics/amplitude/chart/opet16w) + [Common Export Destinations](https://app.amplitude.com/analytics/amplitude/chart/ws82109g) — unique orgs, last 6 months
- **Full API index:** [amplitude.com/docs/apis](https://amplitude.com/docs/apis)
- **Full source catalog:** [amplitude.com/docs/data/source-catalog](https://amplitude.com/docs/data/source-catalog)
- **Full destination catalog:** [amplitude.com/docs/data/destination-catalog](https://amplitude.com/docs/data/destination-catalog)
