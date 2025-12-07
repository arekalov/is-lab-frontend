import { HashRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { SnackbarProvider } from 'notistack';
import { Layout } from './components/Layout/Layout';
import { HomePage } from './pages/HomePage';
import { CreateFlatPage } from './pages/CreateFlatPage';
import { EditFlatPage } from './pages/EditFlatPage';
import { SpecialOperationsPage } from './pages/SpecialOperationsPage';
import { HousesPage } from './pages/HousesPage';
import { CreateHousePage } from './pages/CreateHousePage';
import { EditHousePage } from './pages/EditHousePage';
import { ImportPage } from './pages/ImportPage';
import { ImportHistoryPage } from './pages/ImportHistoryPage';
import { theme } from './theme';
// Инициализируем WebSocket сервис при загрузке приложения
import './services/websocketService';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/flats/create" element={<CreateFlatPage />} />
              <Route path="/flats/:id/edit" element={<EditFlatPage />} />
              <Route path="/houses" element={<HousesPage />} />
              <Route path="/houses/create" element={<CreateHousePage />} />
              <Route path="/houses/:id/edit" element={<EditHousePage />} />
              <Route path="/import" element={<ImportPage />} />
              <Route path="/import/history" element={<ImportHistoryPage />} />
              <Route path="/special" element={<SpecialOperationsPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </SnackbarProvider>
    </ChakraProvider>
  );
}

export default App;