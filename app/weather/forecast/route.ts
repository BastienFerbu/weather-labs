import { NextResponse } from 'next/server';
import { API_KEY } from "../constant";
import { Forecast } from '../../types/weather';
import { get } from 'http';

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
      `https://api.weatherbit.io/v2.0/forecast/daily?key=${API_KEY}&days=7&city=${city}&lang=${lang}`,
      {method: "GET"}
    );

    if (response.ok) {
      const data = await response.json();
      var forecast = computeForecast(data);
      return NextResponse.json(forecast, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

function computeForecast(data: any): Forecast {
  const currentWeather = {
    temperature: data.data[0].temp,
    pressure: data.data[0].pres,
  };
  const meanTemperature = data.data.reduce((acc: number, day: any) => acc + day.temp, 0) / data.data.length;
  const meanWind = data.data.reduce((acc: number, day: any) => acc + day.wind_spd, 0) / data.data.length;
  const meanPressure = data.data.reduce((acc: number, day: any) => acc + day.pres, 0) / data.data.length;
  const meanEvolution = data.data.reduce((acc: number, day: any) => acc + (day.pres + day.temps), 0) / data.data.length;

  const getEvolution = (current: number, mean: number, margin: number) => {
    if (current < mean - margin) {
      return "en amélioration";
    } else if (current > mean + margin) {
      return "en dégradation";
    } else {
      return "stable";
    }
  }

  const getTemperatureTrend = (current: number, mean: number, margin: number) => {
    if (current < mean - margin) {
      return "en hausse";
    } else if (current > mean + margin) {
      return "en baisse";
    } else {
      return "stable";
    }
  }

  const getbarometricTrend = (current: number, mean: number, lowMargin: number, highMargin: number) => {
    if (current < mean - highMargin) {
      return "en forte hausse";
    }else if (current > mean + highMargin) {
      return "en forte baisse";
    } else if (current < mean - lowMargin) {
      return "en hausse";
    } else if (current > mean + lowMargin) {
      return "en baisse";
    } else {
      return "stable";
    }
  }

  const getBeaufortScale = (wind: number) => {
    if (wind < 1) {
      return 0;
    } else if (wind < 5) {
      return 1;
    } else if (wind < 11) {
      return 2;
    } else if (wind < 19) {
      return 3;
    } else if (wind < 28) {
      return 4;
    } else if (wind < 38) {
      return 5;
    } else if (wind < 49) {
      return 6;
    } else if (wind < 61) {
      return 7;
    } else if (wind < 74) {
      return 8;
    } else if (wind < 88) {
      return 9;
    } else if (wind < 102) {
      return 10;
    } else if (wind < 117) {
      return 11;
    } else {
      return 12;
    }
  }

  return {
    evolution: getEvolution(currentWeather.pressure + currentWeather.temperature, meanEvolution, 5),
    temperatureTrend: getTemperatureTrend(currentWeather.temperature, meanTemperature, 2),
    barometricTrend: getbarometricTrend(currentWeather.pressure, meanPressure, 5, 10),
    windScale: getBeaufortScale(meanWind),
  };
}