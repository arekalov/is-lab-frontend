import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
    initialColorMode: 'system',
    useSystemColorMode: true,
};

export const theme = extendTheme({
    config,
    styles: {
        global: {
            body: {
                transition: 'background-color 0.2s',
            },
        },
    },
    components: {
        Table: {
            variants: {
                simple: {
                    th: {
                        borderColor: 'gray.200',
                        _dark: {
                            borderColor: 'gray.600',
                        },
                    },
                    td: {
                        borderColor: 'gray.200',
                        _dark: {
                            borderColor: 'gray.600',
                        },
                    },
                },
            },
        },
    },
});
