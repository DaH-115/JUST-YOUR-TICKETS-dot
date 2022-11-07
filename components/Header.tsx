import Link from 'next/link';
import styled from 'styled-components';
import { BiSearch } from 'react-icons/bi';

const Header = () => {
  return (
    <Link href='/search'>
      <SearchIcon>
        <BiSearch />
      </SearchIcon>
    </Link>
  );
};

const SearchIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 1rem;
  height: 1rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.yellow};
  border-radius: 50%;
`;

export default Header;
