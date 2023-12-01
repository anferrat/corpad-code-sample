import {Error, errors} from '../../utils/Error'
import {gdrive, config, folderIds} from '../../config/cloud_drive'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'

export class GoogleDriveAuthorizationRepository {
  constructor() {
    GoogleSignin.configure(config)
  }

  async signIn() {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      const token = (await GoogleSignin.getTokens()).accessToken
      gdrive.accessToken = token
      return {
        userName: userInfo.user.name,
      }
    } catch (er) {
      if (er.code === statusCodes.SIGN_IN_CANCELLED)
        throw new Error(
          errors.GENERAL,
          'Sign in cancelled',
          'Cancelled by user',
          101,
        )
      else throw new Error(errors.AUTH, 'Unable to sign in', er, 303)
    }
  }

  async signInSilently() {
    return new Promise(async resolve => {
      try {
        const timer = setTimeout(() => {
          resolve({
            isSigned: false,
            userName: null,
          })
        }, 2000)
        const userInfo = await GoogleSignin.signInSilently()
        const token = (await GoogleSignin.getTokens()).accessToken
        clearTimeout(timer)
        gdrive.accessToken = token
        resolve({
          isSigned: true,
          userName: userInfo.user.name,
        })
      } catch (er) {
        resolve({
          isSigned: false,
          userName: null,
        })
      }
    })
  }

  async checkSignInStatus() {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn()
      if (isSignedIn) {
        const userInfo = await GoogleSignin.getCurrentUser()
        const token = (await GoogleSignin.getTokens()).accessToken
        gdrive.accessToken = token
        return {
          isSigned: true,
          userName: userInfo.user.name,
        }
      } else
        return {
          isSigned: false,
        }
    } catch (er) {
      return {isSigned: false}
    }
  }

  async signOut() {
    try {
      await GoogleSignin.signOut()
      gdrive.accessToken = null
      folderIds.appFolder = undefined
      folderIds.assetFolder = undefined
    } catch (er) {
      throw new Error(errors.AUTH, 'Unable to sign out', er, 304)
    }
  }
}
