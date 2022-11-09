import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';

const Header = () => {
  const router = useRouter();

  return (
    <Link href='/search'>
      <SearchIcon path={router.pathname}>
        <BiSearch />
      </SearchIcon>
    </Link>
  );
};

export const SearchIcon = styled.div<{ path?: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${(props) =>
    props.path === '/search'
      ? props.theme.colors.orange
      : props.theme.colors.yellow};
  border-radius: 50%;
`;

export default Header;
