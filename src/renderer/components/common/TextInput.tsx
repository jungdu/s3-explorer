import React from "react";
import styled from "styled-components";
const Self = styled.div`
  overflow: hidden;
`;

const Label = styled.div`
  font-size: 12px;
  color: #8d8d8d;
  margin-bottom: 2px;
`;

const Input = styled.input`
  font-size: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;

  &:focus {
    outline: none;
  }
`;
interface Props {
  className?: string;
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const TextInput: React.FC<Props> = ({ className, label, onChange, value }) => {
  return (
    <Self className={className}>
      <Label>{label}</Label>
      <Input type="text" onChange={onChange} value={value} />
    </Self>
  );
};

export default TextInput;
