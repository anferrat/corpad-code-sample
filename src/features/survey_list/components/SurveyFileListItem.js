import React, {useRef, useState, useCallback} from 'react'
import {View, StyleSheet, Animated, Platform} from 'react-native'
import Pressable from '../../../components/Pressable'
import {Text, Icon, CircularProgressBar} from '@ui-kitten/components'
import {basic, basic300, control} from '../../../styles/colors'
import {androidRipple} from '../../../styles/styles'
import {getFormattedDate} from '../../../helpers/functions'
import SurveyFileListItemMenu from './SurveyFileListItemMenu'
import SurveyFileListItemMenuItem from './SurveyFileListItemMenuItem'
import SurveyFileListItemIconBar from './SurveyFileListItemIconBar'

const SurveyFileListItem = ({
  name,
  uid,
  fileName,
  timeModified,
  tpCount,
  rectifierCount,
  pipelineCount,
  passedItems,
  cloudId,
  path,
  hash,
  isCloud,
  isSignedIn,
  loadSurvey,
  deleteSurvey,
  removeSurveyFromList,
  shareSurveyFile,
  copyToAlternateFolder,
  copyToDownloads,
}) => {
  const scale = useRef(new Animated.Value(1))
  const isAndroid = Platform.OS === 'android'
  const [menuVisible, setMenuVisible] = useState(false)

  const showMenu = useCallback(() => setMenuVisible(true), [])

  const hideMenu = useCallback(() => setMenuVisible(false), [])

  const handleDelete = React.useCallback(async () => {
    hideMenu()
    const success = await deleteSurvey({path, cloudId, hash, fileName, uid})
    if (success) {
      Animated.timing(scale.current, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => removeSurveyFromList({path, cloudId}))
    }
  }, [path, cloudId, hash, fileName, uid])

  const handleLoadSurvey = useCallback(() => {
    hideMenu()
    loadSurvey({path, cloudId, fileName})
  }, [path, cloudId, fileName])

  const handleShareSurveyFile = useCallback(async () => {
    hideMenu()
    shareSurveyFile({path, cloudId, name})
  }, [path, cloudId, name])

  const handleCopyToDownloads = useCallback(() => {
    hideMenu()
    copyToDownloads({path, cloudId, name})
  }, [path, cloudId, name])

  const handleCopyToAlternateFolder = useCallback(() => {
    hideMenu()
    copyToAlternateFolder({path, cloudId, name})
  }, [path, cloudId, name])

  return (
    <Animated.View
      style={{
        height: scale.current.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 140],
        }),
        transform: [{scale: scale.current}],
      }}>
      <Pressable
        style={styles.pressable}
        android_ripple={androidRipple}
        onPress={handleLoadSurvey}>
        <View style={styles.mainView}>
          <View style={styles.titleView}>
            <CircularProgressBar
              progress={passedItems}
              animating={false}
              status="success"
              style={styles.circle}
              size="large"
            />
            <View style={styles.titleData}>
              <Text category="h5" numberOfLines={1} ellipsizeMode={'tail'}>
                {name}
              </Text>
              <View style={styles.titleRow}>
                <Icon
                  name={isCloud ? 'cloud' : 'smartphone'}
                  style={isCloud ? styles.cloudIcon : styles.smallIcon}
                  fill={basic}
                  pack={isCloud ? 'cp' : null}
                />
                <Text
                  style={styles.fileName}
                  numberOfLines={1}
                  ellipsizeMode={'middle'}
                  appearance="hint"
                  category="s1">
                  {fileName}
                </Text>
              </View>
              <View style={styles.time}>
                <Icon
                  name="clock-outline"
                  style={styles.smallIcon}
                  fill={basic}
                />
                <Text appearance="hint" category="s1">
                  {getFormattedDate(timeModified)}
                </Text>
              </View>
            </View>
          </View>
          <SurveyFileListItemMenu
            showMenu={showMenu}
            hideMenu={hideMenu}
            visible={menuVisible}>
            {isAndroid ? (
              <SurveyFileListItemMenuItem
                onPress={handleCopyToDownloads}
                title="Save to Downloads"
                icon="download-outline"
              />
            ) : null}
            {isSignedIn ? (
              <SurveyFileListItemMenuItem
                onPress={handleCopyToAlternateFolder}
                title={`Copy to ${isCloud ? 'device' : 'cloud'}`}
                icon={isCloud ? 'smartphone-outline' : 'cloud-download-outline'}
              />
            ) : null}
            <SurveyFileListItemMenuItem
              onPress={handleShareSurveyFile}
              title={`Share file`}
              icon={isAndroid ? 'share-outline' : 'share-ios'}
              pack={isAndroid ? null : 'cp'}
            />
            <SurveyFileListItemMenuItem
              status="danger"
              onPress={handleDelete}
              title="Delete"
              icon="trash-outline"
            />
          </SurveyFileListItemMenu>
        </View>
        <SurveyFileListItemIconBar
          tpCount={tpCount}
          pipelineCount={pipelineCount}
          rectifierCount={rectifierCount}
        />
      </Pressable>
    </Animated.View>
  )
}

export default SurveyFileListItem

const styles = StyleSheet.create({
  mainView: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: basic300,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  pressable: StyleSheet.flatten([
    {
      elevation: 5,
      backgroundColor: control,
      marginHorizontal: 6,
      marginTop: 12,
      borderRadius: 12,
    },
    Platform.select({
      android: {
        elevation: 5,
      },
      default: {
        borderWidth: 1,
        borderColor: basic300,
      },
    }),
  ]),
  circle: {
    marginRight: 20,
  },
  smallIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  cloudIcon: {
    width: 16,
    height: 16,
    marginTop: 4,
    marginRight: 6,
  },
  time: {
    marginTop: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleData: {
    flex: 1,
    marginRight: 12,
    paddingBottom: 12,
  },
  fileName: {
    flex: 1,
  },
})
