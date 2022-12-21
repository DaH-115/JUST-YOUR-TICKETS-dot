import styled from 'styled-components';
import { StyledBtn } from '../styles/StyledBtn';
import { BiTrash } from 'react-icons/bi';

const DeleteButton = ({ onToggle }: { onToggle: () => void }) => {
  return (
    <DeleteBtn onClick={onToggle}>
      <button>
        <BiTrash />
      </button>
    </DeleteBtn>
  );
};

export default DeleteButton;

const DeleteBtn = styled(StyledBtn)`
  button {
    margin-bottom: 0.05rem;
  }
`;
