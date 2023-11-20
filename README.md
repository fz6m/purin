# Purin X Explorer

X(Twitter) list collector

[Demo site](https://purin.sakina.moe)

### How to self host

1. [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffz6m%2Fpurin&env=DIRECT_URL,DATABASE_URL,NEXT_APP_TWEETS_UPDATE_TOKEN&project-name=purin)

2. Environment variables:

    |Name|Description|
    |:-|:-|
    |`NEXT_APP_TWEETS_UPDATE_TOKEN`|manually update token for tweet data api|
    |`DIRECT_URL`|Postgres connection string|
    |`DATABASE_URL`|Postgres connection pooling string (or same as `DIRECT_URL`)|

3. Create a `Vercel Edge config` storage and connect to the project.

4. Create a `Vercel KV` storage and connect to the project.

5. Create Data Tables:

    Crate `packages/db/.env.prod`:

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

6. Insert list to DB:
   
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

7. Get list data:

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

   Cron job:

   ```ts
   // 0 * * * * (requests per hour)
   await axios.get(
     `https://deploy.domain.com/api/v1/tweets/update`,
     { list },
     { headers: { Authorization: `Bearer ${NEXT_APP_TWEETS_UPDATE_TOKEN}` }}
   )
   ```

   and add `authorization` and `cookie` to `Vercel edge config`:

   ```json
   {
     "authorization": "...",
     "cookie": "..."
   }
   ```