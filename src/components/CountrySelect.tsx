'use client';

import { getCountries } from '@/lib/countryService';
import { useEffect, useState } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

type Country = {
    name: string;
    code: string;
    dialCode: string;
};

type Props = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export const CountrySelect = ({ value, onChange, disabled }: Props) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [countryChange, setCountryChange] = useState<string>('');

    useEffect(() => {
        getCountries().then((data) => {
            setCountries(data);
            const current = data.find((country) => country.dialCode === value);
            setSelectedCountry(current || null);
        }).catch(console.error);
    }, [value]);

    useEffect(() => {
        if (countryChange) {
            onChange(countryChange);
        }
    }, [countryChange, onChange]);

    return (
        <Listbox value={selectedCountry} onChange={(country) => { 
            setSelectedCountry(country);
            setCountryChange(country?.dialCode || '');
        }}>
            <div className="relative mt-1 z-10">
                <ListboxButton disabled={disabled} className="relative w-full cursor-pointer rounded-xl bg-white/80 backdrop-blur-sm py-3 pl-4 pr-10 text-left border-2 border-purple-100 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    <span className="block truncate">
                        {selectedCountry ? `${selectedCountry.name} (${selectedCountry.dialCode})` : 'Select a country'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronsUpDownIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                    </span>
                </ListboxButton>
                <ListboxOptions className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white/95 backdrop-blur-sm py-1 text-base shadow-lg ring-1 ring-purple-100 focus:outline-none sm:text-sm">
                    {countries.map((country) => (
                        <ListboxOption
                            key={country.code}
                            value={country}
                            className={({ active }) =>
                                `relative cursor-pointer select-none py-2.5 pl-10 pr-4 ${active ? 'bg-purple-50 text-purple-900' : 'text-gray-700 hover:bg-gray-50'
                                } transition-colors duration-150`
                            }
                        >
                            {({ selected }) => (
                                <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                        {country.name} ({country.dialCode})
                                    </span>
                                    {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    )}
                                </>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
};
