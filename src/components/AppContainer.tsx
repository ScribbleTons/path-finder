import { Heading, HStack, Link, VStack } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import reactLogo from './../assets/react.svg';

interface Props {
  children: ReactNode;
  aside: ReactNode;
}

const AppContainer: FC<Props> = ({ children, aside }) => {
  return (
    <VStack w='100vw' h='100vh' pb={10}>
      <HStack
        as='header'
        py={4}
        borderBottomWidth={1}
        w='100%'
        justifyContent='space-around'
      >
        <Link href='/' display='inline-flex'>
          <img src={reactLogo} className='logo react' alt='React logo' />
          {'  '}
          <Heading as='h2'>Path Finder</Heading>
        </Link>
      </HStack>
      <HStack
        as='section'
        justifyContent='space-between'
        w='100%'
        h='100%'
        px={25}
      >
        <VStack
          as='form'
          h='100%'
          minW={350}
          maxW={600}
          borderRightWidth={1}
          p={10}
        >
          {aside}
        </VStack>
        <VStack w='100%' height='100%' position='relative'>
          {children}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default AppContainer;
