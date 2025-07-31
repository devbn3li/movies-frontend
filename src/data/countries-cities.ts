interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
}

export const fetchCountries = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    const countries: Country[] = await response.json();

    return countries.map((country) => country.name.common).sort();
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

// Fallback static list in case API fails
const fallbackCountries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Bahrain",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Canada",
  "China",
  "Denmark",
  "Egypt",
  "France",
  "Germany",
  "India",
  "Iraq",
  "Italy",
  "Japan",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Morocco",
  "Netherlands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Qatar",
  "Russia",
  "Saudi Arabia",
  "Spain",
  "Sudan",
  "Syria",
  "Tunisia",
  "Turkey",
  "UAE",
  "United Kingdom",
  "United States",
  "Yemen",
];

export const getCountries = async (): Promise<string[]> => {
  const countries = await fetchCountries();
  return countries.length > 0 ? countries : fallbackCountries;
};