import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import axios from 'axios';
import Error from 'next/error';
import { BiSearch } from 'react-icons/bi';

import withHeadMeta from 'components/common/withHeadMeta';
import BackgroundStyle from 'components/layout/BackgroundStyle';
import SearchTicket from 'components/search-ticket/SearchTicket';
import NoneResults from 'components/styles/NoneReults';
import { SystemError } from 'errorType';
import { Top10MovieDataProps } from 'ticketType';

const SearchPage: NextPage = () => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Top10MovieDataProps[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (movieTitle) {
      timer = setTimeout(() => {
        getSearchResults(movieTitle);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => clearTimeout(timer);
  }, [movieTitle]);

  const getSearchResults = async (movieTitle: string) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&query=${movieTitle}&language=ko-KR`
      );
      const { results }: { results: Top10MovieDataProps[] } = await res.data;

      setSearchResults(results);
    } catch (error) {
      const err = error as SystemError;
      return <Error statusCode={err.statusCode} title={err.message} />;
    }
  };

  const searchInputHandler = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      movieTitle && getSearchResults(movieTitle);
    },
    [movieTitle]
  );

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMovieTitle(event.target.value);
    },
    []
  );

  return (
    <BackgroundStyle customMessage='search🎞️'>
      <FormWrapper>
        <StyledForm onSubmit={searchInputHandler} action='get'>
          <StyledLabel htmlFor='search-input'>{'영화 검색'}</StyledLabel>
          <StyledInput
            type='text'
            id='search-input'
            value={movieTitle}
            onChange={inputChangeHandler}
            placeholder='Search Your Ticket.'
          />
          <InputSearchBtn>
            <button type='submit'>
              <BiSearch />
            </button>
          </InputSearchBtn>
        </StyledForm>
      </FormWrapper>

      <SearchWrapper>
        <SearchTitle>{'검색 결과'}</SearchTitle>
        {!searchResults?.length ? (
          <NoneResults>{'검색 결과가 없습니다.'}</NoneResults>
        ) : (
          searchResults.map((item, index) => (
            <SearchTicket
              key={item.id}
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

export default withHeadMeta(SearchPage, '검색');

const SearchWrapper = styled.div`
  width: 100%;
`;

const SearchTitle = styled.p`
  color: #fff;
  padding-top: 1rem;
  padding-left: ${({ theme }) => theme.space.small};

  font-size: 1.5rem;
  font-weight: 700;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2rem;
    padding-left: ${({ theme }) => theme.space.medium};
  }
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 2rem;
`;

const StyledLabel = styled.label`
  position: absolute;
  top: 0;
  left: -999px;
  visibility: hidden;
`;

const StyledForm = styled.form`
  display: flex;
  margin: 1rem 0;

  ${({ theme }) => theme.device.tablet} {
    width: 40%;
    margin-top: 0;
  }

  ${({ theme }) => theme.device.desktop} {
    width: 30%;
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
  padding: 0.6rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: #fff;
  border-radius: 50%;
  margin-left: 0.5rem;

  button {
    font-size: 1.5rem;
    background-color: transparent;
  }

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.colors.orange};
    transition: all ease-in-out 150ms;
  }
`;
