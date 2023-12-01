import {fieldProperties} from '../../../constants/fieldProperties'
import {deleteItem} from '../handlers/deleteItem'
import {deleteSubitem} from '../handlers/deleteSubitem'
import {openExternalSurvey} from '../handlers/openExternalFile'
import {DEVELOPER_MODE_ON} from '../../../../App'
import {deleteImportSubitem} from '../../../store/actions/importData'
import {warningHandler} from '../../../helpers/error_handler'
import {ItemTypes} from '../../../constants/global'
import {
  CalculatorTypeTitleLabels,
  ItemTypeLabels,
  SubitemTypeLabels,
} from '../../../constants/labels'
import {
  CalculatorTypeIconPacks,
  CalculatorTypeIcons,
} from '../../../constants/icons'
import {deleteMapLayer} from '../handlers/deleteMapLayer'

export const getEditTitle = (globalState, type) => {
  const state = ~Object.values(ItemTypes).indexOf(type)
    ? globalState.item.edit
    : globalState.subitem
  return state?.name === null || state?.name === ''
    ? state?.defaultName
    : state?.name ?? 'Loading...'
}

export const getEditSubtype = (state, type) =>
  ~Object.values(ItemTypes).indexOf(type)
    ? state.item.edit?.testPointType
    : state.subitem.type

const getTitleBySettingType = setting => {
  switch (setting) {
    case 'defaultNames':
      return 'Default names'
    case 'potentials':
      return 'Potentials'
    case 'refCells':
      return 'Reference cells'
    case 'export':
      return 'Export to spreadsheet'
    case 'exportedFiles':
      return 'Exported files'
    case 'info':
      return 'Survey overview'
    case 'about':
      return 'About'
    case 'licenses':
      return 'Licenses'
    case 'multimeter':
      return 'Multimeter'
    default:
      return 'Settings'
  }
}
/*
getHeader returns object with Header data for TopBar component. 

getHeader : {
    display: true|false - is header shown for the screen
    left: 'back'| null  (back button displayed if 'back')
    right: [               //generates icon buttons on right side.
        ...,
        {
            cloudButton?: true | false - renders CloudButton component if true, ignores other props
            icon: <iconName>,
            pack?: <packName>,
            onPress: ()=>{}
        },
    ],
    title: 'Title' | {
        title: 'Title',
        subtitle: 'Subtitle',
        icon?: <iconName>,
        pack?: <iconpack>,

        //special props to render components that refer global store, kinda ugly, but hopefully rest of the screens will have standard header titles

        surveyTitle?: true | false render Survey title component, ignores other props
        mainMenuTitle?: true | false renders mainMenuTitle component, ignores other props
        editTitle?: true | false renders Edit Title,
        viewTitle?: true | false renders ViewTitle
    }
}

*/

export const getHeader = (screen, params, navigation, dispatch, openMenu) => {
  if (dispatch && openMenu && navigation && screen)
    switch (screen) {
      case 'ExportItem':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: 'Export survey',
            subtitle: 'Item properties',
            icon: 'download-outline',
            pack: null,
          },
        }
      case 'ExportPotentials':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: 'Export survey',
            subtitle: 'Potentials',
            icon: 'download-outline',
            pack: null,
          },
        }
      case 'ExportSubitems':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: 'Export survey',
            subtitle: 'More properties',
            icon: 'download-outline',
            pack: null,
          },
        }
      case 'ExportOverview':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: 'Export survey',
            subtitle: 'Overview',
            icon: 'download-outline',
            pack: null,
          },
        }
      case 'ViewMapLayer':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: 'Map',
            subtitle: 'Layers',
            icon: 'globe-2',
            pack: null,
          },
        }
      case 'ViewMarkerInfo':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: 'Marker properties',
        }
      case 'EditMapLayer':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: 'Map',
            subtitle: 'Create new layer',
            icon: 'globe-2',
            pack: null,
          },
          right: [
            {
              icon: 'trash',
              onPress: () => deleteMapLayer(dispatch, navigation, params),
            },
          ],
        }
      case 'Onboarding':
        return {
          display: false,
        }
      case 'ViewItem':
        return {
          display: true,
          left: 'back',
          title: {
            viewTitle: true,
            itemType: params.itemType,
          },
          right: [{navigationWidget: true}],
          isPrimary: false,
        }
      case 'DevScreen':
        return {
          display: false,
        }
      case 'TestPoints':
      case 'Rectifiers':
      case 'Pipelines':
        return {
          noBorder: true,
          display: true,
          isPrimary: false,
          left: null,
          title: {
            surveyTitle: true,
          },
          right: [
            {
              cloudButton: true,
            },
            {
              icon: 'search',
              onPress: () => navigation.navigate('Search'),
            },
            {
              icon: 'more-vertical-outline',
              onPress: openMenu,
            },
          ].concat(
            DEVELOPER_MODE_ON
              ? {
                  icon: 'eye',
                  onPress: () => navigation.navigate('DevScreen'),
                }
              : [],
          ),
        }
      case 'Map':
        return {
          display: false,
        }
      case 'ImportItem':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: ItemTypeLabels[params.itemType] ?? '',
            subtitle: 'Import from .csv',
            icon: false,
            pack: null,
          },
          right: null,
        }
      case 'ImportSubitem':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: SubitemTypeLabels[params.subitemType] ?? '',
            subtitle: 'Import settings',
            icon: false,
            pack: null,
          },
          right: [
            {
              icon: 'trash',
              onPress: async () => {
                const confirm = await warningHandler(59, 'Delete', 'Cancel')
                if (confirm) {
                  navigation.goBack()
                  dispatch(deleteImportSubitem(params.subitemIndex))
                }
              },
            },
          ],
        }
      case 'ImportFile':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: 'Import from .csv',
          right: null,
        }
      case 'ImportParameters':
        return {
          display: true,
          isPrimary: true,
          left: 'back',
          title: {
            title: `Property: "${
              params.property === 'potential'
                ? 'Potentials'
                : fieldProperties[params.property]?.label ?? null
            }"`,
            subtitle: 'Import from .csv',
            icon: false,
            pack: null,
          },
          right: null,
        }
      case 'EditItem':
        return {
          display: true,
          isPrimary: false,
          left: 'back',
          title: {
            editTitle: true,
            itemType: params.itemType,
          },
          right: [
            {
              icon: 'trash',
              onPress: () =>
                deleteItem(params.itemId, params.itemType, navigation),
            },
          ],
        }
      case 'EditSubitem':
        return {
          display: true,
          isPrimary: false,
          left: 'back',
          title: {
            editSubitemTitle: true,
            subitemType: params.subitemType,
          },
          right: [
            {
              icon: 'trash',
              onPress: () =>
                deleteSubitem(
                  params.itemId,
                  params.subitemId,
                  params.subitemType,
                  navigation,
                ),
            },
          ],
        }
      case 'Search':
        return {
          display: false,
        }
      case 'Settings':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: 'Settings',
          right: null,
        }
      case 'CloudSurveyList':
      case 'Authorization':
      case 'NoInternetScreen':
      case 'DeviceSurveyList':
        return {
          display: true,
          left: null,
          isPrimary: true,
          title: {
            mainMenuTitle: true,
          },
          right: [
            {
              icon: 'folder',
              onPress: () => openExternalSurvey(dispatch),
            },
            {
              icon: 'plus',
              onPress: () =>
                navigation.navigate('CreateSurvey', {withImport: false}),
            },
          ].concat(
            DEVELOPER_MODE_ON
              ? {
                  icon: 'eye',
                  onPress: () => navigation.navigate('DevScreen'),
                }
              : [],
          ),
        }
      case 'CreateSurvey':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: 'Create survey',
          right: null,
        }
      case 'SettingDetails':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: getTitleBySettingType(params.setting),
          right: null,
        }
      case 'Licences':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: 'Licences',
          right: null,
        }
      case 'CycleSettings':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: 'Cycle settings',
          right: null,
        }
      case 'Spreadsheet':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: {
            title: params?.title ?? 'Error',
            subtitle: '.csv file preview',
          },
          right: null,
        }
      case 'Calculator':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: {
            title: CalculatorTypeTitleLabels[params?.calculatorType] ?? 'Error',
            subtitle: 'Corrosion calculator',
            icon: CalculatorTypeIcons[params?.calculatorType],
            pack: CalculatorTypeIconPacks[params?.calculatorType],
          },
          right: [
            {
              icon: 'question-mark-circle-outline',
              onPress: () =>
                navigation.navigate('CalculatorDescription', {
                  calculatorType: params?.calculatorType,
                }),
            },
          ],
        }
      case 'CalculatorDescription':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: {
            title: CalculatorTypeTitleLabels[params?.calculatorType] ?? 'Error',
            subtitle: 'Procedure description',
            icon: CalculatorTypeIcons[params?.calculatorType],
            pack: CalculatorTypeIconPacks[params?.calculatorType],
          },
          right: null,
        }
      case 'CalculatorList':
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: 'Corrosion calculator',
          right: null,
        }
      case 'Home':
        return {
          display: false,
        }
      default:
        return {
          display: true,
          left: 'back',
          isPrimary: true,
          title: screen,
          right: null,
        }
    }
  else
    return {
      display: 'false',
    }
}
