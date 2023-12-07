import { useState, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';
import { MovieDataProps } from 'ticketType';
import withHead from 'components/common/withHead';
import SearchTicket from 'pages/search/SearchTicket';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getMovieListData } from 'store/movieSlice';
import {
  errorAlertIsOpen,
  loadingIsOpen,
  modalIsClose,
} from 'store/modalSlice';
import { LoadingSpinner } from 'components/common/LoadingSpinner';

const SearchPage: NextPage = () => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const dispatch = useAppDispatch();
  const searchResults = useAppSelector((state) => state.movieData.movieList);
  const loadingState = useAppSelector((state) => state.modal.loadingState);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (movieTitle) {
      timer = setTimeout(() => {
        getSearchResultsHandler(movieTitle);
      }, 500);
    } else {
      getSearchResultsHandler('');
    }

    return () => clearTimeout(timer);
  }, [movieTitle]);

  const getSearchResultsHandler = async (movieTitle: string) => {
    dispatch(loadingIsOpen());

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&query=${movieTitle}&language=ko-KR`
      );
      const { results }: { results: MovieDataProps[] } = await res.data;

      dispatch(getMovieListData(results));
    } catch (error) {
      dispatch(errorAlertIsOpen());
    }

    dispatch(modalIsClose());
  };

  const onSubmitHandler = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (movieTitle) {
        getSearchResultsHandler(movieTitle);
      }
    },
    [movieTitle]
  );

  const onInputChangeHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMovieTitle(event.target.value);
    },
    []
  );

  return (
    <BackgroundStyle>
      <FormWrapper>
        <StyledForm onSubmit={onSubmitHandler} action='get'>
          <StyledLabel htmlFor='search-input'>{'영화 검색'}</StyledLabel>
          <StyledInput
            type='text'
            id='search-input'
            value={movieTitle}
            onChange={onInputChangeHandler}
            placeholder='티켓을 검색해 보세요.'
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
        {loadingState ? (
          <LoadingSpinner />
        ) : !searchResults.length ? (
          <NoneResults>{'검색 결과가 없습니다.'}</NoneResults>
        ) : (
          searchResults.map((item, index) => (
            <SearchTicket
              key={item.id}
              movieId={item.id}
              movieIndex={index + 1}
            />
          ))
        )}
      </SearchWrapper>
    </BackgroundStyle>
  );
};

export default withHead(SearchPage, '검색');

const BackgroundStyle = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 1rem 0 2rem;
`;

const StyledForm = styled.form`
  display: flex;

  ${({ theme }) => theme.device.tablet} {
  }
`;

const StyledLabel = styled.label`
  position: absolute;
  top: 0;
  left: -999px;
  visibility: hidden;
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 0.9rem;
  padding: 0.1rem 1rem;
  border: none;
  border-radius: 2rem;

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

  ${({ theme }) => theme.device.tablet} {
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

const SearchWrapper = styled.div`
  width: 100%;
  padding: 0 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 0 2rem;
  }
`;

const SearchTitle = styled.p`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const NoneResults = styled.p`
  width: 100%;
  height: 100vh;

  color: #fff;
  font-size: 1.2rem;
`;
