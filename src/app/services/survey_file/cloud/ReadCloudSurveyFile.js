import {FileSystemLocations} from '../../../../constants/global'
import {Error, errors} from '../../../utils/Error'

export class ReadCloudSurveyFile {
  constructor(
    cloudFileSystemRepo,
    fileSystemRepo,
    networkRepo,
    convertFileToSurveyService,
    downloadFiles,
    assetFileDownloadControl,
  ) {
    this.fileSystemRepo = fileSystemRepo
    this.cloudFileSystemRepo = cloudFileSystemRepo
    this.networkRepo = networkRepo
    this.convertFileToSurveyService = convertFileToSurveyService
    this.downloadFiles = downloadFiles
    this.assetFileDownloadControl = assetFileDownloadControl
  }

  async execute(cloudId, onDownload) {
    const internetOn = await this.networkRepo.checkConnection()
    if (internetOn) {
      const {file, fileName} = await this.cloudFileSystemRepo.readFile(cloudId)
      const {surveyFile, isRecovered} =
        await this.convertFileToSurveyService.execute(file)
      const currentAssetFolderPath = await this.fileSystemRepo.getLocation(
        FileSystemLocations.CURRENT_ASSETS,
      )
      const localAssetFiles = await this.fileSystemRepo.readDir(
        FileSystemLocations.ASSETS,
        surveyFile.survey.uid,
      )
      const cloudAssetFiles =
        await this.cloudFileSystemRepo.readSurveyAssetFolder(
          surveyFile.survey.uid,
        )
      const {cloudFilesToDownload, missingAssets, localFilesToCopy} =
        await this.assetFileDownloadControl.execute(
          surveyFile.assets,
          cloudAssetFiles,
          localAssetFiles,
        )
      //add warning message for missing assets
      await this.downloadFiles.execute(
        cloudFilesToDownload,
        currentAssetFolderPath,
        ({total, current}) =>
          onDownload ? onDownload(total, current + 1) : null,
      )
      await this.fileSystemRepo.copyFiles(
        currentAssetFolderPath,
        localFilesToCopy,
      )
      return {
        fileName,
        surveyFile,
        hash: null,
        isCloud: true,
        cloudId: cloudId,
        isNew: false,
        isRecovered,
      }
    } else
      throw new Error(
        errors.NETWORK,
        'Unable to connect to internet',
        'No internet',
        102,
      )
  }
}
