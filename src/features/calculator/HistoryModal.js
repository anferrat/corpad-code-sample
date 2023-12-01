import React, {useState} from 'react'
import {Modal, StyleSheet} from 'react-native'
import {Button} from '@ui-kitten/components'
import {errorHandler, warningHandler} from '../../helpers/error_handler'
import {basic200, primary} from '../../styles/colors'
import FlatList from './components/FlatList'
import HistoryListItem from './components/HistoryListItem'
import {getFormattedDate} from '../../helpers/functions'
import EmptyListComponent from '../../components/EmptyListComponent'
import LoadingView from '../../components/LoadingView'
import {getCalculatorListByType} from '../../app/controllers/CalculatorController'
import {
  CalculatorTypeIconPacks,
  CalculatorTypeIcons,
} from '../../constants/icons'
import {CalculatorTypeTitleLabels} from '../../constants/labels'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import BottomButton from '../../components/BottomButton'
import Header from '../../components/Header'

const HistoryModal = props => {
  const [visible, setVisible] = useState(false)
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(true)

  const displayModal = React.useCallback(async () => {
    setVisible(true)
    const {response, status, errorMessage} = await getCalculatorListByType({
      calculatorType: props.calculatorType,
    })
    if (status === 200) {
      setHistoryList(
        response.map(
          ({id, name, type, data, latitude, longitude, timeCreated}) => ({
            id,
            name,
            calculatorType: type,
            latitude,
            longitude,
            timeCreated,
            data,
          }),
        ),
      )
      setLoading(false)
    } else {
      errorHandler(status)
    }
  }, [setLoading, setHistoryList, setVisible])

  const hideModal = React.useCallback(() => {
    setVisible(false)
    setLoading(true)
  }, [setVisible, setLoading])

  const loadCalculatorHandler = React.useCallback(
    async (data, id) => {
      setLoading(true)
      setTimeout(() => {
        props.loadHandler(data, id)
      }, 20)
      setVisible(false)
    },
    [props.loadHandler, setLoading, setVisible],
  )

  const renderItem = React.useCallback(
    ({item, index}) => {
      return (
        <HistoryListItem
          active={props.activeCalculatorId === item.id}
          onPress={loadCalculatorHandler.bind(this, item.data, item.id)}
          onDeleteHandler={deleteHistoryItem.bind(this, item.id)}
          icon={CalculatorTypeIcons[props.calculatorType]}
          pack={CalculatorTypeIconPacks[props.calculatorType]}
          title={`${CalculatorTypeTitleLabels[props.calculatorType]} (${
            item.name
          })`}
          subtitle={getFormattedDate(item.timeCreated)}
        />
      )
    },
    [loadCalculatorHandler, props.activeCalculatorId],
  )

  const deleteHistoryItem = React.useCallback(
    id => {
      setHistoryList(old => old.filter(item => item.id !== id))
      props.onDeleteHandler(id)
    },
    [setHistoryList],
  )

  const deleteAllHandler = React.useCallback(async () => {
    const confirm = await warningHandler(47, 'Delete all', 'Cancel')
    if (confirm) {
      setLoading(true)
      const deleteConfirm = await props.onDeleteAllHandler()
      if (deleteConfirm) {
        setVisible(false)
        props.resetCalculator()
      } else {
        errorHandler(648)
        setLoading(false)
      }
    }
  }, [setLoading, props.resetCalculator, props.onDeleteAllHandler, setVisible])

  return (
    <>
      <Button appearance="ghost" onPress={displayModal} style={styles.button}>
        History...
      </Button>
      <Modal animationType="slide" visible={visible} onRequestClose={hideModal}>
        <SafeAreaProvider>
          <Header onBackPress={hideModal} title="Saved calculations" />
          <LoadingView loading={loading}>
            <FlatList
              ListEmptyComponent={
                <EmptyListComponent
                  title={'No calculations found'}
                  description={
                    'After completing a calculation press save button to find it here.'
                  }
                  icon="list-outline"
                />
              }
              style={styles.flatList}
              contentContainerStyle={styles.container}
              data={historyList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </LoadingView>
          {historyList.length > 0 ? (
            <BottomButton
              icon="trash"
              title="Delete all"
              onPress={deleteAllHandler}
              disabled={loading}
            />
          ) : null}
        </SafeAreaProvider>
      </Modal>
    </>
  )
}

export default HistoryModal

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarBackground: {
    backgroundColor: primary,
    paddingTop: 0,
    paddingBottom: 0,
    height: 60,
  },
  title: {
    paddingLeft: 24,
    paddingBottom: 5,
  },
  fullView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: basic200,
  },
  flatList: {
    flex: 1,
    backgroundColor: basic200,
    paddingTop: 6,
  },
  button: {
    marginTop: 6,
    marginBottom: 6,
  },
  container: {
    paddingBottom: 72,
  },
})
