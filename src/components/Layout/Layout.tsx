import { type FC } from 'react';
import type { ReactNode } from 'react';
import {
    Box,
    Flex,
    IconButton,
    useColorMode,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    VStack,
    Heading,
    Button,
    useColorModeValue,
    Divider,
} from '@chakra-ui/react';
import { HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const SIDEBAR_WIDTH = '240px';

const menuItems = [
    { text: 'Квартиры', path: '/' },
    { text: 'Дома', path: '/houses' },
    { divider: true },
    { text: 'Добавить квартиру', path: '/flats/create' },
    { text: 'Добавить дом', path: '/houses/create' },
    { divider: true },
    { text: 'Специальные операции', path: '/special' },
];

interface Props {
    children: ReactNode;
}

export const Layout: FC<Props> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const location = useLocation();

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const NavContent = () => (
        <VStack spacing={4} align="stretch" w="full">
            {menuItems.map((item, index) => 
                item.divider ? (
                    <Divider key={`divider-${index}`} />
                ) : (
                    <Button
                        key={item.path}
                        variant={location.pathname === item.path ? 'solid' : 'ghost'}
                        onClick={() => {
                            navigate(item.path!);
                            onClose();
                        }}
                        w="full"
                        justifyContent="flex-start"
                    >
                        {item.text}
                    </Button>
                )
            )}
        </VStack>
    );

    return (
        <Box minH="100vh">
            {/* Mobile Header */}
            <Flex
                display={{ base: 'flex', md: 'none' }}
                alignItems="center"
                p={4}
                borderBottomWidth={1}
                borderColor={borderColor}
                bg={bg}
                position="fixed"
                top={0}
                w="full"
                zIndex={1000}
            >
                <IconButton
                    aria-label="Open menu"
                    icon={<HamburgerIcon />}
                    onClick={onOpen}
                    variant="ghost"
                />
                <Heading size="md" ml={4}>Управление недвижимостью</Heading>
                <IconButton
                    aria-label="Toggle color mode"
                    icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    ml="auto"
                />
            </Flex>

            {/* Mobile Drawer */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={1}>Меню</DrawerHeader>
                    <DrawerBody>
                        <NavContent />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Desktop Sidebar */}
            <Box
                position="fixed"
                left={0}
                w={SIDEBAR_WIDTH}
                h="100vh"
                borderRightWidth={1}
                borderColor={borderColor}
                bg={bg}
                display={{ base: 'none', md: 'block' }}
            >
                <Flex direction="column" h="full" p={4}>
                    <Heading size="md" mb={8}>Управление недвижимостью</Heading>
                    <NavContent />
                    <IconButton
                        aria-label="Toggle color mode"
                        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                        onClick={toggleColorMode}
                        variant="ghost"
                        mt="auto"
                    />
                </Flex>
            </Box>

            {/* Main Content */}
            <Box
                ml={{ base: 0, md: SIDEBAR_WIDTH }}
                mt={{ base: '72px', md: 0 }}
                p={6}
            >
                {children}
            </Box>
        </Box>
    );
};