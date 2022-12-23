import styled from 'styled-components';
import { StyledBtn } from '../styles/StyledBtn';
import { BiTrash } from 'react-icons/bi';

const DeleteBtn = ({ onToggle }: { onToggle: () => void }) => {
  return (
    <DeleteBtnWrapper onClick={onToggle}>
      <button>
        <BiTrash />
      </button>
    </DeleteBtnWrapper>
  );
};

export default DeleteBtn;

const DeleteBtnWrapper = styled(StyledBtn)`
  button {
    margin-bottom: 0.05rem;
  }
`;
