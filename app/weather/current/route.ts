import { NextResponse } from 'next/server';
import { API_KEY } from "../constant";
import { Weather } from '../../types/weather';

export const GET = async (
  req: Request
) => {
  const url = new URL(req.url);
  const queryParameters = url.searchParams;
  if (!queryParameters.has("city")) {
    return NextResponse.json({ message: "City is required" }, { status: 400 });
  }
  const city = queryParameters.get("city");
  const lang = queryParameters.get("lang") || "en";

  try {
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?key=${API_KEY}&city=${city}&lang=${lang}`,
      {method: "GET"}
    );

    if (response.ok) {
      const data = await response.json();

      const weather: Weather = {
        description: data.data[0].weather.description,
        temperature: data.data[0].temp,
        wind: data.data[0].wind_spd,
        humidity: data.data[0].rh,
      };
      return NextResponse.json(weather, { status: 200 });
    } else {
      const data = await response.json();
      return NextResponse.json(data, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}