import { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { popMovie } from '..';

import BackgroundStyle from '../../components/layout/BackgroundStyle';
import SearchTicketList from '../../components/search/SearchTicketList';

const SearchPage: NextPage = () => {
  const [movieName, setMovieName] = useState('');
  const [searchResults, setSearchResults] = useState<popMovie[]>();

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
          <StyledInput
            type='text'
            id='search-input'
            value={movieName}
            onChange={inputChangeHandler}
            placeholder='Search Your Ticket.'
          />
          <InputSearchBtn>
            <BiSearch />
          </InputSearchBtn>
        </StyledForm>
      </FormWrapper>

      <SearchWrapper>
        <SearchTitle>검색 결과</SearchTitle>
        {!searchResults ? (
          <NoneResults>검색 결과가 없습니다.</NoneResults>
        ) : (
          searchResults.map((item, index) => (
            <SearchTicketList
              key={index}
              movieId={item.id}
              movieIndex={index}
              title={item.title}
              voteAverage={item.vote_average}
              releaseDate={item.release_date}
              posterPath={item.poster_path}
              overview={item.overview}
            />
          ))
        )}
      </SearchWrapper>
    </BackgroundStyle>
  );
};

export default SearchPage;

export const NoneResults = styled.p`
  width: 100%;
  height: 100vh;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.black};
  padding-top: 1rem;
  padding-left: 1rem;
  font-size: 1.2rem;
  font-weight: 400;

  ${({ theme }) => theme.device.desktop} {
    padding-left: 2rem;
  }
`;

const SearchWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const SearchTitle = styled.p`
  color: #fff;
  padding-top: 1rem;
  padding-left: 1rem;
  font-size: 1.5rem;
  font-weight: 700;

  ${({ theme }) => theme.device.desktop} {
    padding-left: 2rem;
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
  display: flex;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.desktop} {
    width: 50%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.1rem 1rem;
  border: none;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 600;

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }

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

  ${({ theme }) => theme.device.desktop} {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
  }
`;

const InputSearchBtn = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  padding: 0.6rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: #fff;
  border-radius: 50%;
  margin-left: 0.5rem;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.colors.orange};
  }
`;
