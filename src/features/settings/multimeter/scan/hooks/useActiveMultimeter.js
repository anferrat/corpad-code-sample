import {useCallback, useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  startMultimeterScan,
  stopMultimeterScan,
  multimeterScanListener,
  multimeterStopScanListener,
  pairMultimeter,
  unpairMultimeter,
  connectMultimeter,
  disconnectMultimeter,
  addMultimeterStatusListener,
  checkBleState,
} from '../../../../../app/controllers/MultimeterController'
import {addBluetoothStatusListener} from '../../../../../app/controllers/AppController'
import {
  setActiveMultimeter,
  setActiveMultimeterStatus,
  showPaywall,
} from '../../../../../store/actions/settings'
import {errorHandler} from '../../../../../helpers/error_handler'
import useModal from '../../../../../hooks/useModal'
import {hapticMedium} from '../../../../../native_libs/haptics'
import {isProStatus} from '../../../../../helpers/functions'

const initialState = []

const useActiveMultimeter = () => {
  const dispatch = useDispatch()
  const activeMultimeter = useSelector(state => state.settings.activeMultimeter)
  const subscriptionStatus = useSelector(
    state => state.settings.subscription.status,
  )
  const isPro = isProStatus(subscriptionStatus)
  const [isBluetoothOn, setIsBluetoothOn] = useState(false)
  const [scannedDevices, setScannedDevices] = useState(initialState)
  const [pairingId, setPairingId] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const {showModal, hideModal, visible} = useModal(false)
  const connectingFlag = useRef(false)
  const scanningRef = useRef(false)
  const componentMounted = useRef(true)

  const onPaywallShow = useCallback(() => {
    dispatch(showPaywall())
  }, [])

  useEffect(() => {
    const deviceListener = multimeterScanListener({
      onDiscovered: (id, name, type, rssi) => {
        setScannedDevices(state => {
          const exists = ~state.findIndex(device => device.id === id)
          if (!exists) return state.concat({id, name, type, rssi})
          else return state
        })
      },
      pairedId: activeMultimeter.id,
    })
    return () => {
      if (deviceListener.response) deviceListener.response.remove()
    }
  }, [activeMultimeter.id])

  useEffect(() => {
    componentMounted.current = true
    //listens for when scan was stopped

    const getBleState = async () => {
      const isOn = await checkBleState()
      setIsBluetoothOn(isOn.response)
    }

    getBleState()
    const stopScan = multimeterStopScanListener(() => {
      setScanning(false)
      scanningRef.current = true
    })

    const connectedDevices = addMultimeterStatusListener(({isConnected}) => {
      if (isConnected) {
        setConnecting(false)
        connectingFlag.current = false
      }
    })

    const bluetoothListener = addBluetoothStatusListener(isOn =>
      setIsBluetoothOn(isOn),
    )

    return () => {
      componentMounted.current = false
      if (stopScan.response) stopScan.response.remove()
      if (connectedDevices.response) connectedDevices.response()
      if (bluetoothListener.response) bluetoothListener.response.remove()
      if (scanningRef.current) stopMultimeterScan()
    }
  }, [])

  const pairDevice = useCallback(
    async (id, name, multimeterType) => {
      if (pairingId === null) {
        setPairingId(id)
        setConnecting(true)
        stopMultimeterScan()
        const {status} = await pairMultimeter({id, multimeterType, name})
        if (status === 200) {
          dispatch(setActiveMultimeter(true, id, name, multimeterType))
          hapticMedium()
          if (componentMounted.current)
            setScannedDevices(state => state.filter(device => device.id !== id))
        } else {
          setConnecting(false)
          errorHandler(status)
        }
        setPairingId(null)
      }
    },
    [setConnecting, setPairingId, pairingId],
  )

  const unpairDevice = useCallback(async () => {
    const {status} = await unpairMultimeter()
    if (status === 200) {
      dispatch(setActiveMultimeter(false, null, null, null, false))
      hapticMedium()
    } else errorHandler(status)
  }, [])

  const connectToActiveMultimeter = useCallback(async () => {
    if (isPro) {
      if (!activeMultimeter.connected) {
        setConnecting(true)
        connectingFlag.current = true
        const {response, status} = await connectMultimeter()
        if (status === 200 && response.isConnected) {
          if (componentMounted.current) setConnecting(false)
          dispatch(setActiveMultimeterStatus(true))
        } else if (status === 903) errorHandler(903)
        else {
          setTimeout(() => {
            if (connectingFlag.current) {
              disconnectMultimeter()
              if (componentMounted.current) {
                setConnecting(false)
                errorHandler(822)
              }
            }
          }, 5000)
        }
      }
    } else {
      onPaywallShow()
    }
  }, [activeMultimeter.connected, isPro, onPaywallShow])

  const scanDevices = useCallback(async () => {
    hideModal()
    if (!scanning && isBluetoothOn) {
      const {status} = await startMultimeterScan()
      if (status === 200) {
        if (componentMounted.current) {
          setScannedDevices(initialState)
          setScanning(true)
          scanningRef.current = true
        }
      } else errorHandler(status)
    }
  }, [scanning, isBluetoothOn])

  const onShowModal = useCallback(() => {
    if (isPro) showModal()
    else onPaywallShow()
  }, [isPro])

  return {
    scanDevices,
    connectToActiveMultimeter,
    scannedDevices,
    scanning,
    isBluetoothOn,
    activeMultimeter,
    pairDevice,
    unpairDevice,
    pairingId,
    connecting,
    pairing: pairingId !== null && !activeMultimeter.paired,
    showModal: onShowModal,
    hideModal,
    onPaywallShow,
    visible,
    isPro,
  }
}

export default useActiveMultimeter
