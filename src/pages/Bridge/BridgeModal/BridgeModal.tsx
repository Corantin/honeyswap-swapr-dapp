import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Modal from '../../../components/Modal'
import { BridgeModalState, BridgeModalStatus } from '../../../services/EcoBridge/EcoBridge.types'
import { AppState } from '../../../state'
import { getNetworkInfo } from '../../../utils/networksList'
import { BridgeModalType } from './BridgeModal.types'
import BridgeModalContent from './BridgeModalContent'

export interface BridgeModalProps {
  handleResetBridge: () => void
  setIsCollecting: (collecting: boolean) => void
  setStatus: (status: BridgeModalStatus, error?: string) => void
  modalData: BridgeModalState
  handleSubmit: () => void
}

export const BridgeModal = ({
  handleResetBridge,
  setIsCollecting,
  setStatus,
  modalData,
  handleSubmit,
}: BridgeModalProps) => {
  const [heading, setHeading] = useState('')
  const [disableConfirm, setDisableConfirm] = useState(false)
  const [modalType, setModalType] = useState<BridgeModalType | null>(null)
  const [isWarning, setIsWarning] = useState(false)
  const [bridgeName, setBridgeName] = useState('')

  const { t } = useTranslation('bridge')
  const { status, symbol, typedValue, fromChainId, toChainId, error } = modalData

  const { name: fromNetworkName } = getNetworkInfo(fromChainId)
  const { name: toNetworkName } = getNetworkInfo(toChainId)

  const activeBridge = useSelector((state: AppState) => state.ecoBridge.common.activeBridge)

  const text = t('bridgeModal.modalText', { typedValue, symbol: symbol ?? '', fromNetworkName, toNetworkName })

  useEffect(() => {
    setDisableConfirm(false)
    switch (status) {
      case BridgeModalStatus.INITIATED:
        setModalType('initiated')
        setHeading(t('bridgeModal.heading.initiated'))
        break
      case BridgeModalStatus.PENDING:
        setModalType('pending')
        break
      case BridgeModalStatus.COLLECTING:
        setModalType('collecting')
        setHeading(t('bridgeModal.heading.collecting'))
        break
      case BridgeModalStatus.SUCCESS:
        setModalType('success')
        setHeading(t('bridgeModal.heading.success'))
        break
      case BridgeModalStatus.ERROR:
        setModalType('error')
        break
      case BridgeModalStatus.DISCLAIMER:
        setHeading(t('bridgeModal.heading.disclaimer', { typedValue, symbol: symbol ?? '' }))
        setModalType('disclaimer')
        break

      default:
        setModalType(null)
    }

    if (activeBridge === 'socket') {
      setIsWarning(true)
      setBridgeName('Socket Network')
    }

    if (activeBridge?.includes('arbitrum')) {
      setIsWarning(false)
      setBridgeName('Arbitrum One Bridge')
    }

    if (activeBridge === 'xdai') {
      setIsWarning(false)
      setBridgeName('xDai Bridge')
    }

    if (activeBridge === 'connext') {
      setIsWarning(false)
      setBridgeName('Connext Network')
    }
    if (activeBridge?.includes('omnibridge')) {
      setIsWarning(false)
      setBridgeName('OmniBridge')
    }
  }, [activeBridge, status, symbol, t, typedValue])

  const onDismiss = () => {
    handleResetBridge()

    if ((['disclaimer', 'error', 'success'] as BridgeModalType[]).includes(modalType)) {
      setStatus(BridgeModalStatus.CLOSED)
    }

    if (modalType === 'collecting') {
      setIsCollecting(false)
    }
  }

  if (modalType === null) {
    return null
  }

  return (
    <Modal isOpen={true} onDismiss={onDismiss}>
      <BridgeModalContent
        modalType={modalType}
        text={text}
        heading={heading}
        onDismiss={onDismiss}
        onConfirm={handleSubmit}
        error={error ?? ''}
        disableConfirm={disableConfirm}
        setDisableConfirm={setDisableConfirm}
        bridgeName={bridgeName}
        isWarning={isWarning}
      />
    </Modal>
  )
}
