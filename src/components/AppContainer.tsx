import { Heading, HStack, Link, VStack } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';


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
        <Link href='/' display='inline-flex' textDecoration='none'>
          <Heading as='h2' color='purple'>
            Path Finder
          </Heading>
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
          maxW={400}
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
