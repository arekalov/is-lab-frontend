import { type FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { SnackbarProvider } from 'notistack';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { SpecialOperationsPage } from './pages/SpecialOperationsPage';
import { CreateFlatPage } from './pages/CreateFlatPage';
import { EditFlatPage } from './pages/EditFlatPage';
import { theme } from './theme';

const App: FC = () => {
    return (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <SnackbarProvider maxSnack={3}>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/special" element={<SpecialOperationsPage />} />
                            <Route path="/flats/new" element={<CreateFlatPage />} />
                            <Route path="/flats/:id/edit" element={<EditFlatPage />} />
                        </Routes>
                    </Layout>
                </Router>
            </SnackbarProvider>
        </ChakraProvider>
    );
};

export default App;