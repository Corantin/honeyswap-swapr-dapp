import { ReactNode } from 'react'
import styled from 'styled-components'

import SwprLogo from '../../assets/images/swpr-logo.png'
import { useShowExpeditionsPopup } from '../../state/application/hooks'
import { ExternalLink, TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import Modal from '../Modal'
import Row from '../Row'

const ContentWrapper = styled(AutoColumn)`
  width: 100%;
  background-color: ${({ theme }) => theme.dark1};
`

const UpperAutoColumn = styled(AutoColumn)`
  padding: 32px;
`

const Text = ({ children }: { children: ReactNode }) => (
  <TYPE.White fontSize="16px" lineHeight="150%">
    {children}
  </TYPE.White>
)

export default function ExpeditionsModal({ onDismiss }: { onDismiss: () => void }) {
  const open = useShowExpeditionsPopup()

  return (
    <Modal maxWidth={630} onDismiss={onDismiss} isOpen={open}>
      <ContentWrapper gap="lg">
        <UpperAutoColumn gap={'32px'}>
          <Row>
            <Text>
              Follow 1hive <ExternalLink href="https://twitter.com/1HiveOrg">Twitter</ExternalLink> or{' '}
              <ExternalLink href="https://discord.gg/rruDSegpP4">Discord</ExternalLink>
            </Text>
          </Row>
        </UpperAutoColumn>
      </ContentWrapper>
    </Modal>
  )
}
