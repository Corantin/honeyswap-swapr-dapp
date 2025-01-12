import { AlertCircle } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'

import { ButtonPrimary } from '../../../components/Button'
import { ConfirmationPendingContent, TransactionErrorContent } from '../../../components/TransactionConfirmationModal'
import { TYPE } from '../../../theme'
import {
  ButtonAccept,
  ButtonCancel,
  ButtonsWrapper,
  DisclaimerText,
  DisclaimerTextWrapper,
  SuccessCheck,
  TitleWrapper,
  Wrapper,
} from './BridgeModal.styles'
import { BridgeModalType } from './BridgeModal.types'

interface BridgeModalContentProps {
  modalType: BridgeModalType
  onDismiss: () => void
  text: string
  error: string
  heading: string
  isWarning: boolean
  onConfirm: () => void
  disableConfirm: boolean
  setDisableConfirm: (val: boolean) => void
  bridgeName: string
}

export default function BridgeModalContent({
  onDismiss,
  modalType,
  text,
  error,
  heading,
  onConfirm,
  disableConfirm,
  setDisableConfirm,
  isWarning,
  bridgeName,
}: BridgeModalContentProps) {
  const { t } = useTranslation('bridge')
  switch (modalType) {
    case 'pending':
      return <ConfirmationPendingContent onDismiss={onDismiss} pendingText={text} />
    case 'error':
      return <TransactionErrorContent onDismiss={onDismiss} message={error} />
    case 'success':
      return (
        <Wrapper data-testid="bridge-initiated-modal">
          <SuccessCheck strokeWidth={0.5} size={75} color="#FFF" />
          <TitleWrapper>
            <TYPE.Body fontSize="22px" fontWeight="500" color="text1" textAlign="center">
              {heading}
            </TYPE.Body>
          </TitleWrapper>
          <TYPE.Main>{text}</TYPE.Main>{' '}
          <ButtonsWrapper>
            <ButtonPrimary data-testid="close-bridge-initiated-button" onClick={onDismiss}>
              {t('bridge.backText')}
            </ButtonPrimary>
          </ButtonsWrapper>
        </Wrapper>
      )
    case 'initiated':
    case 'collecting':
      return (
        <Wrapper data-testid="bridge-initiated-modal">
          <TitleWrapper>
            <TYPE.Body fontSize="22px" fontWeight="500" color="text1" textAlign="center">
              {heading}
            </TYPE.Body>
          </TitleWrapper>
          <TYPE.Main textAlign="center" mb="24px">
            {text}
          </TYPE.Main>
          <ButtonPrimary data-testid="close-bridge-initiated-button" onClick={onDismiss}>
            {t('bridge.backText')}
          </ButtonPrimary>
        </Wrapper>
      )
    case 'disclaimer':
      return (
        <Wrapper data-testid="bridge-initiated-modal">
          <AlertCircle strokeWidth={0.5} size={75} color="#EBE9F8" />
          <TitleWrapper>
            <TYPE.Body fontSize="22px" fontWeight="500" color="text1" textAlign="center">
              {heading}
            </TYPE.Body>
          </TitleWrapper>
          <TYPE.Main fontSize="14px" fontWeight="500" color="#EBE9F8" textAlign="center" lineHeight="1.6">
            {text}
          </TYPE.Main>
          <DisclaimerTextWrapper isWarning={isWarning}>
            <DisclaimerText>
              <Trans i18nKey="bridge:bridge.txnThrough" values={{ bridgeName }} components={[<span key="0"></span>]} />
            </DisclaimerText>
            {isWarning && <DisclaimerText>{t('bridge.walletControl', { bridgeName })}</DisclaimerText>}
            <DisclaimerText>
              <Trans i18nKey="bridge:bridge.responsible" components={[<span key="0"></span>]} />
            </DisclaimerText>
          </DisclaimerTextWrapper>
          <ButtonAccept
            data-testid="accept-bridging"
            mb="12px"
            disabled={disableConfirm}
            onClick={() => {
              setDisableConfirm(true)
              onConfirm()
            }}
            isWarning={isWarning}
          >
            {t('bridge.confirmText')}
          </ButtonAccept>
          <ButtonCancel onClick={onDismiss}>{t('bridge.rejectText')}</ButtonCancel>
        </Wrapper>
      )

    default:
      return null
  }
}
