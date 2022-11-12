import { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { popMovie } from '..';

import BackgroundStyle from '../../components/BackgroundStyle';
import { SearchIcon } from '../../components/Header';
import TicketList from '../../components/TicketList';

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
        <h1>Results.</h1>
        <TicketList movies={searchResults} />
      </SearchWrapper>
    </BackgroundStyle>
  );
};

const SearchWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  color: #fff;

  h1 {
    padding-top: 1rem;
    padding-left: 1rem;
  }
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
`;

const StyledInput = styled.input`
  width: 100%;
  height: 1.3rem;
  padding: 1rem;
  padding-left: 2.4rem;
  border-radius: 1rem;
  border: none;
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
    outline: none;
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const InputSearchIcon = styled(SearchIcon)`
  position: relative;
  top: 2rem;
  left: 0.2rem;
  background-color: inherit;
  color: ${({ theme }) => theme.colors.gray};
`;

export default SearchPage;
