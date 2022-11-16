import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';

const Header = () => {
  const router = useRouter();

  return (
    <Link href='/search'>
      <SearchIcon path={router.pathname}>
        <BiSearch id='search-icon' />
      </SearchIcon>
    </Link>
  );
};

export const SearchIcon = styled.div<{ path?: string }>`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 999;
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${(props) =>
    props.path === '/search'
      ? props.theme.colors.orange
      : props.theme.colors.yellow};
  border-radius: 50%;

  #search-icon {
    color: ${(props) =>
      props.path === '/search' ? '#fff' : props.theme.colors.black};
    margin-top: 1px;
    margin-left: 1px;
  }
`;

export default Header;
