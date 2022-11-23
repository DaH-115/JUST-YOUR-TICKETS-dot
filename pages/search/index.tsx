import { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { popMovie } from '..';

import BackgroundStyle from '../../components/Layout/BackgroundStyle';
import { SearchIcon } from '../../components/Layout/Header';
import SearchTicketList from '../../components/SearchTicketList';

const SearchPage: NextPage = () => {
  const [movieName, setMovieName] = useState('');
  const [searchResults, setSearchResults] = useState<popMovie[]>([]);

  const getSearchResults = async (movieName: string) => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${movieName}`
    );

    const { results }: { results: popMovie[] } = await res.data;

    setSearchResults(results);
  };

  const searchInputHandler = (event: React.FormEvent) => {
    event.preventDefault();
    getSearchResults(movieName);
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieName(event.target.value);
  };

  return (
    <BackgroundStyle customMessage='search🎞️' backgroundColor='yellow'>
      <FormWrapper>
        <StyledForm onSubmit={searchInputHandler} action='get'>
          <StyledLabel htmlFor='search-input'>영화 검색</StyledLabel>
          <InputSearchIcon>
            <BiSearch />
          </InputSearchIcon>
          <StyledInput
            type='text'
            id='search-input'
            value={movieName}
            onChange={inputChangeHandler}
            placeholder='Search Your Ticket.'
          />
        </StyledForm>
      </FormWrapper>
      <SearchWrapper>
        {searchResults && <SearchTicketList movies={searchResults} />}
      </SearchWrapper>
    </BackgroundStyle>
  );
};

const SearchWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.black};
  color: #fff;
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledLabel = styled.label`
  position: absolute;
  top: 0;
  left: -999px;
  visibility: hidden;
`;

const StyledForm = styled.form`
  width: 70%;

  ${({ theme }) => theme.device.desktop} {
    width: 50%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 1.3rem;
  padding: 1rem;
  padding-left: 2.6rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  font-size: 0.7rem;
  font-weight: 600;

  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1; /* Firefox */
  }

  &::-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${({ theme }) => theme.colors.gray};
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${({ theme }) => theme.colors.gray};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }

  ${({ theme }) => theme.device.desktop} {
    font-size: 1.2rem;
    padding: 1.4rem 2rem;
    padding-left: 3.5rem;
    border-radius: 2rem;
  }
`;

const InputSearchIcon = styled(SearchIcon)`
  position: relative;
  top: 2.8rem;
  left: 0.2rem;
  font-size: 1.5rem;
  background-color: inherit;
  color: ${({ theme }) => theme.colors.gray};

  ${({ theme }) => theme.device.desktop} {
    top: 3rem;
    left: 0.3rem;
    font-size: 2rem;
  }
`;

export default SearchPage;
