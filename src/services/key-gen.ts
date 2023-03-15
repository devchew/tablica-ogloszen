import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
};

export const keygen = (): string => uniqueNamesGenerator(customConfig); // big-red-donkey
