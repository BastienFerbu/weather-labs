This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Local run

First, create a `.env` file with `WEATHER_API_KEY` variable and run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker usage

```bash
# Build the image
docker build -t weather-labs .
# Run the docker
docker run -p 3000:3000 --env WEATHER_API_KEY=<your_api_key> weather-labs
```
