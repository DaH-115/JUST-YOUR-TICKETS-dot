import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import axios from 'axios';
import Error from 'next/error';
import { BiSearch } from 'react-icons/bi';

import { useAuthState } from '../../components/store/auth-context';
import withHeadMeta from '../../components/common/withHeadMeta';
import BackgroundStyle from '../../components/layout/BackgroundStyle';
import SearchTicket from '../../components/search/SearchTicket';
import SignInAlert from '../../components/popup/SignInAlert';
import { SystemError } from 'errorType';
import { TopMovieDataProps } from 'ticketType';
import { NoneResults } from '../../components/styles/NoneReults';

const SearchPage: NextPage = () => {
  const { isSigned } = useAuthState();
  const [movieName, setMovieName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<TopMovieDataProps[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (movieName) {
      timer = setTimeout(() => {
        getSearchResults(movieName);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => clearTimeout(timer);
  }, [movieName]);

  useEffect(() => {
    if (!isSigned) {
      setIsOpen(true);
    }
  }, [isSigned]);

  const getSearchResults = async (movieName: string) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&query=${movieName}&language=ko-KR`
      );

      const { results }: { results: TopMovieDataProps[] } = await res.data;

      setSearchResults(results);
    } catch (error) {
      const err = error as SystemError;
      return <Error statusCode={err.statusCode} title={err.message} />;
    }
  };

  const searchInputHandler = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      movieName && getSearchResults(movieName);
    },
    [movieName]
  );

  const inputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMovieName(event.target.value);
    },
    []
  );

  const onToggleHandler = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <BackgroundStyle customMessage='search🎞️'>
      {isOpen && <SignInAlert onToggleHandler={onToggleHandler} />}
      <FormWrapper>
        <StyledForm onSubmit={searchInputHandler} action='get'>
          <StyledLabel htmlFor='search-input'>{'영화 검색'}</StyledLabel>
          <StyledInput
            type='text'
            id='search-input'
            value={movieName}
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
  padding-left: ${({ theme }) => theme.space.mobile};

  font-size: 1.5rem;
  font-weight: 700;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2rem;
    padding-left: ${({ theme }) => theme.space.tablet};
  }

  ${({ theme }) => theme.device.desktop} {
    padding-left: ${({ theme }) => theme.space.desktop};
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

  ${({ theme }) => theme.device.tablet} {
    width: 40%;
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
