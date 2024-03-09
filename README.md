# Purin X Explorer

X(Twitter) list collector

[Demo site](https://purin.sakina.moe)

### How to self host

1. Prepare to deploy to Vercel:
  
    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffz6m%2Fpurin&env=DIRECT_URL,DATABASE_URL,NEXT_APP_TWEETS_UPDATE_TOKEN&project-name=purin)

1. Environment variables:

    |Name|Description|
    |:-|:-|
    |`NEXT_APP_TWEETS_UPDATE_TOKEN`|Manually update token for tweet data api|
    |`DIRECT_URL`|Postgres connection string (e.g. [supabase](https://supabase.com/) or self-hosted)|
    |`DATABASE_URL`|Postgres connection pooling string (or same as `DIRECT_URL`)|
  
    Build command: `pnpm build:ci`

    Root dir: `packages/web`

2. Create a `Vercel Edge config` storage and connect to the project.

3. Create a `Vercel KV` storage and connect to the project.

4. Create Data Tables.

    Create `packages/db/.env.prod`:

    ```bash
    DIRECT_URL=...
    DATABASE_URL=...
    ```

    Install deps and create tables:

    ```bash
      pnpm i
      cd ./packages/db
      pnpm db:prod
    ```

5. Insert list to DB.
   
   Create `packages/db/scripts/list.local.json`:

   ```ts
   [
     {
       "id": "123456789",
       "name": "List Name",
       "cover": "https://domain.com/cover.png"
     },
     // ...
   ]
   ```

   Create data:

   ```bash
     # In `packages/db`
     pnpm db:prod:insert
   ```

6. Get list data.

   Manual request:

   ```ts
   await axios.post(
     `https://deploy.domain.com/api/v1/tweets/update`,
     { 
       list,
       authorization, // Twitter authorization (Copy from request headers / localStorage / OAuth API / etc.) 
       cookie // Twitter cookie (document.cookie)
     },
     { headers: { Authorization: `Bearer ${NEXT_APP_TWEETS_UPDATE_TOKEN}` }}
   )
   ```

   Or cron job:

   ```ts
   // 0 * * * * (requests per hour)
   await axios.get(
     `https://deploy.domain.com/api/v1/tweets/update`,
     { 
       headers: { Authorization: `Bearer ${NEXT_APP_TWEETS_UPDATE_TOKEN}` },
       params: {} // cycle update, or `{ list }`
     }
   )
   ```

   and add `authorization` and `cookie` to `Vercel edge config`:

   ```json
   {
     "authorization": "...",
     "cookie": "..."
   }
   ```

     <details>
       <summary>
         the cookie must contain at least the following values:
       </summary>
       <pre>[
     "kdt",
     "dnt",
     "guest_id",
     "auth_token",
     "twid",
     "ct0",
     "d_prefs",
     "lang",
     "_twitter_sess",
     "guest_id_marketing",
     "guest_id_ads",
     "personalization_id",
   ]</pre>
     </details>
     
   Supabase cron job example ([docs](https://supabase.com/docs/guides/functions/schedule-functions)) :

   ```sql
   -- select cron.unschedule('cron-vercel-sync');

   select
     cron.schedule(
       'cron-vercel-sync',
       '0 * * * *',
       $$
       select
         net.http_get(
             url:='https://deploy.domain.com/api/v1/tweets/update',
             headers:='{ "Authorization": "Bearer NEXT_APP_TWEETS_UPDATE_TOKEN" }'::jsonb
         ) as request_id;
       $$
     );
   ```
