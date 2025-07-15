// pages/index.ts or app/page.ts (for Next.js Pages Router or App Router respectively)

interface Country {
    name: {
        common: string;
    };
    cca2: string;
    idd?: {
        root?: string;
        suffixes?: string[];
    };
}

interface FormattedCountry {
    name: string;
    code: string;
    dialCode: string;
}

export const getCountries = async (): Promise<FormattedCountry[]> => {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch countries: ${res.status} ${res.statusText}`);
    }

    const countries: Country[] = await res.json();

    return countries
        .map((c: Country): FormattedCountry => ({
            name: c.name.common,
            code: c.cca2,
            dialCode: (c.idd?.root || '') + (c.idd?.suffixes?.[0] || '')
        }))
        .filter((c: FormattedCountry) => c.dialCode)
        .sort((a: FormattedCountry, b: FormattedCountry) => a.name.localeCompare(b.name));
};
