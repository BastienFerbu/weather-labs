
"use client";

import React, { useState } from 'react'
import { Weather, Forecast } from './types/weather';

const windScale = (en: string, scale: number) => {
  switch(scale) {
    case 0:
      return en == "fr" ? "Calme" : "Calm";
    case 1:
      return en == "fr" ? "Très légère brise" : "Light air";
    case 2:
      return en == "fr" ? "Légère brise" : "Light breeze";
    case 3:
      return en == "fr" ? "Petite brise" : "Gentle breeze";
    case 4:
      return en == "fr" ? "Jolie brise" : "Moderate breeze";
    case 5:
      return en == "fr" ? "Bonne brise" : "Fresh breeze";
    case 6:
      return en == "fr" ? "Grand frais" : "Strong breeze";
    case 7:
      return en == "fr" ? "Coup de vent" : "High wind";
    case 8:
      return en == "fr" ? "Fort coup de vent" : "Gale";
    case 9:
      return en == "fr" ? "Tempête" : "Strong gale";
    case 10:
      return en == "fr" ? "Violente tempête" : "Storm";
    case 11:
      return en == "fr" ? "Ouragan" : "Hurricane";
    default:
      return en == "fr" ? "Inconnu" : "Unknown";
  }
}

export default function Home() {
  const [submitting, setIsSubmitting] = useState(false);
  const [lang, setLanguage] = useState("en");
  const [weather, setWeather] = useState({} as Weather);
  const [forecast, setForecast] = useState({} as Forecast);
  const [city, setCity] = useState("");

  const getWeather = async (e: React.SyntheticEvent, route: string) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/weather/${route}?city=${encodeURI(city)}&lang=${lang}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if(route == "forecast") {
          setForecast(data);
          setWeather({} as Weather);
        }
        else {
          setWeather(data);
          setForecast({} as Forecast);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="justify-items-center p-8 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-2 right-2">
        <select onChange={(e)=>setLanguage(e.target.value)} className="bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-sm p-2">
          <option value={"en"}>English</option>
          <option value={"fr"}>Français</option>
        </select>
      </div>
      <main className="flex flex-col">
        <h1 className="text-4xl font-bold mb-2 text-center sm:text-left">
          Weather Labs
        </h1>
        <label htmlFor="city" className="block text-sm/6 font-medium">
        {lang == "fr" ? "Ville" : "City"}
        </label>
        <div className="mt-1">
          <div className="flex items-center rounded-md bg-white outline outline-1 -outline-offset-1 outline-gray-300">
            <input
              id="city"
              name="city"
              type="text"
              onChange={e => setCity(e.target.value)}
              placeholder="Toulouse"
              className="block min-w-0 grow py-1.5 pl-2 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="mt-2">
          <button disabled={submitting} onClick={(e) => getWeather(e, "current")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            {submitting && (<div className="loader"></div>)}
            {lang == "fr" ? "Actuelle" : "Current"}
          </button>
          <button disabled={submitting} onClick={(e) => getWeather(e, "forecast")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {submitting && (<div className="loader"></div>)}
            {lang == "fr" ? "Prévision" : "Forecast"}
          </button>
        </div>
        { weather.wind != undefined && <div className="mt-4">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col">
                <span className="text-sm/6 font-medium">{lang == "fr" ? "Température" : "Temperature"}</span>
                <span className="text-sm/6">{weather.temperature}°C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm/6 font-medium">{lang == "fr" ? "Vent" : "Wind"}</span>
                <span className="text-sm/6">{weather.wind} km/h</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm/6 font-medium">{lang == "fr" ? "Humidité" : "Humidity"}</span>
                <span className="text-sm/6">{weather.humidity}%</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm/6 font-bold">{weather.description}</span>
          </div>
        </div> }
        { forecast.evolution != undefined && <div className="mt-4">
          <div className="text-sm/6">
            <span className="font-bold">{lang == "fr" ? "Evolution" : "Evolution"}</span>: {forecast.evolution}
          </div>
          <div className="text-sm/6">
            <span className="font-bold">
              {lang == "fr" ? "Tendance température" : "Temperature trend"}</span>: {forecast.temperatureTrend}
          </div>
          <div className="text-sm/6">
            <span className="font-bold">
              {lang == "fr" ? "Tendance barométique" : "Barometric trend"}</span>: {forecast.barometricTrend}
          </div>
          <div className="text-sm/6">
            <span className="font-bold">
              {lang == "fr" ? "Echelle de vent" : "Wind scale"}</span>: {windScale(lang, forecast.windScale)}
          </div>
        </div> }
      </main>
    </div>
  );
}
