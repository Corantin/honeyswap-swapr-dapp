import { ChevronLeft } from 'react-feather'
import styled from 'styled-components'

export const StyledGoBackIcon = styled(ChevronLeft)`
  color: ${({ theme }) => theme.yellow3};
  width: 16px;
  height: 16px;
  cursor: pointer;
`
