export default class FileDownloader {
    constructor() {
        this.unzip = true
        this.downloader = new FileTransfer()
    }

    start (downloadUrl, downloadLocation, onProgress, onComplete, onError) {
        // console.log("FileDownloader", downloadUrl, downloadLocation)
        this.downloader.onprogress = (progress) => {
            if (progress.lengthComputable) {
                onProgress(progress.loaded / progress.total)
            } else {
                // loadingStatus.increment();
            }
        }

        this.downloader.download(
            downloadUrl,
            downloadLocation,
            (entry) => {
                // console.log("download complete: " + entry.toURL());
                if (!this.unzip) {
                    // this is not zip file
                    onComplete()
                } else {
                    // this is zip file, need to unzip
                    let parentParts = downloadLocation.split('/')
                    parentParts.pop()
                    let parentPath = parentParts.join('/')
                    // console.log('unzip', downloadLocation, parentPath)
                    zip.unzip(downloadLocation, parentPath, (status) => {
                        if (status == 0) {
                            onComplete()
                        } else {
                            onError('Unzip failed.')
                        }
                        this.deleteFile(downloadLocation)
                    }, progress => {
                        console.debug('zip progress', Math.round((progress.loaded / progress.total) * 100))
                    })
                }
            },
            (error) => {
                onError(error)
                // console.log("download error source " + error.source);
                // console.log("download error target " + error.target);
                // console.log("download error code" + error.code);
            }
            // ,
            // false, {
            //     headers: {
            //         "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            //     }
            // }
        )
    }

    stop () {
        this.downloader.abort()
    }

    deleteFile (path) {
        window.resolveLocalFileSystemURL(path, function (fileEntry) {
            fileEntry.remove()
        }, err => {
            console.error(err)
        })
    }
}
